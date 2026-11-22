"""File-backed case store: one directory per case, versioned agent results.

Layout under the data root:

    cases/<case_id>/case.json
    cases/<case_id>/evidence.json          {"E001": {...}, ...}
    cases/<case_id>/review.json            [ {...}, ... ]
    cases/<case_id>/audit.jsonl            one line per write
    cases/<case_id>/results/<agent>/v<n>.json
    cases/<case_id>/results/<agent>/v<n>.verification.json

Several agent sessions write to one case at once, each through its own MCP
server process, so every read-modify-write runs under a per-case directory
lock (mkdir is atomic on every platform). No module global holds case state.
"""

from __future__ import annotations

import base64
import json
import mimetypes
import os
import re
import shutil
import tempfile
import time
import uuid
from contextlib import contextmanager
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Callable, Iterator

from .verify import validate_result

AGENTS = (
    "document-evidence", "product-match", "financial-analysis", "policy-exception",
    "risk-compliance", "collateral", "industry", "consolidation",
)
REASON_CODES = (
    "missing_document", "data_conflict", "rule_fail", "low_confidence",
    "exception_needed", "expert_review", "system_error",
)
REVIEW_DECISIONS = ("confirmed", "needs_info")
_CASE_ID = re.compile(r"^SME-[0-9]{8}-[0-9a-f]{8}$")
LOCK_TIMEOUT_S = 10.0


def _utcnow() -> str:
    return datetime.now(timezone.utc).isoformat(timespec="seconds")


def _write_json(path: Path, data: Any) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    fd, tmp = tempfile.mkstemp(dir=path.parent, prefix=".tmp-", suffix=".json")
    with os.fdopen(fd, "w", encoding="utf-8") as fh:
        json.dump(data, fh, ensure_ascii=False, indent=2)
    os.replace(tmp, path)


def _agent_state(meta: dict[str, Any]) -> str:
    """passed, blocked or unverified, for a result's latest version."""
    ver = meta.get("verification")
    if ver is None:
        return "unverified"
    return "passed" if ver.get("passed") else "blocked"


def _read_json(path: Path, default: Any) -> Any:
    if not path.exists():
        return default
    return json.loads(path.read_text(encoding="utf-8"))


class CaseStore:
    def __init__(self, root: Path, clock: Callable[[], str] = _utcnow):
        self.root = Path(root)
        self.clock = clock

    # -- paths and locking -------------------------------------------------
    def _dir(self, case_id: str) -> Path:
        if not _CASE_ID.match(case_id or ""):
            raise ValueError(f"invalid case_id: {case_id!r}")
        d = self.root / "cases" / case_id
        if not (d / "case.json").exists():
            raise KeyError(f"case not found: {case_id}")
        return d

    @contextmanager
    def _lock(self, case_dir: Path) -> Iterator[None]:
        lock = case_dir / ".lock"
        deadline = time.monotonic() + LOCK_TIMEOUT_S
        while True:
            try:
                lock.mkdir()
                break
            except FileExistsError:
                try:
                    if time.time() - lock.stat().st_mtime > 60.0:
                        shutil.rmtree(lock, ignore_errors=True)
                        continue
                except OSError:
                    pass
                if time.monotonic() > deadline:
                    raise TimeoutError(f"case is locked: {case_dir.name}")
                time.sleep(0.05)
        try:
            yield
        finally:
            try:
                lock.rmdir()
            except FileNotFoundError:
                pass

    def _audit(self, case_dir: Path, action: str, detail: dict[str, Any]) -> None:
        line = json.dumps({"ts": self.clock(), "action": action, **detail}, ensure_ascii=False)
        with open(case_dir / "audit.jsonl", "a", encoding="utf-8") as fh:
            fh.write(line + "\n")

    # -- progress ----------------------------------------------------------
    PROGRESS_STATES = ("running", "done", "failed")

    def add_progress(self, case_id: str, agent: str, step: str, detail: str = "",
                     state: str = "running") -> dict[str, Any]:
        """Append one self-reported step of an agent run (not an audit record: no lock, bounded text)."""
        d = self._dir(case_id)
        if state not in self.PROGRESS_STATES:
            raise ValueError(f"state must be one of {self.PROGRESS_STATES}")
        row = {"ts": self.clock(), "agent": str(agent)[:60], "step": str(step)[:160],
               "detail": str(detail)[:400], "state": state}
        with open(d / "progress.jsonl", "a", encoding="utf-8") as fh:
            fh.write(json.dumps(row, ensure_ascii=False) + "\n")
        return row

    def read_progress(self, case_id: str, since: int = 0, limit: int = 400) -> dict[str, Any]:
        """Rows after the first `since` ones; `next` is the cursor for the following read."""
        path = self._dir(case_id) / "progress.jsonl"
        rows: list[dict[str, Any]] = []
        if path.exists():
            for line in path.read_text(encoding="utf-8").splitlines():
                try:
                    rows.append(json.loads(line))
                except ValueError:
                    continue
        since = max(int(since or 0), 0)
        return {"rows": rows[since:since + limit], "next": min(len(rows), since + limit)}

    # -- cases -------------------------------------------------------------
    def create_case(self, customer: dict[str, Any], request: dict[str, Any],
                    documents: list[dict[str, Any]], flow: str) -> dict[str, Any]:
        if flow not in ("A", "B"):
            raise ValueError("flow must be A or B")
        stamp = self.clock()[:10].replace("-", "")
        case_id = f"SME-{stamp}-{uuid.uuid4().hex[:8]}"
        d = self.root / "cases" / case_id
        d.mkdir(parents=True)
        case = {"case_id": case_id, "created_at": self.clock(), "flow": flow,
                "customer": customer, "request": request, "documents": documents}
        _write_json(d / "case.json", case)
        self._audit(d, "case_create", {"flow": flow, "documents": len(documents)})
        return case

    def get_case(self, case_id: str) -> dict[str, Any]:
        d = self._dir(case_id)
        case = _read_json(d / "case.json", {})
        case["results"] = {a: self._latest_meta(d, a) for a in AGENTS if self._versions(d, a)}
        case["review_open"] = sum(1 for r in _read_json(d / "review.json", []) if r["status"] == "open")
        return case

    # -- evidence ----------------------------------------------------------
    def add_evidence(self, case_id: str, items: list[dict[str, Any]], source_agent: str) -> list[str]:
        d = self._dir(case_id)
        ids = []
        with self._lock(d):
            ev = _read_json(d / "evidence.json", {})
            for item in items:
                if not item.get("source") or "value" not in item:
                    raise ValueError("each evidence item needs 'source' and 'value'")
                eid = f"E{len(ev) + 1:03d}"
                ev[eid] = {**item, "id": eid, "added_by": source_agent, "added_at": self.clock()}
                ids.append(eid)
            _write_json(d / "evidence.json", ev)
            self._audit(d, "evidence_add", {"agent": source_agent, "ids": ids})
        return ids

    def get_evidence(self, case_id: str, ids: list[str] | None = None) -> dict[str, Any]:
        ev = _read_json(self._dir(case_id) / "evidence.json", {})
        return ev if not ids else {i: ev[i] for i in ids if i in ev}

    def document_path(self, case_id: str, doc_id: str) -> Path | None:
        d = self._dir(case_id)
        doc = next((x for x in _read_json(d / "case.json", {}).get("documents", []) if x.get("id") == doc_id), None)
        if not doc or not doc.get("file"):
            return None
        return d / "files" / doc["file"]

    def document_file(self, case_id: str, doc_id: str) -> dict[str, Any]:
        """Return stored file bytes as base64 + mime for preview or download."""
        d = self._dir(case_id)
        doc = next((x for x in _read_json(d / "case.json", {}).get("documents", []) if x.get("id") == doc_id), None)
        if not doc or not doc.get("file"):
            raise KeyError(f"file not found for document: {doc_id}")
        path = d / "files" / doc["file"]
        if not path.is_file():
            raise KeyError(f"file missing on disk: {doc_id}")
        raw = path.read_bytes()
        name = str(doc.get("name") or doc["file"])
        mime = mimetypes.guess_type(name)[0] or "application/octet-stream"
        return {"id": doc_id, "name": name, "mime": mime, "size": len(raw),
                "content_b64": base64.b64encode(raw).decode()}

    # -- results -----------------------------------------------------------
    def _versions(self, d: Path, agent: str) -> list[int]:
        rd = d / "results" / agent
        if not rd.exists():
            return []
        return sorted(int(p.stem[1:]) for p in rd.glob("v*.json") if p.stem[1:].isdigit())

    def _latest_meta(self, d: Path, agent: str) -> dict[str, Any]:
        v = self._versions(d, agent)[-1]
        ver = _read_json(d / "results" / agent / f"v{v}.verification.json", None)
        return {"version": v, "verification": ver}

    def put_result(self, case_id: str, agent: str, payload: dict[str, Any], rerun_reason: str = "") -> dict[str, Any]:
        if agent not in AGENTS:
            raise ValueError(f"unknown agent: {agent}")
        d = self._dir(case_id)
        with self._lock(d):
            known = set(_read_json(d / "evidence.json", {}))
            errors = validate_result(payload, agent=agent, case_id=case_id, known_evidence=known)
            if errors:
                self.add_progress(case_id, agent, "Kết quả bị từ chối, đang sửa",
                                  "; ".join(errors[:2]), "running")
                return {"accepted": False, "errors": errors}
            v = (self._versions(d, agent) or [0])[-1] + 1
            _write_json(d / "results" / agent / f"v{v}.json", {**payload, "_version": v, "_saved_at": self.clock()})
            self._audit(d, "result_put", {"agent": agent, "version": v, "rerun_reason": rerun_reason})
            self.add_progress(case_id, agent, f"Đã lưu kết quả v{v}",
                              f"{len(payload.get('findings', []))} phát hiện", "done")
        return {"accepted": True, "version": v}

    def get_results(self, case_id: str, agent: str | None = None) -> dict[str, Any]:
        d = self._dir(case_id)
        out = {}
        for a in ([agent] if agent else AGENTS):
            vs = self._versions(d, a)
            if not vs:
                continue
            res = _read_json(d / "results" / a / f"v{vs[-1]}.json", {})
            res["verification"] = _read_json(d / "results" / a / f"v{vs[-1]}.verification.json", None)
            out[a] = res
        return out

    def set_verification(self, case_id: str, agent: str, verdict: dict[str, Any]) -> int:
        d = self._dir(case_id)
        with self._lock(d):
            vs = self._versions(d, agent)
            if not vs:
                raise KeyError(f"no result for agent {agent}")
            _write_json(d / "results" / agent / f"v{vs[-1]}.verification.json", {**verdict, "checked_at": self.clock()})
            self._audit(d, "verification", {"agent": agent, "version": vs[-1], "passed": verdict.get("passed")})
        return vs[-1]

    # -- human review queue ------------------------------------------------
    def add_review(self, case_id: str, reason_code: str, detail: str, source_agent: str,
                   evidence_refs: list[str] | None = None) -> dict[str, Any]:
        if reason_code not in REASON_CODES:
            raise ValueError(f"reason_code must be one of {', '.join(REASON_CODES)}")
        d = self._dir(case_id)
        with self._lock(d):
            q = _read_json(d / "review.json", [])
            item = {"id": f"R{len(q) + 1:03d}", "reason_code": reason_code, "detail": detail,
                    "source_agent": source_agent, "evidence_refs": evidence_refs or [],
                    "status": "open", "created_at": self.clock()}
            q.append(item)
            _write_json(d / "review.json", q)
            self._audit(d, "review_add", {"id": item["id"], "reason_code": reason_code, "agent": source_agent})
        return item

    def list_review(self, case_id: str, status: str | None = None) -> list[dict[str, Any]]:
        q = _read_json(self._dir(case_id) / "review.json", [])
        return [r for r in q if status is None or r["status"] == status]

    def resolve_review(self, case_id: str, review_id: str, status: str, note: str, actor: str) -> dict[str, Any]:
        """Record an officer's decision on one review item.

        Not exposed as an MCP tool: only the app backend calls it, and only for a
        request the gateway signed as the dashboard owner, so no agent can close
        an exception or a conflict it raised.
        """
        if status not in REVIEW_DECISIONS:
            raise ValueError(f"status must be one of {', '.join(REVIEW_DECISIONS)}")
        if not note.strip():
            raise ValueError("a note is required")
        d = self._dir(case_id)
        with self._lock(d):
            q = _read_json(d / "review.json", [])
            item = next((r for r in q if r["id"] == review_id), None)
            if item is None:
                raise KeyError(f"review item not found: {review_id}")
            item.update({"status": status, "note": note.strip(), "decided_by": actor, "decided_at": self.clock()})
            _write_json(d / "review.json", q)
            self._audit(d, "review_decide", {"id": review_id, "status": status, "actor": actor})
        return item

    # -- listing and audit -------------------------------------------------
    def list_cases(self) -> list[dict[str, Any]]:
        """Every case, newest first, with the counts a case list shows."""
        root = self.root / "cases"
        out = []
        for d in sorted(root.iterdir(), reverse=True) if root.exists() else []:
            if not _CASE_ID.match(d.name) or not (d / "case.json").exists():
                continue
            case = _read_json(d / "case.json", {})
            metas = {a: self._latest_meta(d, a) for a in AGENTS if self._versions(d, a)}
            review = _read_json(d / "review.json", [])
            high = 0
            for a, m in metas.items():
                res = _read_json(d / "results" / a / f"v{m['version']}.json", {})
                high += sum(1 for f in res.get("findings") or [] if isinstance(f, dict) and f.get("severity") == "high")
            request = case.get("request") or {}
            last = (d / "audit.jsonl").read_text(encoding="utf-8").splitlines()[-1:] if (d / "audit.jsonl").exists() else []
            out.append({
                "case_id": d.name,
                "created_at": case.get("created_at"),
                "updated_at": json.loads(last[0]).get("ts") if last else case.get("created_at"),
                "flow": case.get("flow"),
                "customer_name": (case.get("customer") or {}).get("name"),
                "industry_code": (case.get("customer") or {}).get("industry_code"),
                "amount": request.get("amount"),
                "term_months": request.get("term_months"),
                "purpose": request.get("purpose"),
                "agents": {a: _agent_state(m) for a, m in metas.items()},
                "high_findings": high,
                "agents_done": len(metas),
                "agents_passed": sum(1 for m in metas.values() if (m["verification"] or {}).get("passed")),
                "agents_blocked": sum(1 for m in metas.values()
                                      if m["verification"] is not None and not m["verification"].get("passed")),
                "review_open": sum(1 for r in review if r["status"] == "open"),
                "from_sales": bool(case.get("sales_handover")),
                "checklist_overall": (case.get("sales_handover") or {}).get("checklist_overall"),
            })
        return out

    def read_audit(self, case_id: str, limit: int = 200) -> list[dict[str, Any]]:
        path = self._dir(case_id) / "audit.jsonl"
        if not path.exists():
            return []
        lines = path.read_text(encoding="utf-8").splitlines()[-limit:]
        return [json.loads(line) for line in lines if line.strip()]
