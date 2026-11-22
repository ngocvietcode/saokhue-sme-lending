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
    """Every field and Master Checklist (Flow A, SME-WC, LLC_1) item present and passing."""
    customer = {
        "name": "Công ty TNHH MTV A",
        "tax_id": "0101234567",
        "industry_code": "4669",
        "legal_type": "LLC_1",
    }
    request = {"product_code": "SME-WC", "amount": 5e9, "purpose": "working_capital", "term_months": 12}
    docs = [
        {"id": "D1", "name": "dkkd.pdf", "type": "dkkd", "issued_date": "2026-10-01"},
        {"id": "D2", "name": "dieu_le.pdf", "type": "dieu_le", "issued_date": "2026-10-01"},
        {"id": "D3", "name": "bctc_2_ky.pdf", "type": "bctc_2_ky", "issued_date": "2026-10-01"},
        {"id": "D4", "name": "de_nghi_vay.pdf", "type": "de_nghi_vay", "issued_date": "2026-10-01"},
        {"id": "D5", "name": "to_trinh_dexuat.pdf", "type": "to_trinh_dexuat", "issued_date": "2026-10-01"},
        {"id": "D6", "name": "cccd_chu_chot.pdf", "type": "cccd_chu_chot", "issued_date": "2026-10-01"},
        {"id": "D7", "name": "ds_thanh_vien.pdf", "type": "ds_thanh_vien", "issued_date": "2026-10-01"},
        {"id": "D8", "name": "thong_tin_cic.pdf", "type": "thong_tin_cic", "issued_date": "2026-11-15"},
        {
            "id": "D9",
            "name": "to_khai_vat_8q.pdf",
            "type": "to_khai_vat",
            "issued_date": "2026-10-20",
            "meta": {"tax_id": "0101234567", "filing_cycle": "quarterly", "periods_count": 8, "signature_valid": True},
        },
        {
            "id": "D10",
            "name": "hop_dong_dau_ra.pdf",
            "type": "hop_dong_dau_ra",
            "issued_date": "2026-10-01",
            "meta": {"customer_role": "seller", "counterparty_tax_id": "0109998888", "vat_invoice_matched": True},
        },
        {
            "id": "D11",
            "name": "anh_thuc_dia.pdf",
            "type": "anh_thuc_dia",
            "issued_date": "2026-10-01",
            "meta": {"photo_count": 5},
        },
    ]
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
        self.assertEqual(ov["checklist_overall"], "COMPLETE")
        self.assertEqual(ov["readiness"]["score"], 100)
        self.assertEqual(ov["stage"], "ready")

    def test_an_empty_dossier_lists_fields_and_common_documents(self):
        with tempfile.TemporaryDirectory() as tmp:
            svc = _svc(tmp)
            cid = svc.case_create({}, {}, [], "A")["case_id"]
            ov = svc.overview(cid)
        items = {i["key"]: i for i in ov["items"]}
        open_keys = _keys(ov, "open")
        self.assertIn("field:request.product_code", open_keys)
        self.assertIn("doc:dkkd", open_keys)
        self.assertEqual(items["doc:bctc_2_ky"]["rule_status"], "UNDETERMINED_CONDITION",
                         "Flow A BCTC applicability depends on product_code")
        self.assertFalse(ov["readiness"]["ready"])
        self.assertEqual(ov["checklist_overall"], "INCOMPLETE")
        self.assertEqual(ov["stage"], "draft")

    def test_an_expired_document_blocks_and_a_missing_date_only_advises(self):
        with tempfile.TemporaryDirectory() as tmp:
            svc = _svc(tmp)
            cid = _full_case(svc)
            svc.store.update_document(cid, "D3", {"issued_date": "2024-12-31"}, actor="sale")
            svc.store.update_document(cid, "D9", {"issued_date": ""}, actor="sale")
            ov = svc.overview(cid)
        items = {i["key"]: i for i in ov["items"]}
        self.assertEqual(items["doc:bctc_2_ky"]["status"], "open")
        self.assertEqual(items["doc:bctc_2_ky"]["rule_status"], "FAIL")
        self.assertTrue(items["doc:bctc_2_ky"]["blocking"])
        self.assertIn("BCTC nội bộ", items["doc:bctc_2_ky"]["alternatives"][0])
        self.assertFalse(items["date:to_khai_vat"]["blocking"])
        self.assertIn("doc:bctc_2_ky", ov["readiness"]["blocking_open"])
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

    def test_fields_are_free_form_but_well_formed(self):
        with tempfile.TemporaryDirectory() as tmp:
            svc = _svc(tmp)
            cid = svc.case_create({}, {}, [], "A")["case_id"]
            for bad in ({"request": {"Bad Key": 1}}, {"customer": {"owners": ["a", "b"]}},
                        {"labels": {"other.x": "X"}}):
                with self.assertRaises(ValueError):
                    svc.store.update_case(cid, bad, actor="sale")
            svc.store.update_case(cid, {"customer": {"name": "B", "so_lao_dong": 42},
                                        "labels": {"customer.so_lao_dong": "Số lao động"}}, actor="agent:x")
            prof = {p["path"]: p for p in svc.overview(cid)["profile"]}
            self.assertEqual(prof["customer.so_lao_dong"]["label"], "Số lao động")
            self.assertEqual(prof["customer.name"]["label"], "Tên khách hàng")
            svc.store.update_case(cid, {"customer": {"so_lao_dong": None}}, actor="agent:x")
            self.assertNotIn("customer.so_lao_dong", {p["path"] for p in svc.overview(cid)["profile"]})


class ChatIntakeTest(unittest.TestCase):
    def test_import_only_from_upload_folders(self):
        with tempfile.TemporaryDirectory() as tmp:
            home = Path(tmp)
            (home / "uploads").mkdir()
            (home / "uploads" / "dkkd.pdf").write_bytes(b"%PDF-1.4")
            (home / "secret.pdf").write_bytes(b"%PDF")
            (home / "uploads" / "run.exe").write_bytes(b"MZ")
            svc = SalesService(home / "apps" / "sme-sales" / "data", ROOT / "core" / "knowledge", data_home=home)
            cid = svc.case_create({}, {"product_code": "SME-WC"}, [], "A")["case_id"]
            roots = svc.import_roots()
            doc = svc.store.import_file(cid, str(home / "uploads" / "dkkd.pdf"), roots=roots, doc_type="dkkd",
                                        summary="ĐKKD thay đổi lần 3", actor="agent:dossier-coach")
            self.assertEqual((doc["type"], doc["summary"]), ("dkkd", "ĐKKD thay đổi lần 3"))
            self.assertEqual(svc.store.document_path(cid, doc["id"]).read_bytes(), b"%PDF-1.4")
            for path in (home / "secret.pdf", home / "uploads" / "run.exe", home / "uploads" / "nope.pdf",
                         home / "uploads" / ".." / "secret.pdf"):
                with self.assertRaises(ValueError, msg=str(path)):
                    svc.store.import_file(cid, str(path), roots=roots, actor="agent:x")


class ExtractionTest(unittest.TestCase):
    def test_a_document_asks_for_its_fields_until_filled_or_not_stated(self):
        with tempfile.TemporaryDirectory() as tmp:
            svc = _svc(tmp)
            cid = svc.case_create({"name": "A", "tax_id": "1"}, {"product_code": "SME-WC"}, [], "A")["case_id"]
            doc = svc.store.add_document(cid, name="dkkd.pdf", doc_type="dkkd", issued_date="2026-09-10",
                                         content_b64=None, actor="agent:x")
            todo = {m["path"]: m["label"] for m in svc.extract_next(cid, doc["id"])}
            self.assertEqual(todo["customer.address"], "Địa chỉ trụ sở")
            self.assertNotIn("customer.name", todo)
            act = next(a for a in svc.overview(cid)["actions"] if a["kind"] == "extract")
            self.assertIn("Người đại diện theo pháp luật", act["detail"][0])
            svc.store.update_case(cid, {"customer": {"address": "Hà Nội", "legal_rep": "Ông B", "legal_type": "LLC_1",
                                                     "charter_capital": 5e9, "established": "2019-03-15"}}, actor="x")
            svc.store.update_document(cid, doc["id"], {"not_stated": ["customer.industry_code"]}, actor="x")
            self.assertEqual(svc.extract_next(cid, doc["id"]), [])
            self.assertNotIn("extract", [a["kind"] for a in svc.overview(cid)["actions"]])
            labels = {p["path"]: p["label"] for p in svc.overview(cid)["profile"]}
            self.assertEqual(labels["customer.charter_capital"], "Vốn điều lệ")

    def test_overview_rows_carry_what_the_list_shows(self):
        with tempfile.TemporaryDirectory() as tmp:
            svc = _svc(tmp)
            cid = svc.case_create({"name": "A"}, {"product_code": "SME-WC"}, [], "A")["case_id"]
            row = svc.list_dossiers()[0]
        self.assertTrue({"actions", "items_open", "profile", "documents"} <= set(row))
        self.assertEqual(row["case_id"], cid)
        self.assertTrue(all("title" in i for i in row["items_open"]))


class ActionsTest(unittest.TestCase):
    def test_new_dossier_asks_for_documents_first(self):
        with tempfile.TemporaryDirectory() as tmp:
            svc = _svc(tmp)
            cid = svc.case_create({"name": "Cong ty TNHH MTV A"}, {"product_code": "SME-WC"}, [], "A")["case_id"]
            kinds = [a["kind"] for a in svc.overview(cid)["actions"]]
        self.assertEqual(kinds[0], "first_upload")
        self.assertIn("request_docs", kinds)
        self.assertIn("fill_info", kinds)

    def test_ready_puts_submit_first_and_overdue_reminds(self):
        with tempfile.TemporaryDirectory() as tmp:
            svc = _svc(tmp)
            cid = _full_case(svc)
            acts = svc.overview(cid)["actions"]
            self.assertEqual(acts[0]["kind"], "submit")
            svc.store.update_document(cid, "D3", {"issued_date": "2024-01-01"}, actor="sale")
            svc.store.set_requirement(cid, "doc:bctc_2_ky", "requested", "", actor="sale", due_date="2026-11-10")
            acts = svc.overview(cid)["actions"]
            self.assertEqual(acts[0]["kind"], "remind")
            self.assertEqual(acts[0]["keys"], ["doc:bctc_2_ky"])
            rows = svc.list_dossiers()
            self.assertEqual(rows[0]["overdue"], 1)
            self.assertEqual(svc.today(rows)["overdue"], [cid])

    def test_one_completion_figure_for_list_card_and_dossier_page(self):
        """The list card, the table and the dossier KPI all read `progress`."""
        with tempfile.TemporaryDirectory() as tmp:
            svc = _svc(tmp)
            cid = svc.case_create(
                {"name": "Công ty TNHH MTV A", "tax_id": "1", "legal_type": "LLC_1"},
                {"product_code": "SME-WC", "purpose": "working_capital"},
                [],
                "A",
            )["case_id"]
            svc.overview(cid)
            svc.store.set_requirement(cid, "doc:dieu_le", "requested", "đã xin", actor="sale")
            ov = svc.overview(cid)
            row = svc.list_dossiers()[0]
        p = ov["progress"]
        self.assertEqual(row["progress"], p)
        counted = [i for i in ov["items"] if i["kind"] != "policy_precheck"
                   and i.get("applicable", True) and i.get("rule_status") != "SKIPPED"]
        self.assertEqual(p["mandatory_total"] + p["optional_total"], sum(g["total"] for g in ov["groups"]))
        self.assertEqual(p["mandatory_done"] + p["optional_done"], sum(g["done"] for g in ov["groups"]))
        self.assertEqual(p["mandatory_total"], sum(1 for i in counted if i["blocking"]))
        self.assertEqual(p["waiting"], 1)
        self.assertEqual(p["to_request"], sum(1 for i in counted if i["blocking"] and i["status"] == "open"))
        self.assertLessEqual(p["to_request"] + p["waiting"], len(ov["readiness"]["blocking_open"]))

    def test_group_progress_counts_waived_as_done(self):
        with tempfile.TemporaryDirectory() as tmp:
            svc = _svc(tmp)
            cid = svc.case_create(
                {"name": "Công ty TNHH MTV A", "tax_id": "1", "legal_type": "LLC_1"},
                {"product_code": "SME-WC", "purpose": "working_capital"},
                [],
                "A",
            )["case_id"]
            svc.overview(cid)
            svc.store.set_requirement(cid, "doc:dieu_le", "waived", "lý do", actor="sale")
            legal = next(g for g in svc.overview(cid)["groups"] if g["group"] == "B")
        self.assertEqual(legal["done"], 3)  # name, tax_id, waived dieu_le
        self.assertGreater(legal["blocked"], 0)

    def test_sample_fixture_gets_a_score(self):
        fixture = json.loads((ROOT / "tests" / "fixtures" / "sample_case.json").read_text(encoding="utf-8"))
        with tempfile.TemporaryDirectory() as tmp:
            svc = _svc(tmp)
            cid = svc.case_create(fixture["customer"], fixture["request"], fixture["documents"], "A")["case_id"]
            row = svc.list_dossiers()[0]
        self.assertEqual(row["case_id"], cid)
        self.assertTrue(0 < row["score"] < 100)
        self.assertGreater(row["open_items"], 0)


class ValidationAndLifecycleTest(unittest.TestCase):
    def test_invalid_dates_numbers_product_and_doc_type_are_guarded(self):
        with tempfile.TemporaryDirectory() as tmp:
            home = Path(tmp)
            (home / "uploads").mkdir()
            (home / "uploads" / "a.pdf").write_bytes(b"%PDF")
            svc = SalesService(home / "apps" / "sme-sales" / "data", ROOT / "core" / "knowledge", data_home=home)
            svc.store.clock = lambda: TODAY + "T08:00:00+00:00"

            with self.assertRaises(ValueError):
                svc.create_dossier({"name": "Cty"}, {"amount": "5 tỷ"})
            self.assertEqual(svc.store.list_cases(), [], "failed create_dossier must not leave an orphan case")

            cid = svc.create_dossier({"name": "Cty", "established": "2022-01-10"},
                                     {"product_code": "SME_WC", "amount": "5000000000"})["case_id"]
            ov = svc.overview(cid)
            self.assertFalse(ov["readiness"]["ready"])
            self.assertIn("field:request.product_code_valid", ov["readiness"]["blocking_open"])

            svc.store.update_case(cid, {"request": {"product_code": "SME-LC", "purpose": "fixed_asset"}}, actor="agent:x")
            ov_lc = svc.overview(cid)
            self.assertTrue(any(p["id"] == "C2" for p in ov_lc["policy_checks"]))
            items = {i["key"]: i for i in ov_lc["items"]}
            self.assertEqual(items["fact:years_in_operation"]["status"], "ok", "derived from customer.established")
            self.assertEqual(items["policy:purpose"]["status"], "open")

            with self.assertRaises(ValueError):
                svc.import_document(cid, str(home / "uploads" / "a.pdf"), doc_type="bctc_sai")
            with self.assertRaises(ValueError):
                svc.import_document(cid, str(home / "uploads" / "a.pdf"), doc_type="dkkd", issued_date="15/10/2026")
            doc = svc.import_document(cid, str(home / "uploads" / "a.pdf"), doc_type="dkkd",
                                      issued_date="2026-10-01", summary="ĐKKD")["document"]
            with self.assertRaises(ValueError):
                svc.classify_document(cid, doc["id"], doc_type="unknown_type")

    def test_draft_author_whitespace_promise_and_due_date_refresh(self):
        with tempfile.TemporaryDirectory() as tmp:
            svc = _svc(tmp)
            cid = svc.case_create({"name": "A"}, {"product_code": "SME-WC"}, [], "A")["case_id"]
            svc.overview(cid)
            with self.assertRaises(ValueError):
                svc.draft_save(cid, "zalo", "", "Hồ sơ chắc chắn\nđược duyệt nha anh.", ["doc:dkkd"], agent="dossier-coach")
            draft = svc.draft_save(cid, "email", "Xin bổ sung", "Kính gửi anh chị...", ["doc:dkkd"], agent="dossier-coach")
            self.assertEqual(draft["author"], "agent:dossier-coach")

            svc.store.clock = lambda: "2026-11-22T09:00:00+00:00"
            svc.store.mark_draft_sent(cid, draft["id"], actor="sale", due_date="2026-11-24")
            items = {i["key"]: i for i in svc.overview(cid)["items"]}
            self.assertEqual(items["doc:dkkd"]["status"], "requested")
            self.assertEqual(items["doc:dkkd"]["due_date"], "2026-11-24")

            # Follow-up draft refreshes requested_at and due_date on already-requested items
            draft2 = svc.draft_save(cid, "zalo", "", "Nhắc nhẹ...", ["doc:dkkd"], agent="dossier-coach")
            svc.store.clock = lambda: "2026-11-26T09:00:00+00:00"
            svc.store.mark_draft_sent(cid, draft2["id"], actor="sale", due_date="2026-11-29")
            items2 = {i["key"]: i for i in svc.overview(cid)["items"]}
            self.assertEqual(items2["doc:dkkd"]["requested_at"], "2026-11-26T09:00:00+00:00")
            self.assertEqual(items2["doc:dkkd"]["due_date"], "2026-11-29")

            # Reopening clears due_date
            svc.store.set_requirement(cid, "doc:dkkd", "open", "", actor="sale")
            items3 = {i["key"]: i for i in svc.overview(cid)["items"]}
            self.assertNotIn("due_date", items3["doc:dkkd"])

            # Submitted case locks updates until reopened
            svc.store.mark_submitted(cid, actor="sale", note="nộp")
            with self.assertRaises(ValueError):
                svc.store.update_case(cid, {"customer": {"tax_id": "0101"}}, actor="agent:x")
            with self.assertRaises(ValueError):
                svc.draft_save(cid, "zalo", "", "ok", ["doc:dkkd"], agent="dossier-coach")
            svc.store.reopen_case(cid, actor="sale", note="Bổ sung theo yêu cầu Thẩm định")
            svc.store.update_case(cid, {"customer": {"tax_id": "0101234567"}}, actor="agent:x")
            self.assertEqual(svc.store.get_case(cid)["customer"]["tax_id"], "0101234567")


if __name__ == "__main__":
    unittest.main()
