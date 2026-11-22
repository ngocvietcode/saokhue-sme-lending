"""Dossier-completion state on top of the case store: what Sales works on.

Adds to each case directory:

    requirements.json   {key: {status, note, ...}}   the human side of each gap
    drafts.json         [ {...} ]                     customer-request drafts
    files/<D#>-<name>   uploaded document files

Gaps themselves are recomputed from the dossier every time (`gaps.analyse`);
this store only keeps what a person decided about them: requested from the
customer, or waived with a reason. A gap that disappears closes by itself.

Status changes and uploads are made by the app backend for a signed dashboard
owner, never by an MCP tool, so an agent cannot waive a requirement.
"""

from __future__ import annotations

import base64
import re
from pathlib import Path
from typing import Any

from .store import CaseStore, _read_json, _write_json

REQUIREMENT_STATUSES = ("open", "requested", "waived")
STAGES = ("draft", "collecting", "ready", "submitted")
EDITABLE = {
    "customer": ("name", "tax_id", "cif", "industry_code", "address", "legal_rep", "established"),
    "request": ("product_code", "amount", "purpose", "term_months", "proposal", "annual_rate_pct", "repayment_method"),
}
MAX_FILE_BYTES = 10 * 1024 * 1024
_SAFE = re.compile(r"[^A-Za-z0-9._-]+")


class DossierStore(CaseStore):
    # -- case fields ---------------------------------------------------------
    def update_case(self, case_id: str, patch: dict[str, Any], actor: str) -> dict[str, Any]:
        """Apply an allowed subset of customer/request/facts edits."""
        d = self._dir(case_id)
        with self._lock(d):
            case = _read_json(d / "case.json", {})
            changed = []
            for section, keys in EDITABLE.items():
                for k, v in (patch.get(section) or {}).items():
                    if k not in keys:
                        raise ValueError(f"{section}.{k} is not editable")
                    case.setdefault(section, {})[k] = v
                    changed.append(f"{section}.{k}")
            for k, v in (patch.get("facts") or {}).items():
                if not re.fullmatch(r"[a-z_]{2,40}", k):
                    raise ValueError(f"invalid fact name: {k}")
                case.setdefault("facts", {})[k] = v
                changed.append(f"facts.{k}")
            _write_json(d / "case.json", case)
            self._audit(d, "case_update", {"fields": changed, "actor": actor})
        return case

    # -- documents -----------------------------------------------------------
    def add_document(self, case_id: str, *, name: str, doc_type: str, issued_date: str | None,
                     content_b64: str | None, actor: str) -> dict[str, Any]:
        d = self._dir(case_id)
        data = None
        if content_b64:
            data = base64.b64decode(content_b64, validate=True)
            if len(data) > MAX_FILE_BYTES:
                raise ValueError("file is larger than 10 MB")
        with self._lock(d):
            case = _read_json(d / "case.json", {})
            docs = case.setdefault("documents", [])
            used = [int(x["id"][1:]) for x in docs if re.fullmatch(r"D[0-9]+", str(x.get("id", "")))]
            doc_id = f"D{max(used, default=0) + 1}"
            doc: dict[str, Any] = {"id": doc_id, "name": name, "type": doc_type, "added_by": actor,
                                   "added_at": self.clock()}
            if issued_date:
                doc["issued_date"] = issued_date
            if data is not None:
                fname = f"{doc_id}-{_SAFE.sub('_', name)[:80]}"
                (d / "files").mkdir(exist_ok=True)
                (d / "files" / fname).write_bytes(data)
                doc["file"] = fname
                doc["size"] = len(data)
            docs.append(doc)
            _write_json(d / "case.json", case)
            self._audit(d, "document_add", {"id": doc_id, "type": doc_type, "actor": actor})
        return doc

    def update_document(self, case_id: str, doc_id: str, patch: dict[str, Any], actor: str) -> dict[str, Any]:
        """Correct a document's type or issue date (classification is the Sale's call)."""
        d = self._dir(case_id)
        with self._lock(d):
            case = _read_json(d / "case.json", {})
            doc = next((x for x in case.get("documents", []) if x.get("id") == doc_id), None)
            if doc is None:
                raise KeyError(f"document not found: {doc_id}")
            for k in ("type", "issued_date", "name"):
                if k in patch:
                    doc[k] = patch[k]
            _write_json(d / "case.json", case)
            self._audit(d, "document_update", {"id": doc_id, "fields": sorted(patch), "actor": actor})
        return doc

    def document_path(self, case_id: str, doc_id: str) -> Path | None:
        d = self._dir(case_id)
        doc = next((x for x in _read_json(d / "case.json", {}).get("documents", []) if x.get("id") == doc_id), None)
        if not doc or not doc.get("file"):
            return None
        return d / "files" / doc["file"]

    # -- requirements --------------------------------------------------------
    def requirement_states(self, case_id: str) -> dict[str, dict[str, Any]]:
        return _read_json(self._dir(case_id) / "requirements.json", {})

    def sync_requirements(self, case_id: str, checks: list[dict[str, Any]]) -> dict[str, dict[str, Any]]:
        """Record which gaps are open now; close the ones that went away by themselves."""
        d = self._dir(case_id)
        with self._lock(d):
            states = _read_json(d / "requirements.json", {})
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
        d = self._dir(case_id)
        with self._lock(d):
            states = _read_json(d / "requirements.json", {})
            st = states.setdefault(key, {"opened_at": self.clock()})
            st.update({"status": status, "note": note.strip(), "updated_by": actor, "updated_at": self.clock()})
            if due_date:
                st["due_date"] = due_date
            if status == "requested":
                st["requested_at"] = self.clock()
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

    def mark_draft_sent(self, case_id: str, draft_id: str, actor: str) -> dict[str, Any]:
        """The Sale sent it themselves; its requirements become `requested`."""
        d = self._dir(case_id)
        with self._lock(d):
            drafts = _read_json(d / "drafts.json", [])
            draft = next((x for x in drafts if x["id"] == draft_id), None)
            if draft is None:
                raise KeyError(f"draft not found: {draft_id}")
            draft.update({"status": "sent", "sent_by": actor, "sent_at": self.clock()})
            _write_json(d / "drafts.json", drafts)
            states = _read_json(d / "requirements.json", {})
            for key in draft["requirement_keys"]:
                st = states.get(key)
                if st and st.get("status") == "open" and not st.get("resolved_at"):
                    st.update({"status": "requested", "requested_at": self.clock(), "updated_by": actor})
            _write_json(d / "requirements.json", states)
            self._audit(d, "draft_sent", {"id": draft_id, "actor": actor})
        return draft

    # -- stage ---------------------------------------------------------------
    def mark_submitted(self, case_id: str, actor: str, note: str) -> dict[str, Any]:
        d = self._dir(case_id)
        with self._lock(d):
            case = _read_json(d / "case.json", {})
            case["submitted"] = {"by": actor, "at": self.clock(), "note": note.strip()}
            _write_json(d / "case.json", case)
            self._audit(d, "case_submitted", {"actor": actor})
        return case
