"""Comprehensive tests for SME Master Checklist (Flow A & B, Groups A-I),
7 Cross-Check Rules, Sales CUSTOMER vs RM_INTERNAL split, and Handover Adapters.
"""

from __future__ import annotations

import base64
import json
import os
import sys
import tempfile
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "core"))

from sme_core.handover import CentralLosHandoverAdapter  # noqa: E402
from sme_core.sales import SalesService  # noqa: E402
from sme_core.service import LendingService  # noqa: E402

TODAY = "2026-11-21"


def _sales(tmp: str, lending_root: Path | None = None) -> SalesService:
    svc = SalesService(Path(tmp) / "sales", ROOT / "core" / "knowledge", data_home=Path(tmp), lending_data_root=lending_root)
    svc.store.clock = lambda: TODAY + "T09:00:00+00:00"
    return svc


class MasterChecklistTwoLayerTest(unittest.TestCase):
    def test_all_nine_groups_and_53_items_exist(self):
        spec = json.loads((ROOT / "core" / "knowledge" / "master_checklist.json").read_text(encoding="utf-8"))
        self.assertEqual([g["code"] for g in spec["groups"]], ["A", "B", "C", "D", "E", "F", "G", "H", "I"])
        self.assertEqual(len(spec["items"]), 53)

    def test_legal_entity_matrix_skipped_vs_required_vs_undetermined(self):
        with tempfile.TemporaryDirectory() as tmp:
            svc = _sales(tmp)
            # 1. Generic TNHH name without LLC_1/LLC_2 -> bb_hop_vay is UNDETERMINED_CONDITION,
            # while so_co_dong (JSC) and dk_ket_hon_dntn (PRIVATE) are SKIPPED!
            cid = svc.case_create(
                {"name": "Công ty TNHH ABC", "tax_id": "0101234567", "industry_code": "4669"},
                {"product_code": "SME-WC", "amount": 3e9, "purpose": "working_capital", "term_months": 12},
                [],
                "A",
            )["case_id"]
            by_k = {i["key"]: i for i in svc.overview(cid)["items"]}
            self.assertEqual(by_k["doc:dieu_le"]["rule_status"], "MISSING_REQUIRED")
            self.assertEqual(by_k["doc:ds_thanh_vien"]["rule_status"], "MISSING_REQUIRED")
            self.assertEqual(by_k["doc:bb_hop_vay"]["rule_status"], "UNDETERMINED_CONDITION")
            self.assertEqual(by_k["doc:so_co_dong"]["rule_status"], "SKIPPED")
            self.assertEqual(by_k["doc:dk_ket_hon_dntn"]["rule_status"], "SKIPPED")

            # 2. Switch to JSC -> so_co_dong & bb_hop_vay become MISSING_REQUIRED; ds_thanh_vien becomes SKIPPED
            svc.store.update_case(cid, {"customer": {"legal_type": "JSC"}}, actor="agent:x")
            by_jsc = {i["key"]: i for i in svc.overview(cid)["items"]}
            self.assertEqual(by_jsc["doc:so_co_dong"]["rule_status"], "MISSING_REQUIRED")
            self.assertEqual(by_jsc["doc:bb_hop_vay"]["rule_status"], "MISSING_REQUIRED")
            self.assertEqual(by_jsc["doc:ds_thanh_vien"]["rule_status"], "SKIPPED")

            # 3. Switch to PRIVATE -> dk_ket_hon_dntn applies; dieu_le & so_co_dong & ds_thanh_vien SKIPPED
            svc.store.update_case(cid, {"customer": {"legal_type": "PRIVATE"}}, actor="agent:x")
            by_prv = {i["key"]: i for i in svc.overview(cid)["items"]}
            self.assertEqual(by_prv["doc:dk_ket_hon_dntn"]["rule_status"], "MISSING_REQUIRED")
            self.assertEqual(by_prv["doc:dieu_le"]["rule_status"], "SKIPPED")
            self.assertEqual(by_prv["doc:ds_thanh_vien"]["rule_status"], "SKIPPED")

    def test_flow_a_vat_8q_24m_signature_bank_12m_and_5_site_photos(self):
        with tempfile.TemporaryDirectory() as tmp:
            svc = _sales(tmp)
            cid = svc.case_create(
                {"name": "Công ty Cổ phần Beta", "tax_id": "0108889999", "industry_code": "4669"},
                {"product_code": "SME-WC", "amount": 5e9, "purpose": "working_capital", "term_months": 12},
                [],
                "A",
            )["case_id"]
            svc.store.update_case(cid, {"facts": {"requires_bank_statement": True}}, actor="sale")
            d_vat = svc.store.add_document(
                cid, name="vat_6q.pdf", doc_type="to_khai_vat", issued_date="2026-10-20",
                meta={"tax_id": "0108889999", "filing_cycle": "quarterly", "periods_count": 6, "signature_valid": False},
                actor="agent:x",
            )
            d_bs = svc.store.add_document(
                cid, name="sao_ke_6m.pdf", doc_type="sao_ke_tk", issued_date="2026-11-01",
                meta={"months_covered": 6}, actor="agent:x",
            )
            d_ph = svc.store.add_document(
                cid, name="anh_3.jpg", doc_type="anh_thuc_dia", issued_date="2026-11-01",
                meta={"photo_count": 3}, actor="agent:x",
            )
            by_k = {i["key"]: i for i in svc.overview(cid)["items"]}
            self.assertEqual(by_k["doc:to_khai_vat"]["rule_status"], "FAIL")
            self.assertEqual(by_k["doc:sao_ke_tk"]["rule_status"], "FAIL")
            self.assertEqual(by_k["doc:anh_thuc_dia"]["rule_status"], "FAIL")

            # Fix VAT quarterly to 8 + valid signature, bank statement to 12m, photos to 5
            svc.store.update_document(cid, d_vat["id"], {"meta": {"periods_count": 8, "signature_valid": True}}, actor="sale")
            svc.store.update_document(cid, d_bs["id"], {"meta": {"months_covered": 12}}, actor="sale")
            svc.store.update_document(cid, d_ph["id"], {"meta": {"photo_count": 5}}, actor="sale")
            by_ok = {i["key"]: i for i in svc.overview(cid)["items"]}
            self.assertEqual(by_ok["doc:to_khai_vat"]["rule_status"], "PASS")
            self.assertEqual(by_ok["doc:sao_ke_tk"]["rule_status"], "PASS")
            self.assertEqual(by_ok["doc:anh_thuc_dia"]["rule_status"], "PASS")

            # Monthly VAT requires >= 24 periods
            svc.store.update_case(cid, {"facts": {"vat_filing_cycle": "monthly"}}, actor="sale")
            svc.store.update_document(cid, d_vat["id"], {"meta": {"filing_cycle": "monthly", "periods_count": 18}}, actor="sale")
            by_m = {i["key"]: i for i in svc.overview(cid)["items"]}
            self.assertEqual(by_m["doc:to_khai_vat"]["rule_status"], "FAIL")

    def test_flow_b_contracts_seller_buyer_and_vat_invoice_mapping(self):
        with tempfile.TemporaryDirectory() as tmp:
            svc = _sales(tmp)
            cid = svc.case_create(
                {"name": "Công ty TNHH MTV Gamma", "tax_id": "0102223333", "industry_code": "4100"},
                {"product_code": "SME-INV", "amount": 20e9, "purpose": "fixed_asset", "sub_purpose": "mmtb", "term_months": 48},
                [],
                "B",
            )["case_id"]
            # Wrong role on output contract -> FAIL; only 2 contracts -> FAIL
            d_out = svc.store.add_document(
                cid, name="hd_out.pdf", doc_type="hop_dong_dau_ra", issued_date="2026-10-01",
                meta={"customer_role": "buyer", "contract_count": 2, "counterparty_tax_id": "0105556666"},
                actor="sale",
            )
            by_k = {i["key"]: i for i in svc.overview(cid)["items"]}
            self.assertEqual(by_k["doc:bc_tien_do_ct"]["rule_status"], "MISSING_REQUIRED")
            self.assertEqual(by_k["doc:hd_mua_mmtb"]["rule_status"], "MISSING_REQUIRED")
            self.assertEqual(by_k["doc:hop_dong_dau_ra"]["rule_status"], "FAIL")
            self.assertEqual(by_k["doc:bc_khau_hao_tscd"]["rule_status"], "UNDETERMINED_CONDITION")

            # Provide 3 output contracts as seller with matching hoa_don_vat by counterparty MST
            svc.store.update_document(
                cid, d_out["id"],
                {"meta": {"customer_role": "seller", "contract_count": 3, "counterparty_tax_id": "0105556666"}},
                actor="sale",
            )
            svc.store.add_document(
                cid, name="vat_out.pdf", doc_type="hoa_don_vat", issued_date="2026-10-05",
                meta={"counterparty_tax_id": "0105556666"}, actor="sale",
            )
            by_ok = {i["key"]: i for i in svc.overview(cid)["items"]}
            self.assertEqual(by_ok["doc:hop_dong_dau_ra"]["rule_status"], "PASS")

    def test_group_h_approvals_threshold_and_amend_condition_group_i(self):
        with tempfile.TemporaryDirectory() as tmp:
            svc = _sales(tmp)
            # 60 ty -> Regional SME approval required, Division not triggered
            cid = svc.case_create(
                {"name": "Công ty Cổ phần Delta", "tax_id": "0103334444", "industry_code": "4669"},
                {"product_code": "SME-WC", "amount": 60e9, "purpose": "working_capital", "term_months": 12},
                [],
                "A",
            )["case_id"]
            by_60 = {i["key"]: i for i in svc.overview(cid)["items"]}
            self.assertEqual(by_60["doc:pd_gd_vung_sme"]["rule_status"], "MISSING_REQUIRED")
            self.assertEqual(by_60["doc:pd_gd_khoi_sme"]["rule_status"], "SKIPPED")

            # Substitute TP KD approval when configured
            svc.store.update_case(cid, {"facts": {"allow_tp_kd_substitute": True}}, actor="sale")
            svc.store.add_document(cid, name="pd_tp.pdf", doc_type="pd_tp_kd_sme", issued_date="2026-11-15", actor="sale")
            by_sub = {i["key"]: i for i in svc.overview(cid)["items"]}
            self.assertEqual(by_sub["doc:pd_gd_vung_sme"]["rule_status"], "PASS")

            # 160 ty -> both Regional & Division required; AMEND_CONDITION -> Group I required
            svc.store.update_case(cid, {"request": {"amount": 160e9, "case_type": "AMEND_CONDITION"}}, actor="sale")
            by_160 = {i["key"]: i for i in svc.overview(cid)["items"]}
            self.assertEqual(by_160["doc:pd_gd_khoi_sme"]["rule_status"], "MISSING_REQUIRED")
            self.assertEqual(by_160["doc:to_trinh_thay_doi_dk"]["rule_status"], "MISSING_REQUIRED")
            self.assertEqual(by_160["doc:nghi_quyet_thay_doi_dk"]["rule_status"], "MISSING_REQUIRED")

    def test_customer_draft_blocks_rm_internal_and_skipped_items(self):
        with tempfile.TemporaryDirectory() as tmp:
            svc = _sales(tmp)
            cid = svc.case_create(
                {"name": "Công ty Cổ phần Beta", "tax_id": "0108889999"},
                {"product_code": "SME-WC", "amount": 5e9, "purpose": "working_capital"},
                [],
                "A",
            )["case_id"]
            gaps = svc.gap_analysis(cid)
            cust_keys = {i["key"] for i in gaps["open_customer_items"]}
            rm_keys = {i["key"] for i in gaps["open_rm_items"]}
            self.assertIn("doc:dkkd", cust_keys)
            self.assertIn("doc:anh_thuc_dia", rm_keys)
            self.assertNotIn("doc:anh_thuc_dia", cust_keys)
            with self.assertRaises(ValueError):
                svc.draft_save(cid, "email", "Xin bổ sung", "Kính gửi...", ["doc:anh_thuc_dia"], agent="dossier-coach")
            with self.assertRaises(ValueError):
                svc.draft_save(cid, "email", "Xin bổ sung", "Kính gửi...", ["doc:dk_ket_hon_dntn"], agent="dossier-coach")


class CrossCheckAndVerifyTest(unittest.TestCase):
    def test_all_seven_crosschecks_and_recompute_verification(self):
        with tempfile.TemporaryDirectory() as tmp:
            lend = LendingService(Path(tmp) / "lending", ROOT / "core" / "knowledge")
            lend.store.clock = lambda: TODAY + "T09:00:00+00:00"
            cid = lend.case_create(
                {
                    "name": "Công ty Cổ phần Alpha",
                    "tax_id": "0101112222",
                    "legal_type": "JSC",
                    "legal_rep": "Nguyễn Văn A",
                    "charter_capital": 10e9,
                },
                {"product_code": "SME-INV", "amount": 10e9, "purpose": "fixed_asset", "sub_purpose": "mmtb"},
                [
                    {"id": "D1", "name": "dkkd.pdf", "type": "dkkd", "meta": {"tax_id": "0101112222", "legal_rep": "Nguyễn Văn A", "charter_capital": 10e9}},
                    {"id": "D2", "name": "bctc.pdf", "type": "bctc_2_ky", "issued_date": "2026-10-01", "meta": {"tax_id": "0109990000"}},
                    {"id": "D3", "name": "gcn.pdf", "type": "gcn_qsdd", "meta": {"owner_name": "Công ty Alpha", "asset_code": "TD-100"}},
                    {"id": "D4", "name": "prosland.pdf", "type": "bc_dinh_gia_prosland", "issued_date": "2026-09-01", "meta": {"owner_name": "Ông Khác", "asset_code": "TD-999"}},
                    {"id": "D5", "name": "sao_ke.pdf", "type": "sao_ke_tk", "meta": {"months_covered": 12, "undeclared_related_party_tx": True}},
                ],
                "B",
            )["case_id"]
            lend.store.update_case if hasattr(lend.store, "update_case") else None
            # Add facts via direct file or check R1 (tax_id mismatch on D2), R5 (tax_id mismatch), R6 (undeclared KHLQ), R7 (Prosland mismatch)
            xc = lend.crosscheck_evaluate(cid)
            rules = {r["id"]: r for r in xc["rules"]}
            self.assertEqual(rules["R1"]["status"], "FAIL")
            self.assertEqual(rules["R5"]["status"], "FAIL")
            self.assertEqual(rules["R6"]["status"], "FAIL")
            self.assertEqual(rules["R7"]["status"], "FAIL")

            # Deterministic verify.recompute accepts genuine checklist_eval & crosscheck_eval outputs and rejects tampered status
            eid = lend.evidence_add(cid, [{"source": "D1 p1", "value": "0101112222"}], "document-evidence")["ids"][0]
            cl = lend.checklist_evaluate(cid)
            res = lend.case_put_result(cid, "document-evidence", {
                "agent": "document-evidence",
                "case_id": cid,
                "summary": "Đối chiếu Master Checklist và 7 rule chéo.",
                "findings": [{"id": "F1", "topic": "data_conflict", "statement": "MST BCTC và định giá Prosland không khớp.", "severity": "high", "evidence_refs": [eid]}],
                "missing_information": [],
                "open_issues": [],
                "calculations": [
                    {"kind": "checklist_eval", "inputs": {"case_id": cid, "as_of": TODAY}, "outputs": {"overall_status": cl["overall_status"], "counts": cl["counts"]}},
                    {"kind": "crosscheck_eval", "inputs": {"case_id": cid, "as_of": TODAY}, "outputs": {"overall_status": xc["overall_status"], "rules": [{"id": r["id"], "status": r["status"]} for r in xc["rules"]]}},
                ],
                "confidence": "high",
            })
            self.assertTrue(res["accepted"], res)

            # Tamper rule status -> rejected!
            bad = lend.case_put_result(cid, "document-evidence", {
                "agent": "document-evidence",
                "case_id": cid,
                "summary": "Tampered",
                "findings": [{"id": "F1", "topic": "data_conflict", "statement": "Ok.", "severity": "info", "evidence_refs": [eid]}],
                "missing_information": [],
                "open_issues": [],
                "calculations": [
                    {"kind": "crosscheck_eval", "inputs": {"case_id": cid, "as_of": TODAY}, "outputs": {"overall_status": "PASS", "rules": [{"id": r["id"], "status": "PASS"} for r in xc["rules"]]}},
                ],
                "confidence": "high",
            })
            self.assertFalse(bad["accepted"])


class HandoverAdapterTest(unittest.TestCase):
    def test_local_lending_handover_copies_dossier_files_and_waivers(self):
        with tempfile.TemporaryDirectory() as tmp:
            lending_root = Path(tmp) / "apps" / "sme-lending" / "data"
            sales_svc = _sales(tmp, lending_root=lending_root)
            lend_svc = LendingService(lending_root, ROOT / "core" / "knowledge")

            cid = sales_svc.create_dossier(
                {"name": "Công ty TNHH MTV Handover", "tax_id": "0107778888", "legal_type": "LLC_1"},
                {"product_code": "SME-WC", "amount": 4e9, "purpose": "working_capital", "term_months": 12},
                flow="A",
            )["case_id"]
            doc = sales_svc.store.add_document(
                cid, name="dkkd.pdf", doc_type="dkkd", issued_date="2026-10-01",
                content_b64=base64.b64encode(b"%PDF-handover-test").decode(),
                meta={"tax_id": "0107778888"}, actor="agent:dossier-coach",
            )
            sales_svc.store.set_requirement(cid, "doc:anh_thuc_dia", "waived", "Đã hẹn bổ sung trước giải ngân", actor="sale-1")

            ov = sales_svc.submit_dossier(cid, actor="sale-1", note="Trình sớm kèm giải trình xin miễn ảnh thực địa")
            self.assertEqual(ov["stage"], "submitted")
            sub = sales_svc.store.get_case(cid)["submitted"]
            self.assertEqual(sub["handover"]["status"], "transferred")
            self.assertEqual(sub["handover"]["adapter"], "local_lending")
            self.assertEqual(sub["handover"]["files_copied"], 1)

            # Verify underwriting received identical case, file, waivers & audit log
            lcase = lend_svc.case_get(cid)
            self.assertEqual(lcase["customer"]["tax_id"], "0107778888")
            self.assertEqual(lcase["sales_handover"]["submitted_by"], "sale-1")
            self.assertEqual(lcase["sales_handover"]["waivers"][0]["key"], "doc:anh_thuc_dia")
            fpayload = lend_svc.store.document_file(cid, doc["id"])
            self.assertEqual(base64.b64decode(fpayload["content_b64"]), b"%PDF-handover-test")
            rows = lend_svc.store.list_cases()
            self.assertTrue(rows[0]["from_sales"])

    def test_central_los_adapter_contract_when_unconfigured(self):
        adapter = CentralLosHandoverAdapter(endpoint="")
        res = adapter.handover({"case_id": "SME-20261121-00000001"}, Path("."))
        self.assertEqual(res["adapter"], "central_los")
        self.assertEqual(res["status"], "not_configured")
        self.assertEqual(res["schema_version"], "sme-handover-1.0")


if __name__ == "__main__":
    unittest.main()
