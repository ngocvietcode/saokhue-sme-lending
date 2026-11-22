"""HTTP backend for the "Hoàn thiện hồ sơ" (Sales) dashboard page.

Reads are open to any signed request. Every write needs a principal of kind
`owner-session`, the signed-in dashboard user: waiving a requirement, uploading
a document, marking a message sent or a case submitted are the Sale's acts,
never an agent's (the gateway signs agents and MCP tools as `agent-tool`).
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
UPLOAD = 14 * 1024 * 1024  # a 10 MB file, base64-encoded, plus its JSON envelope
_CASE = r"(SME-[0-9]{8}-[0-9a-f]{8})"
ROUTES: list[appserver.Route] = [
    ("GET", re.compile(r"^/api/catalog$"), "catalog", SMALL),
    ("GET", re.compile(r"^/api/cases$"), "list_cases", SMALL),
    ("POST", re.compile(r"^/api/cases$"), "create_case", SMALL),
    ("GET", re.compile(rf"^/api/cases/{_CASE}$"), "get_case", SMALL),
    ("POST", re.compile(rf"^/api/cases/{_CASE}/fields$"), "update_fields", SMALL),
    ("POST", re.compile(rf"^/api/cases/{_CASE}/documents$"), "upload_document", UPLOAD),
    ("POST", re.compile(rf"^/api/cases/{_CASE}/documents/(D[0-9]+)$"), "update_document", SMALL),
    ("POST", re.compile(rf"^/api/cases/{_CASE}/requirements$"), "set_requirement", SMALL),
    ("POST", re.compile(rf"^/api/cases/{_CASE}/drafts/(M[0-9]{{3}})/sent$"), "draft_sent", SMALL),
    ("POST", re.compile(rf"^/api/cases/{_CASE}/submitted$"), "mark_submitted", SMALL),
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
        return 200, {"cases": self.svc.list_dossiers()}

    def get_case(self, _body: dict, _claim: dict | None, case_id: str) -> tuple[int, Any]:
        store = self.svc.store
        case = store.get_case(case_id)
        return 200, {
            "case": {k: v for k, v in case.items() if k not in ("results", "review_open")},
            "overview": self.svc.overview(case_id),
            "drafts": store.list_drafts(case_id),
            "audit": store.read_audit(case_id),
        }

    # -- writes (signed-in user only) ---------------------------------------
    def create_case(self, body: dict, claim: dict | None) -> tuple[int, Any]:
        if refused := owner_only(claim):
            return refused
        customer = body.get("customer") or {}
        request = body.get("request") or {}
        if not isinstance(customer, dict) or not isinstance(request, dict):
            raise ValueError("customer and request must be objects")
        case = self.svc.case_create({}, {}, [], _text(body, "flow") or "A")
        self.svc.store.update_case(case["case_id"], {"customer": customer, "request": request},
                                   actor=claim["ownerId"])
        self.svc.overview(case["case_id"])  # record the opening gaps, so each item has an opened_at
        return 200, {"case_id": case["case_id"]}

    def update_fields(self, body: dict, claim: dict | None, case_id: str) -> tuple[int, Any]:
        if refused := owner_only(claim):
            return refused
        patch = {k: body[k] for k in ("customer", "request", "facts") if isinstance(body.get(k), dict)}
        self.svc.store.update_case(case_id, patch, actor=claim["ownerId"])
        return 200, {"overview": self.svc.overview(case_id)}

    def upload_document(self, body: dict, claim: dict | None, case_id: str) -> tuple[int, Any]:
        if refused := owner_only(claim):
            return refused
        name = _text(body, "name").strip()
        if not name:
            raise ValueError("a document needs a name")
        doc = self.svc.store.add_document(case_id, name=name, doc_type=_text(body, "type"),
                                          issued_date=_text(body, "issued_date") or None,
                                          content_b64=_text(body, "content_b64") or None, actor=claim["ownerId"])
        return 200, {"document": doc, "overview": self.svc.overview(case_id)}

    def update_document(self, body: dict, claim: dict | None, case_id: str, doc_id: str) -> tuple[int, Any]:
        if refused := owner_only(claim):
            return refused
        patch = {k: _text(body, k) for k in ("type", "issued_date", "name") if k in body}
        doc = self.svc.store.update_document(case_id, doc_id, patch, actor=claim["ownerId"])
        return 200, {"document": doc, "overview": self.svc.overview(case_id)}

    def set_requirement(self, body: dict, claim: dict | None, case_id: str) -> tuple[int, Any]:
        if refused := owner_only(claim):
            return refused
        self.svc.store.set_requirement(case_id, _text(body, "key"), _text(body, "status"), _text(body, "note"),
                                       actor=claim["ownerId"], due_date=_text(body, "due_date") or None)
        return 200, {"overview": self.svc.overview(case_id)}

    def draft_sent(self, _body: dict, claim: dict | None, case_id: str, draft_id: str) -> tuple[int, Any]:
        if refused := owner_only(claim):
            return refused
        draft = self.svc.store.mark_draft_sent(case_id, draft_id, actor=claim["ownerId"])
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
