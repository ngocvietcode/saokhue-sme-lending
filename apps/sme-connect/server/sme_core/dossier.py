"""Dossier-completion state on top of the case store: what Sales works on.

Adds to each case directory:

    requirements.json   {key: {status, note, ...}}   the human side of each gap
    drafts.json         [ {...} ]                     customer-request drafts
    files/<D#>-<name>   uploaded document files

Gaps themselves are recomputed from the dossier every time (`gaps.analyse`);
this store only keeps what a person decided about them: requested from the
customer, or waived with a reason. A gap that disappears closes by itself.

Dossiers are built in chat: the Sale tells the dossier coach about the customer
and attaches files; the coach fills fields and imports the files through MCP
tools. Fields are free-form (any snake_case key, with an optional display label)
because dossiers differ; the gap rules decide which ones are required.

Status changes (waive, requested, sent, submitted) are made by the app backend
for a signed dashboard owner, never by an MCP tool, so an agent cannot waive a
requirement.
"""

from __future__ import annotations

import base64
import json
import re
from datetime import date
from pathlib import Path
from typing import Any

from .store import CaseStore, _read_json, _write_json

REQUIREMENT_STATUSES = ("open", "requested", "waived")
STAGES = ("draft", "collecting", "ready", "submitted")
SECTIONS = ("customer", "request", "facts")
MAX_FILE_BYTES = 25 * 1024 * 1024
IMPORT_SUFFIXES = (".pdf", ".png", ".jpg", ".jpeg", ".tif", ".tiff", ".webp", ".heic",
                   ".doc", ".docx", ".xls", ".xlsx", ".csv", ".txt", ".zip")
_KEY = re.compile(r"^[a-z][a-z0-9_]{1,47}$")
_SAFE = re.compile(r"[^A-Za-z0-9._-]+")
_NUMERIC_FIELDS = {
    "amount", "term_months", "charter_capital", "years_in_operation", "equity_contribution_pct",
    "loan_amount", "total_exposure", "existing_exposure", "planned_revenue", "revenue_last_year",
    "net_income_last_year", "total_assets_last_year", "equity_last_year", "vat_revenue_12m",
    "output_contracts_value", "project_total_investment", "asset_purchase_value", "collateral_value",
}
_DATE_FIELDS = {"customer.established", "facts.valuation_date"}


def validate_doc_meta(meta: dict[str, Any] | None) -> dict[str, Any]:
    """Validate structured document metadata (`doc.meta`): flat snake_case -> scalar/None."""
    if not meta:
        return {}
    if not isinstance(meta, dict):
        raise ValueError("document meta must be an object")
    out: dict[str, Any] = {}
    for k, v in meta.items():
        if not isinstance(k, str) or not _KEY.match(k):
            raise ValueError(f"invalid document meta field: {k!r}")
        if isinstance(v, (dict, list)):
            raise ValueError(f"meta.{k} must be a single value")
        out[k] = v
    return out


def _iso_date(value: str, field: str = "date") -> str:
    if not isinstance(value, str):
        raise ValueError(f"invalid {field} (expected YYYY-MM-DD): {value!r}")
    s = value.strip()
    if not re.fullmatch(r"\d{4}-\d{2}-\d{2}", s):
        raise ValueError(f"invalid {field} (expected YYYY-MM-DD): {value!r}")
    try:
        date.fromisoformat(s)
    except ValueError:
        raise ValueError(f"invalid {field} (expected YYYY-MM-DD): {value!r}") from None
    return s


def _coerce_number(v: Any, path: str) -> int | float:
    if isinstance(v, bool):
        raise ValueError(f"{path} must be a number")
    if isinstance(v, (int, float)):
        return v
    if isinstance(v, str):
        s = v.strip().replace(",", "")
        try:
            n = float(s)
        except ValueError:
            raise ValueError(f"{path} must be a number, got {v!r}") from None
        return int(s) if re.fullmatch(r"[+-]?\d+", s) else n
    raise ValueError(f"{path} must be a number")


def _ensure_editable(case: dict[str, Any]) -> None:
    if case.get("submitted"):
        raise ValueError("hồ sơ đã nộp Thẩm định; cần mở lại trên trang trước khi chỉnh sửa")


def validate_case_patch(patch: dict[str, Any]) -> dict[str, Any]:
    """Validate and normalize a case patch before writing or creating a dossier."""
    out: dict[str, Any] = {}
    if "flow" in patch and patch["flow"] not in (None, ""):
        if patch["flow"] not in ("A", "B"):
            raise ValueError("flow must be A or B")
        out["flow"] = patch["flow"]
    for section in SECTIONS:
        sec_in = patch.get(section)
        if not sec_in:
            continue
        sec_out: dict[str, Any] = {}
        for k, v in sec_in.items():
            if not _KEY.match(k):
                raise ValueError(f"invalid field name: {section}.{k}")
            if isinstance(v, (dict, list)):
                raise ValueError(f"{section}.{k} must be a single value")
            if v is not None and v != "":
                path = f"{section}.{k}"
                if k in _NUMERIC_FIELDS:
                    v = _coerce_number(v, path)
                elif path in _DATE_FIELDS:
                    v = _iso_date(str(v), path)
            sec_out[k] = v
        out[section] = sec_out
    if patch.get("labels"):
        labels_out: dict[str, str] = {}
        for path, label in patch["labels"].items():
            section, _, key = str(path).partition(".")
            if section not in SECTIONS or not _KEY.match(key) or not isinstance(label, str) or not label.strip():
                raise ValueError(f"invalid label for {path!r}")
            labels_out[str(path)] = label.strip()[:80]
        out["labels"] = labels_out
    return out


def _within(path: Path, roots: list[Path]) -> bool:
    for root in roots:
        try:
            path.relative_to(root.resolve())
            return True
        except ValueError:
            continue
    return False


class DossierStore(CaseStore):
    # -- case fields ---------------------------------------------------------
    def update_case(self, case_id: str, patch: dict[str, Any], actor: str) -> dict[str, Any]:
        """Set fields in customer/request/facts; any snake_case key, `None` removes it.

        `patch["labels"]` maps `section.key` to a display label for a field the
        catalogue does not name, so the page can show any dossier's fields.
        """
        norm = validate_case_patch(patch)
        d = self._dir(case_id)
        with self._lock(d):
            case = _read_json(d / "case.json", {})
            _ensure_editable(case)
            changed = []
            if "flow" in norm:
                case["flow"] = norm["flow"]
                changed.append("flow")
            for section in SECTIONS:
                for k, v in (norm.get(section) or {}).items():
                    if v is None or v == "":
                        case.setdefault(section, {}).pop(k, None)
                    else:
                        case.setdefault(section, {})[k] = v
                    changed.append(f"{section}.{k}")
            for path, label in (norm.get("labels") or {}).items():
                case.setdefault("labels", {})[path] = label
            _write_json(d / "case.json", case)
            self._audit(d, "case_update", {"fields": changed, "actor": actor})
        return case

    # -- documents -----------------------------------------------------------
    def import_file(self, case_id: str, src: str, *, roots: list[Path], doc_type: str = "",
                    issued_date: str | None = None, summary: str = "", meta: dict[str, Any] | None = None,
                    actor: str) -> dict[str, Any]:
        """Copy a file the Sale attached in chat into the dossier.

        Only a regular file of an accepted type inside one of `roots` (the
        gateway's upload folder, chat attachment folders, configured import
        folders) is taken, so a tool call cannot pull arbitrary local files in.
        """
        path = Path(src).expanduser()
        try:
            path = path.resolve(strict=True)
        except OSError:
            raise ValueError(f"file not found: {src}") from None
        if not path.is_file():
            raise ValueError(f"not a file: {src}")
        if not _within(path, roots):
            raise ValueError("this file is not in a chat upload folder; ask the Sale to attach it in chat")
        if path.suffix.lower() not in IMPORT_SUFFIXES:
            raise ValueError(f"file type {path.suffix or '(none)'} is not accepted for a dossier")
        if path.stat().st_size > MAX_FILE_BYTES:
            raise ValueError("file is larger than 25 MB")
        return self.add_document(case_id, name=path.name, doc_type=doc_type, issued_date=issued_date,
                                 data=path.read_bytes(), summary=summary, meta=meta, actor=actor)

    def add_document(self, case_id: str, *, name: str, doc_type: str, issued_date: str | None,
                     content_b64: str | None = None, data: bytes | None = None, summary: str = "",
                     meta: dict[str, Any] | None = None, actor: str) -> dict[str, Any]:
        if issued_date:
            issued_date = _iso_date(str(issued_date), "issued_date")
        norm_meta = {k: v for k, v in validate_doc_meta(meta).items() if v is not None and v != ""}
        d = self._dir(case_id)
        if data is None and content_b64:
            data = base64.b64decode(content_b64, validate=True)
        if data is not None and len(data) > MAX_FILE_BYTES:
            raise ValueError("file is larger than 25 MB")
        with self._lock(d):
            case = _read_json(d / "case.json", {})
            _ensure_editable(case)
            docs = case.setdefault("documents", [])
            used = [int(x["id"][1:]) for x in docs if re.fullmatch(r"D[0-9]+", str(x.get("id", "")))]
            doc_id = f"D{max(used, default=0) + 1}"
            doc: dict[str, Any] = {"id": doc_id, "name": name, "type": doc_type, "added_by": actor,
                                   "added_at": self.clock()}
            if issued_date:
                doc["issued_date"] = issued_date
            if summary and summary.strip():
                doc["summary"] = summary.strip()[:300]
            if norm_meta:
                doc["meta"] = norm_meta
            if data is not None:
                p = Path(name)
                suf = p.suffix[:12]
                stem = _SAFE.sub("_", p.stem).strip("_")[:68] or "file"
                fname = f"{doc_id}-{stem}{suf}"
                (d / "files").mkdir(exist_ok=True)
                (d / "files" / fname).write_bytes(data)
                doc["file"] = fname
                doc["size"] = len(data)
            docs.append(doc)
            _write_json(d / "case.json", case)
            self._audit(d, "document_add", {"id": doc_id, "type": doc_type, "actor": actor})
        return doc

    def update_document(self, case_id: str, doc_id: str, patch: dict[str, Any], actor: str) -> dict[str, Any]:
        """Set a document's type, issue date, summary, structured meta, or not_stated."""
        d = self._dir(case_id)
        norm_meta = validate_doc_meta(patch.get("meta")) if "meta" in patch else {}
        with self._lock(d):
            case = _read_json(d / "case.json", {})
            _ensure_editable(case)
            doc = next((x for x in case.get("documents", []) if x.get("id") == doc_id), None)
            if doc is None:
                raise KeyError(f"document not found: {doc_id}")
            for k in ("type", "name", "summary"):
                if k in patch:
                    v = patch[k]
                    if k == "summary":
                        v = str(v).strip()[:300]
                    doc[k] = v
            if "issued_date" in patch:
                v = patch["issued_date"]
                if v is None or v == "":
                    doc.pop("issued_date", None)
                else:
                    doc["issued_date"] = _iso_date(str(v), "issued_date")
            if "not_stated" in patch:
                paths = patch["not_stated"]
                if not isinstance(paths, list) or not all(isinstance(p, str) and "." in p for p in paths):
                    raise ValueError("not_stated must list field paths like customer.address")
                doc["not_stated"] = sorted(set(doc.get("not_stated") or []) | set(paths))
            if "meta" in patch:
                merged_meta = dict(doc.get("meta") or {})
                for mk, mv in norm_meta.items():
                    if mv is None or mv == "":
                        merged_meta.pop(mk, None)
                    else:
                        merged_meta[mk] = mv
                if merged_meta:
                    doc["meta"] = merged_meta
                else:
                    doc.pop("meta", None)
            _write_json(d / "case.json", case)
            self._audit(d, "document_update", {"id": doc_id, "fields": sorted(patch), "actor": actor})
        return doc

    def remove_document(self, case_id: str, doc_id: str, actor: str, note: str = "") -> dict[str, Any]:
        """Remove an uploaded document (e.g. attached to the wrong dossier) and delete its file."""
        d = self._dir(case_id)
        with self._lock(d):
            case = _read_json(d / "case.json", {})
            _ensure_editable(case)
            docs = case.get("documents") or []
            idx = next((i for i, x in enumerate(docs) if x.get("id") == doc_id), None)
            if idx is None:
                raise KeyError(f"document not found: {doc_id}")
            doc = docs.pop(idx)
            if doc.get("file"):
                (d / "files" / doc["file"]).unlink(missing_ok=True)
            _write_json(d / "case.json", case)
            self._audit(d, "document_remove", {"id": doc_id, "name": doc.get("name"),
                                               "actor": actor, "note": note.strip()})
        return doc

    # -- requirements --------------------------------------------------------
    def requirement_states(self, case_id: str) -> dict[str, dict[str, Any]]:
        return _read_json(self._dir(case_id) / "requirements.json", {})

    def sync_requirements(self, case_id: str, checks: list[dict[str, Any]]) -> dict[str, dict[str, Any]]:
        """Record which gaps are open now; close the ones that went away by themselves."""
        d = self._dir(case_id)
        with self._lock(d):
            states = _read_json(d / "requirements.json", {})
            before = json.dumps(states, sort_keys=True)
            now_open = {c["key"] for c in checks if not c["ok"]}
            closed = []
            for key, st in states.items():
                if key not in now_open and st.get("status") in ("open", "requested") and not st.get("resolved_at"):
                    st["resolved_at"] = self.clock()
                    closed.append(key)
                if key in now_open and st.get("resolved_at"):
                    st.pop("resolved_at")
                    st["status"] = "open"
            for key in now_open:
                states.setdefault(key, {"status": "open", "opened_at": self.clock()})
            if json.dumps(states, sort_keys=True) != before:
                _write_json(d / "requirements.json", states)
            if closed:
                self._audit(d, "requirement_resolved", {"keys": closed})
        return states

    def set_requirement(self, case_id: str, key: str, status: str, note: str, actor: str,
                        due_date: str | None = None) -> dict[str, Any]:
        if status not in REQUIREMENT_STATUSES:
            raise ValueError(f"status must be one of {', '.join(REQUIREMENT_STATUSES)}")
        if status == "waived" and not note.strip():
            raise ValueError("waiving a requirement needs a reason")
        if due_date:
            due_date = _iso_date(due_date, "due_date")
        d = self._dir(case_id)
        with self._lock(d):
            _ensure_editable(_read_json(d / "case.json", {}))
            states = _read_json(d / "requirements.json", {})
            st = states.setdefault(key, {"opened_at": self.clock()})
            st.update({"status": status, "note": note.strip(), "updated_by": actor, "updated_at": self.clock()})
            if status in ("open", "waived"):
                st.pop("due_date", None)
                st.pop("requested_at", None)
            elif status == "requested":
                st["requested_at"] = self.clock()
                if due_date == "":
                    st.pop("due_date", None)
                elif due_date:
                    st["due_date"] = due_date
            _write_json(d / "requirements.json", states)
            self._audit(d, "requirement_set", {"key": key, "status": status, "actor": actor})
        return st

    # -- customer-request drafts --------------------------------------------
    def save_draft(self, case_id: str, *, channel: str, subject: str, body: str,
                   requirement_keys: list[str], author: str) -> dict[str, Any]:
        if channel not in ("email", "zalo", "phone_script"):
            raise ValueError("channel must be email, zalo or phone_script")
        if not body.strip():
            raise ValueError("a draft needs a body")
        d = self._dir(case_id)
        with self._lock(d):
            _ensure_editable(_read_json(d / "case.json", {}))
            drafts = _read_json(d / "drafts.json", [])
            draft = {"id": f"M{len(drafts) + 1:03d}", "channel": channel, "subject": subject.strip(),
                     "body": body.strip(), "requirement_keys": requirement_keys, "status": "draft",
                     "author": author, "created_at": self.clock()}
            drafts.append(draft)
            _write_json(d / "drafts.json", drafts)
            self._audit(d, "draft_save", {"id": draft["id"], "channel": channel, "author": author})
        return draft

    def list_drafts(self, case_id: str) -> list[dict[str, Any]]:
        return _read_json(self._dir(case_id) / "drafts.json", [])

    def mark_draft_sent(self, case_id: str, draft_id: str, actor: str, due_date: str | None = None) -> dict[str, Any]:
        """The Sale sent it themselves; its requirements become `requested` (or refresh timestamp)."""
        if due_date:
            due_date = _iso_date(due_date, "due_date")
        d = self._dir(case_id)
        with self._lock(d):
            _ensure_editable(_read_json(d / "case.json", {}))
            drafts = _read_json(d / "drafts.json", [])
            draft = next((x for x in drafts if x["id"] == draft_id), None)
            if draft is None:
                raise KeyError(f"draft not found: {draft_id}")
            draft.update({"status": "sent", "sent_by": actor, "sent_at": self.clock()})
            _write_json(d / "drafts.json", drafts)
            states = _read_json(d / "requirements.json", {})
            for key in draft["requirement_keys"]:
                st = states.get(key)
                if st and st.get("status") in ("open", "requested") and not st.get("resolved_at"):
                    st.update({"status": "requested", "requested_at": self.clock(), "updated_by": actor})
                    if due_date:
                        st["due_date"] = due_date
            _write_json(d / "requirements.json", states)
            self._audit(d, "draft_sent", {"id": draft_id, "actor": actor})
        return draft

    # -- stage ---------------------------------------------------------------
    def mark_submitted(self, case_id: str, actor: str, note: str,
                       handover: dict[str, Any] | None = None) -> dict[str, Any]:
        d = self._dir(case_id)
        with self._lock(d):
            case = _read_json(d / "case.json", {})
            _ensure_editable(case)
            sub: dict[str, Any] = {"by": actor, "at": self.clock(), "note": note.strip()}
            if handover is not None:
                sub["handover"] = handover
            case["submitted"] = sub
            _write_json(d / "case.json", case)
            self._audit(d, "case_submitted", {"actor": actor,
                                               **({"handover_status": handover.get("status")} if handover else {})})
        return case

    def reopen_case(self, case_id: str, actor: str, note: str) -> dict[str, Any]:
        """Unlock a submitted dossier (e.g. Underwriting returned it for more documents)."""
        if not note.strip():
            raise ValueError("cần ghi lý do mở lại hồ sơ")
        d = self._dir(case_id)
        with self._lock(d):
            case = _read_json(d / "case.json", {})
            if not case.get("submitted"):
                raise ValueError("hồ sơ chưa ở trạng thái đã nộp")
            case.pop("submitted", None)
            _write_json(d / "case.json", case)
            self._audit(d, "case_reopened", {"actor": actor, "note": note.strip()})
        return case
