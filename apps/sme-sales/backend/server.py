"""HTTP backend for the "Hoàn thiện hồ sơ" (Sales) dashboard page.

The page tracks and pushes; it takes no data entry. Dossiers, fields and
documents arrive through the dossier coach in chat (MCP tools). What stays here
are the Sale's own decisions, each needing a principal of kind `owner-session`
(the signed-in dashboard user; agents and MCP tools are signed `agent-tool`):
marking an item requested from the customer, waiving it with a reason,
reopening it, marking a draft sent, and marking the dossier submitted.
"""

from __future__ import annotations

import os
import re
import sys
from http.server import ThreadingHTTPServer
from pathlib import Path
from typing import Any

APP_ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(APP_ROOT / "server"))

from sme_core import appserver  # noqa: E402
from sme_core.appserver import ReplayCache, owner_only  # noqa: E402
from sme_core.sales import SalesService  # noqa: E402

SMALL = 64 * 1024
_CASE = r"(SME-[0-9]{8}-[0-9a-f]{8})"
_DOC = r"(D[0-9]+)"
ROUTES: list[appserver.Route] = [
    ("GET", re.compile(r"^/api/catalog$"), "catalog", SMALL),
    ("GET", re.compile(r"^/api/cases$"), "list_cases", SMALL),
    ("GET", re.compile(rf"^/api/cases/{_CASE}$"), "get_case", SMALL),
    ("GET", re.compile(rf"^/api/cases/{_CASE}/documents/{_DOC}/file$"), "document_file", SMALL),
    ("POST", re.compile(rf"^/api/cases/{_CASE}/requirements$"), "set_requirement", SMALL),
    ("POST", re.compile(rf"^/api/cases/{_CASE}/documents/{_DOC}/remove$"), "remove_document", SMALL),
    ("POST", re.compile(rf"^/api/cases/{_CASE}/drafts/(M[0-9]{{3}})/sent$"), "draft_sent", SMALL),
    ("POST", re.compile(rf"^/api/cases/{_CASE}/submitted$"), "mark_submitted", SMALL),
    ("POST", re.compile(rf"^/api/cases/{_CASE}/reopen$"), "reopen_case", SMALL),
]


def _text(body: dict, key: str) -> str:
    v = body.get(key, "")
    return v if isinstance(v, str) else ""


class Api:
    """Route handlers; independent of the HTTP server so tests call them directly."""

    def __init__(self, svc: SalesService):
        self.svc = svc

    # -- reads ---------------------------------------------------------------
    def catalog(self, _body: dict, _claim: dict | None) -> tuple[int, Any]:
        return 200, {"documents": self.svc.documents_catalog(), "products": self.svc.knowledge_products()}

    def list_cases(self, _body: dict, _claim: dict | None) -> tuple[int, Any]:
        rows = self.svc.list_dossiers()
        return 200, {"cases": rows, "today": self.svc.today(rows)}

    def get_case(self, _body: dict, _claim: dict | None, case_id: str) -> tuple[int, Any]:
        store = self.svc.store
        case = store.get_case(case_id)
        return 200, {
            "case": {k: v for k, v in case.items() if k not in ("results", "review_open")},
            "overview": self.svc.overview(case_id),
            "drafts": store.list_drafts(case_id),
            "audit": store.read_audit(case_id),
        }

    def document_file(self, _body: dict, _claim: dict | None, case_id: str, doc_id: str) -> tuple[int, Any]:
        return 200, self.svc.store.document_file(case_id, doc_id)

    # -- the Sale's decisions (signed-in user only) --------------------------
    def set_requirement(self, body: dict, claim: dict | None, case_id: str) -> tuple[int, Any]:
        if refused := owner_only(claim):
            return refused
        raw_keys = body.get("keys")
        if raw_keys is not None:
            if not isinstance(raw_keys, list) or not raw_keys or not all(isinstance(k, str) and k for k in raw_keys):
                raise ValueError("keys must be a non-empty list of requirement keys")
            keys = list(dict.fromkeys(raw_keys))
        else:
            k = _text(body, "key")
            if not k:
                raise ValueError("missing requirement key")
            keys = [k]
        known = {i["key"] for i in self.svc.overview(case_id)["items"]}
        unknown = [k for k in keys if k not in known]
        if unknown:
            raise ValueError(f"unknown requirement key: {', '.join(unknown)}")
        status = _text(body, "status")
        note = _text(body, "note")
        due_date = "" if body.get("due_date") == "" else (_text(body, "due_date") or None)
        for k in keys:
            self.svc.store.set_requirement(case_id, k, status, note, actor=claim["ownerId"], due_date=due_date)
        return 200, {"overview": self.svc.overview(case_id)}

    def remove_document(self, body: dict, claim: dict | None, case_id: str, doc_id: str) -> tuple[int, Any]:
        if refused := owner_only(claim):
            return refused
        self.svc.store.remove_document(case_id, doc_id, actor=claim["ownerId"], note=_text(body, "note"))
        return 200, {
            "overview": self.svc.overview(case_id),
            "documents": self.svc.store.get_case(case_id).get("documents", []),
        }

    def draft_sent(self, body: dict, claim: dict | None, case_id: str, draft_id: str) -> tuple[int, Any]:
        if refused := owner_only(claim):
            return refused
        due_date = _text(body, "due_date") or None
        draft = self.svc.store.mark_draft_sent(case_id, draft_id, actor=claim["ownerId"], due_date=due_date)
        return 200, {"draft": draft, "overview": self.svc.overview(case_id)}

    def mark_submitted(self, body: dict, claim: dict | None, case_id: str) -> tuple[int, Any]:
        """Record a manual submission. Not ready is allowed only with a written reason."""
        if refused := owner_only(claim):
            return refused
        note = _text(body, "note")
        ov = self.svc.overview(case_id)
        if not ov["readiness"]["ready"] and not note.strip():
            raise ValueError("the dossier still has blocking items; give a reason to submit anyway")
        self.svc.store.mark_submitted(case_id, claim["ownerId"], note)
        return 200, {"overview": self.svc.overview(case_id)}

    def reopen_case(self, body: dict, claim: dict | None, case_id: str) -> tuple[int, Any]:
        if refused := owner_only(claim):
            return refused
        self.svc.store.reopen_case(case_id, claim["ownerId"], _text(body, "note"))
        return 200, {"overview": self.svc.overview(case_id)}


def make_handler(api: Api, secret: str, replays: ReplayCache, clock=None):
    kwargs = {"clock": clock} if clock else {}
    return appserver.make_handler(api, ROUTES, secret, replays, name="sme-sales", **kwargs)


def main() -> None:
    svc = SalesService(
        data_root=Path(os.environ.get("SME_SALES_DATA") or APP_ROOT / "data"),
        knowledge_root=Path(os.environ.get("SME_SALES_KNOWLEDGE") or APP_ROOT / "knowledge"),
    )
    handler = make_handler(Api(svc), os.environ.get("KIROCREW_PROXY_SECRET", ""), ReplayCache())
    ThreadingHTTPServer(("127.0.0.1", int(os.environ.get("PORT", "0"))), handler).serve_forever()


if __name__ == "__main__":
    main()
