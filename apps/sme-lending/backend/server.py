"""HTTP backend for the "Thẩm định SME" dashboard page.

Routes only; signatures, principals and routing live in `sme_core.appserver`.
A write (an officer's decision on a review item) needs a principal of kind
`owner-session`: the gateway signs agents, MCP tools and crons as `agent-tool`,
so no agent can close an item it raised.
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
from sme_core.appserver import ReplayCache, owner_only  # noqa: E402,F401
from sme_core.service import LendingService  # noqa: E402

SMALL = 64 * 1024
_CASE = r"(SME-[0-9]{8}-[0-9a-f]{8})"
_DOC = r"(D[0-9]+)"
ROUTES: list[appserver.Route] = [
    ("GET", re.compile(r"^/api/cases$"), "list_cases", SMALL),
    ("GET", re.compile(rf"^/api/cases/{_CASE}$"), "get_case", SMALL),
    ("GET", re.compile(rf"^/api/cases/{_CASE}/documents/{_DOC}/file$"), "document_file", SMALL),
    ("POST", re.compile(rf"^/api/cases/{_CASE}/review/(R[0-9]{{3}})$"), "decide_review", SMALL),
]


class Api:
    """Route handlers; independent of the HTTP server so tests call them directly."""

    def __init__(self, svc: LendingService):
        self.svc = svc

    def list_cases(self, _body: dict, _claim: dict | None) -> tuple[int, Any]:
        return 200, {"cases": self.svc.store.list_cases()}

    def get_case(self, _body: dict, _claim: dict | None, case_id: str) -> tuple[int, Any]:
        store = self.svc.store
        case = store.get_case(case_id)
        return 200, {
            "case": {k: v for k, v in case.items() if k not in ("results", "review_open")},
            "results": store.get_results(case_id),
            "evidence": store.get_evidence(case_id),
            "review": store.list_review(case_id),
            "audit": store.read_audit(case_id),
            "checklist": self.svc.checklist_evaluate(case_id),
            "crosschecks": self.svc.crosscheck_evaluate(case_id),
        }

    def document_file(self, _body: dict, _claim: dict | None, case_id: str, doc_id: str) -> tuple[int, Any]:
        return 200, self.svc.store.document_file(case_id, doc_id)

    def decide_review(self, body: dict, claim: dict | None, case_id: str, review_id: str) -> tuple[int, Any]:
        refused = owner_only(claim)
        if refused:
            return refused
        item = self.svc.store.resolve_review(case_id, review_id, str(body.get("status", "")),
                                             str(body.get("note", "")), actor=claim["ownerId"])
        return 200, {"item": item}


def make_handler(api: Api, secret: str, replays: ReplayCache, clock=None):
    kwargs = {"clock": clock} if clock else {}
    return appserver.make_handler(api, ROUTES, secret, replays, name="sme-lending", **kwargs)


def main() -> None:
    svc = LendingService(
        data_root=Path(os.environ.get("SME_LENDING_DATA") or APP_ROOT / "data"),
        knowledge_root=Path(os.environ.get("SME_LENDING_KNOWLEDGE") or APP_ROOT / "knowledge"),
    )
    handler = make_handler(Api(svc), os.environ.get("KIROCREW_PROXY_SECRET", ""), ReplayCache())
    ThreadingHTTPServer(("127.0.0.1", int(os.environ.get("PORT", "0"))), handler).serve_forever()


if __name__ == "__main__":
    main()
