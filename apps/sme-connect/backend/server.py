"""HTTP Backend & Dual-Mode Integration Gateway for `apps/sme-connect`.

Serves both:
1. The standalone Sao Khuê SME Connect UI (`/apps/sme-connect/api/...`) with strict
   `owner_only(claim)` enforcement on every CBBH decision/mutation.
2. Dual-Mode SME Connect / NCLOS / B2B integration webhooks (`/api/smec/webhooks/los`)
   ready for external system connection when SME Connect Portal / LOS APIs go live.
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
from smec.service import SmecService  # noqa: E402

SMALL = 256 * 1024
LARGE = 36 * 1024 * 1024  # base64 PDFs, Excel B4 workbooks & Word Proposals
_CASE = r"(SME-[0-9]{8}-[0-9a-f]{8})"
_DOC = r"(D[0-9]+)"

ROUTES: list[appserver.Route] = [
    ("GET", re.compile(r"^/api/catalog$"), "catalog", SMALL),
    ("GET", re.compile(r"^/api/cases$"), "list_cases", SMALL),
    ("POST", re.compile(r"^/api/lookup$"), "lookup_enterprise", SMALL),
    ("POST", re.compile(r"^/api/cases$"), "init_case", SMALL),
    ("POST", re.compile(r"^/api/cases/pull-nclos$"), "pull_nclos", SMALL),
    ("GET", re.compile(rf"^/api/cases/{_CASE}$"), "get_case", SMALL),
    ("GET", re.compile(rf"^/api/cases/{_CASE}/documents/{_DOC}/file$"), "document_file", SMALL),
    ("POST", re.compile(rf"^/api/cases/{_CASE}/documents$"), "upload_documents", LARGE),
    ("POST", re.compile(rf"^/api/cases/{_CASE}/ocr$"), "update_ocr", SMALL),
    ("GET", re.compile(rf"^/api/cases/{_CASE}/b4-template$"), "download_b4_template", SMALL),
    ("POST", re.compile(rf"^/api/cases/{_CASE}/b4-upload$"), "upload_b4_excel", LARGE),
    ("POST", re.compile(rf"^/api/cases/{_CASE}/evaluate$"), "evaluate_case", SMALL),
    ("POST", re.compile(rf"^/api/cases/{_CASE}/proposal/generate$"), "generate_proposal", SMALL),
    ("GET", re.compile(rf"^/api/cases/{_CASE}/proposal/download$"), "download_proposal", SMALL),
    ("GET", re.compile(rf"^/api/cases/{_CASE}/proposal/sample-edit$"), "download_sample_edited_proposal", SMALL),
    ("POST", re.compile(rf"^/api/cases/{_CASE}/proposal/upload$"), "upload_edited_proposal", LARGE),
    ("POST", re.compile(rf"^/api/cases/{_CASE}/proposal/confirm-diff$"), "confirm_proposal_diff", SMALL),
    ("POST", re.compile(rf"^/api/cases/{_CASE}/action$"), "lifecycle_action", SMALL),
    ("POST", re.compile(rf"^/api/cases/{_CASE}/negotiate$"), "send_negotiation_comment", SMALL),
    ("POST", re.compile(rf"^/api/cases/{_CASE}/resolution/accept$"), "accept_resolution", SMALL),
    ("POST", re.compile(rf"^/api/cases/{_CASE}/los-event$"), "receive_los_event", SMALL),
]


class Api:
    """Route handlers; independent of HTTP server so unit tests invoke or test via HTTP cleanly."""

    def __init__(self, svc: SmecService):
        self.svc = svc

    # -- reads --------------------------------------------------------------
    def catalog(self, _body: dict, _claim: dict | None) -> tuple[int, Any]:
        return 200, self.svc.catalog()

    def list_cases(self, _body: dict, _claim: dict | None) -> tuple[int, Any]:
        return 200, {"cases": self.svc.list_cases()}

    def get_case(self, _body: dict, _claim: dict | None, case_id: str) -> tuple[int, Any]:
        return 200, self.svc.get_full_case(case_id)

    def document_file(self, _body: dict, _claim: dict | None, case_id: str, doc_id: str) -> tuple[int, Any]:
        return 200, self.svc.store.document_file(case_id, doc_id)

    def download_b4_template(self, _body: dict, _claim: dict | None, case_id: str) -> tuple[int, Any]:
        return 200, self.svc.download_b4_template(case_id)

    def download_proposal(self, _body: dict, _claim: dict | None, case_id: str) -> tuple[int, Any]:
        return 200, self.svc.download_proposal_docx(case_id, sample_cbbh_edit=False)

    def download_sample_edited_proposal(self, _body: dict, _claim: dict | None, case_id: str) -> tuple[int, Any]:
        return 200, self.svc.download_proposal_docx(case_id, sample_cbbh_edit=True)

    # -- owner-gated actions (CBBH / Dual-Mode UI) --------------------------
    def lookup_enterprise(self, body: dict, claim: dict | None) -> tuple[int, Any]:
        if refused := owner_only(claim):
            return refused
        return 200, self.svc.lookup_and_recommend(
            dkkd_no=str(body.get("dkkd_no") or ""),
            requested_amount=float(body.get("requested_amount") or 10_000_000_000),
            has_collateral=bool(body.get("has_collateral", True)),
            branch_code=str(body.get("branch_code") or "CN_DONG_DO"),
            dao_code=str(body.get("dao_code") or "DAO8821"),
        )

    def init_case(self, body: dict, claim: dict | None) -> tuple[int, Any]:
        if refused := owner_only(claim):
            return refused
        return 200, self.svc.init_case(body, actor=claim["ownerId"])

    def pull_nclos(self, body: dict, claim: dict | None) -> tuple[int, Any]:
        if refused := owner_only(claim):
            return refused
        return 200, self.svc.pull_from_nclos(str(body.get("nclos_id") or ""), actor=claim["ownerId"])

    def upload_documents(self, body: dict, claim: dict | None, case_id: str) -> tuple[int, Any]:
        if refused := owner_only(claim):
            return refused
        files = body.get("files")
        if not isinstance(files, list):
            raise ValueError("Trường 'files' phải là danh sách tài liệu.")
        return 200, self.svc.upload_documents(
            case_id,
            files,
            mode=str(body.get("mode") or "auto_bulk"),
            actor=claim["ownerId"],
        )

    def update_ocr(self, body: dict, claim: dict | None, case_id: str) -> tuple[int, Any]:
        if refused := owner_only(claim):
            return refused
        updates = body.get("updates") or []
        if not isinstance(updates, list):
            raise ValueError("Trường 'updates' phải là danh sách.")
        groups = body.get("selected_agent_groups")
        entities_patch = body.get("entities_patch") if isinstance(body.get("entities_patch"), dict) else None
        return 200, self.svc.update_ocr(
            case_id,
            updates,
            selected_agent_groups=groups if isinstance(groups, list) else None,
            entities_patch=entities_patch,
            actor=claim["ownerId"],
        )

    def upload_b4_excel(self, body: dict, claim: dict | None, case_id: str) -> tuple[int, Any]:
        if refused := owner_only(claim):
            return refused
        return 200, self.svc.upload_b4_excel(
            case_id,
            file_name=str(body.get("name") or "PAVV_Mau_B4.xlsx"),
            content_b64=str(body.get("content_b64") or ""),
            actor=claim["ownerId"],
        )

    def evaluate_case(self, body: dict, claim: dict | None, case_id: str) -> tuple[int, Any]:
        if refused := owner_only(claim):
            return refused
        groups = body.get("selected_groups")
        return 200, self.svc.run_structured_evaluation(
            case_id,
            selected_groups=groups if isinstance(groups, list) else None,
            actor=claim["ownerId"],
        )

    def generate_proposal(self, _body: dict, claim: dict | None, case_id: str) -> tuple[int, Any]:
        if refused := owner_only(claim):
            return refused
        return 200, self.svc.generate_proposal(case_id, actor=claim["ownerId"])

    def upload_edited_proposal(self, body: dict, claim: dict | None, case_id: str) -> tuple[int, Any]:
        if refused := owner_only(claim):
            return refused
        return 200, self.svc.upload_edited_proposal(
            case_id,
            file_name=str(body.get("name") or "To_trinh_chinh_sua.docx"),
            content_b64=str(body.get("content_b64") or ""),
            actor=claim["ownerId"],
        )

    def confirm_proposal_diff(self, body: dict, claim: dict | None, case_id: str) -> tuple[int, Any]:
        if refused := owner_only(claim):
            return refused
        keys = body.get("keys")
        return 200, self.svc.confirm_proposal_diffs(
            case_id,
            keys if isinstance(keys, list) else None,
            actor=claim["ownerId"],
        )

    def lifecycle_action(self, body: dict, claim: dict | None, case_id: str) -> tuple[int, Any]:
        if refused := owner_only(claim):
            return refused
        return 200, self.svc.execute_lifecycle_action(
            case_id,
            str(body.get("action") or ""),
            body.get("payload") if isinstance(body.get("payload"), dict) else body,
            actor=claim["ownerId"],
        )

    def send_negotiation_comment(self, body: dict, claim: dict | None, case_id: str) -> tuple[int, Any]:
        if refused := owner_only(claim):
            return refused
        return 200, self.svc.send_negotiation_comment(
            case_id,
            str(body.get("message") or ""),
            actor=claim["ownerId"],
        )

    def accept_resolution(self, body: dict, claim: dict | None, case_id: str) -> tuple[int, Any]:
        if refused := owner_only(claim):
            return refused
        drafting = body.get("drafting_info") if isinstance(body.get("drafting_info"), dict) else body
        return 200, self.svc.accept_resolution_and_save_drafting(case_id, drafting, actor=claim["ownerId"])

    def receive_los_event(self, body: dict, claim: dict | None, case_id: str) -> tuple[int, Any]:
        # Accepts signed owner session (Sandbox simulation) or app-token (Real NCLOS/ELOS webhook integration)
        if claim is None or claim.get("kind") not in ("owner-session", "app-token"):
            return 403, {"error": "forbidden", "message": "Chỉ người dùng hoặc LOS webhook token hợp lệ mới được đẩy sự kiện LOS."}
        actor = claim.get("ownerId") or "los-webhook"
        return 200, self.svc.receive_los_event(
            case_id,
            str(body.get("event_type") or ""),
            body.get("payload") if isinstance(body.get("payload"), dict) else body,
            actor=actor,
        )


def make_handler(api: Api, secret: str, replays: ReplayCache, clock=None):
    kwargs = {"clock": clock} if clock else {}
    return appserver.make_handler(api, ROUTES, secret, replays, name="sme-connect", **kwargs)


def main() -> None:
    svc = SmecService(
        data_root=Path(os.environ.get("SME_CONNECT_DATA") or APP_ROOT / "data"),
        knowledge_root=Path(os.environ.get("SME_CONNECT_KNOWLEDGE") or APP_ROOT / "knowledge"),
        seed_if_empty=True,
    )
    handler = make_handler(Api(svc), os.environ.get("KIROCREW_PROXY_SECRET", ""), ReplayCache())
    port = int(os.environ.get("PORT", "8092"))
    ThreadingHTTPServer(("127.0.0.1", port), handler).serve_forever()


if __name__ == "__main__":
    main()
