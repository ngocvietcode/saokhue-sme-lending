"""Tests for the Sales side: gap analysis, requirement state, drafts, readiness."""

from __future__ import annotations

import base64
import json
import sys
import tempfile
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "core"))

from sme_core.sales import SalesService  # noqa: E402

TODAY = "2026-11-21"


def _svc(tmp: str) -> SalesService:
    svc = SalesService(Path(tmp), ROOT / "core" / "knowledge")
    svc.store.clock = lambda: TODAY + "T08:00:00+00:00"
    return svc


def _full_case(svc: SalesService) -> str:
    """Every field and SME-WC document present and in date."""
    customer = {"name": "Cong ty A", "tax_id": "0101234567", "industry_code": "4669"}
    request = {"product_code": "SME-WC", "amount": 5e9, "purpose": "working_capital", "term_months": 12}
    docs = [{"id": f"D{i}", "name": f"{t}.pdf", "type": t, "issued_date": "2026-10-01"}
            for i, t in enumerate(["dkkd", "dieu_le", "bctc_2_ky", "de_nghi_vay", "pavv",
                                   "hop_dong_dau_ra", "to_khai_vat"], start=1)]
    cid = svc.case_create(customer, request, docs, "A")["case_id"]
    svc.store.update_case(cid, {"facts": {"years_in_operation": 5}}, actor="sale")
    return cid


def _keys(ov, status=None):
    return {i["key"] for i in ov["items"] if status is None or i["status"] == status}


class GapAnalysisTest(unittest.TestCase):
    def test_a_complete_dossier_is_ready(self):
        with tempfile.TemporaryDirectory() as tmp:
            svc = _svc(tmp)
            ov = svc.overview(_full_case(svc))
        self.assertTrue(ov["readiness"]["ready"], ov["readiness"])
        self.assertEqual(ov["readiness"]["score"], 100)
        self.assertEqual(ov["stage"], "ready")

    def test_an_empty_dossier_lists_fields_and_common_documents(self):
        with tempfile.TemporaryDirectory() as tmp:
            svc = _svc(tmp)
            cid = svc.case_create({}, {}, [], "A")["case_id"]
            ov = svc.overview(cid)
        open_keys = _keys(ov, "open")
        self.assertIn("field:request.product_code", open_keys)
        self.assertIn("doc:dkkd", open_keys)
        self.assertNotIn("doc:pavv", open_keys, "product documents need a product first")
        self.assertFalse(ov["readiness"]["ready"])
        self.assertEqual(ov["stage"], "draft")

    def test_an_expired_document_blocks_and_a_missing_date_only_advises(self):
        with tempfile.TemporaryDirectory() as tmp:
            svc = _svc(tmp)
            cid = _full_case(svc)
            svc.store.update_document(cid, "D3", {"issued_date": "2024-12-31"}, actor="sale")
            svc.store.update_document(cid, "D7", {"issued_date": ""}, actor="sale")
            ov = svc.overview(cid)
        items = {i["key"]: i for i in ov["items"]}
        self.assertEqual(items["expired:bctc_2_ky"]["status"], "open")
        self.assertTrue(items["expired:bctc_2_ky"]["blocking"])
        self.assertIn("BCTC nội bộ", items["expired:bctc_2_ky"]["alternatives"][0])
        self.assertFalse(items["date:to_khai_vat"]["blocking"])
        self.assertIn("expired:bctc_2_ky", ov["readiness"]["blocking_open"])
        self.assertNotIn("date:to_khai_vat", ov["readiness"]["blocking_open"])

    def test_policy_precheck_flags_a_breach_without_blocking(self):
        with tempfile.TemporaryDirectory() as tmp:
            svc = _svc(tmp)
            cid = _full_case(svc)
            svc.store.update_case(cid, {"request": {"amount": 20e9}}, actor="sale")
            ov = svc.overview(cid)
        items = {i["key"]: i for i in ov["items"]}
        self.assertEqual(items["policy:C2"]["status"], "open")
        self.assertFalse(items["policy:C2"]["blocking"])
        self.assertTrue(ov["readiness"]["ready"])
        self.assertNotIn("policy:C4", items, "DSCR is underwriting's, not a Sales gap")


class RequirementStateTest(unittest.TestCase):
    def test_upload_closes_a_gap_and_a_waiver_needs_a_reason(self):
        with tempfile.TemporaryDirectory() as tmp:
            svc = _svc(tmp)
            cid = svc.case_create({"name": "A", "tax_id": "1"}, {"product_code": "SME-WC"}, [], "A")["case_id"]
            svc.overview(cid)
            with self.assertRaises(ValueError):
                svc.store.set_requirement(cid, "doc:dieu_le", "waived", "  ", actor="sale")
            svc.store.set_requirement(cid, "doc:dieu_le", "waived", "Công ty TNHH 1 thành viên", actor="sale")
            svc.store.add_document(cid, name="dkkd.pdf", doc_type="dkkd", issued_date=None,
                                   content_b64=base64.b64encode(b"%PDF").decode(), actor="sale")
            ov = svc.overview(cid)
            items = {i["key"]: i for i in ov["items"]}
            self.assertEqual(items["doc:dkkd"]["status"], "resolved")
            self.assertEqual(items["doc:dieu_le"]["status"], "waived")
            self.assertIn("doc:dieu_le", ov["readiness"]["waived"])
            self.assertEqual(ov["stage"], "collecting")
            self.assertTrue(svc.store.document_path(cid, "D1").read_bytes().startswith(b"%PDF"))

    def test_sending_a_draft_marks_its_items_requested(self):
        with tempfile.TemporaryDirectory() as tmp:
            svc = _svc(tmp)
            cid = svc.case_create({}, {"product_code": "SME-WC"}, [], "A")["case_id"]
            svc.overview(cid)
            draft = svc.draft_save(cid, "email", "Bổ sung hồ sơ", "Kính gửi Quý khách, ...",
                                   ["doc:bctc_2_ky"], agent="dossier-coach")
            svc.store.mark_draft_sent(cid, draft["id"], actor="sale")
            items = {i["key"]: i for i in svc.overview(cid)["items"]}
        self.assertEqual(items["doc:bctc_2_ky"]["status"], "requested")
        self.assertEqual(items["doc:dkkd"]["status"], "open")

    def test_a_draft_never_promises_an_outcome_or_names_unknown_items(self):
        with tempfile.TemporaryDirectory() as tmp:
            svc = _svc(tmp)
            cid = svc.case_create({}, {}, [], "A")["case_id"]
            with self.assertRaises(ValueError):
                svc.draft_save(cid, "zalo", "", "Hồ sơ của anh chắc chắn được duyệt.", [], agent="x")
            with self.assertRaises(ValueError):
                svc.draft_save(cid, "zalo", "", "Nhờ anh gửi giấy tờ.", ["doc:nope"], agent="x")

    def test_only_listed_fields_are_editable(self):
        with tempfile.TemporaryDirectory() as tmp:
            svc = _svc(tmp)
            cid = svc.case_create({}, {}, [], "A")["case_id"]
            with self.assertRaises(ValueError):
                svc.store.update_case(cid, {"request": {"approved": True}}, actor="sale")

    def test_sample_fixture_gets_a_score(self):
        fixture = json.loads((ROOT / "tests" / "fixtures" / "sample_case.json").read_text(encoding="utf-8"))
        with tempfile.TemporaryDirectory() as tmp:
            svc = _svc(tmp)
            cid = svc.case_create(fixture["customer"], fixture["request"], fixture["documents"], "A")["case_id"]
            row = svc.list_dossiers()[0]
        self.assertEqual(row["case_id"], cid)
        self.assertTrue(0 < row["score"] < 100)
        self.assertGreater(row["open_items"], 0)


if __name__ == "__main__":
    unittest.main()
