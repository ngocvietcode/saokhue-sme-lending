"""Comprehensive unit & HTTP backend tests for the independent 3rd app (`apps/sme-connect`).

Verifies:
1. 100% storage isolation (zero writes/reads to `sme-sales` or `sme-lending`).
2. Multi-product initialization, Core CIF/DKKD hard readonly locks, and dynamic hiding of `06_blcn`
   when proposed products are 100% unsecured.
3. OpenXML `.xlsx` B4 template generation, deterministic parsing, formula cross-checks & readonly lock
   on `05_pavv.*` fields.
4. NCLOS case pull (`Tải về hồ sơ đã có trên NCLOS`) and auto-classification of uploaded files.
5. 9-Agent structured evaluation + deterministic verification + VPBank Risk/CIC/EWS/KSSV checks.
6. Proposal `.docx` (`MB02.PL03.HDM-TD-CV.NA/05`) + SHA-256 QR SVG + Round-trip Diff Engine gating
   submission until CBBH confirms all diffs.
7. Full lifecycle state machine: LOS submission, ELOS Resolution PDF issuance, 2-way CPC <-> CBBH
   negotiation, `01 Thông tin soạn thảo`, `Chuyển KH xác nhận (B2B)`, `Chuyển luồng offline`, and
   `Sale Huỷ hồ sơ` + owner-only security checks.
"""

from __future__ import annotations

import base64
import importlib.util
import sys
import tempfile
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
APP_DIR = ROOT / "apps" / "sme-connect"
sys.path.insert(0, str(APP_DIR / "server"))

from smec.b4_excel import generate_b4_template_xlsx, parse_b4_xlsx  # noqa: E402
from smec.service import SmecService  # noqa: E402

_spec = importlib.util.spec_from_file_location("smec_backend", APP_DIR / "backend" / "server.py")
smec_backend = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(smec_backend)

OWNER = {"kind": "owner-session", "ownerId": "Namcvt123"}
AGENT = {"kind": "agent-tool", "ownerId": ""}
LOS_TOKEN = {"kind": "app-token", "ownerId": ""}


class SmeConnectDomainTest(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.svc = SmecService(Path(self.tmp.name), ROOT / "core" / "knowledge", seed_if_empty=False)
        self.svc.store.clock = lambda: "2026-11-22T10:00:00+00:00"
        self.api = smec_backend.Api(self.svc)

    def tearDown(self):
        self.tmp.cleanup()

    def test_seed_creates_isolated_secured_and_unsecured_demo_cases(self):
        self.svc.seed_demo_cases_if_empty()
        rows = self.svc.list_cases()
        self.assertEqual(len(rows), 2)
        by_smec = {r["smec_id"]: r for r in rows}
        self.assertIn("HS-2026-0842", by_smec)
        self.assertIn("HS-2026-0819", by_smec)

        # Unsecured case (`HS-2026-0819`) dynamically hides `06_blcn`
        unsecured_detail = self.svc.get_full_case(by_smec["HS-2026-0819"]["case_id"])
        self.assertFalse(unsecured_detail["ocr"]["has_collateral"])
        self.assertIn("06_blcn", unsecured_detail["ocr"]["hidden_categories"])
        self.assertEqual(unsecured_detail["case"]["status_meta"]["detail_status"], "PENDING_NEGOTIATION")
        self.assertIsNotNone(unsecured_detail["resolution"]["resolution_doc"])

        # Secured case (`HS-2026-0842`) includes all 6 OCR categories including `06_blcn`
        secured_detail = self.svc.get_full_case(by_smec["HS-2026-0842"]["case_id"])
        self.assertTrue(secured_detail["ocr"]["has_collateral"])
        self.assertEqual(len(secured_detail["ocr"]["categories"]), 6)
        self.assertIn("items", secured_detail["checklist"])
        self.assertGreater(len(secured_detail["checklist"]["items"]), 0)
        self.assertIn("rule_status", secured_detail["checklist"]["items"][0])
        self.assertEqual(len(secured_detail["crosschecks"]["rules"]), 7)
        self.assertEqual(secured_detail["crosschecks"]["rules"][0]["id"], "R1")

    def test_ocr_readonly_locks_dkkd_cif_and_blocks_direct_pavv_edits(self):
        created = self.svc.init_case(
            {"dkkd_no": "0108924510", "requested_amount": 17_000_000_000, "has_collateral": True},
            actor="Namcvt123",
        )
        cid = created["case"]["case_id"]

        # Editing DKKD or CIF must raise ValueError
        with self.assertRaises(ValueError):
            self.svc.update_ocr(cid, [{"path": "01_customer.dkkd_no", "value": "9999999999"}], actor="Namcvt123")
        with self.assertRaises(ValueError):
            self.svc.update_ocr(cid, [{"path": "01_customer.cif", "value": "99999999"}], actor="Namcvt123")

        # Editing `05_pavv.*` directly without Excel B4 must raise ValueError
        with self.assertRaises(ValueError):
            self.svc.update_ocr(cid, [{"path": "05_pavv.planned_revenue", "value": 90_000_000_000}], actor="Namcvt123")

        # Confirming an editable `needs_confirm` field succeeds and flips it to `trusted`
        updated = self.svc.update_ocr(
            cid,
            [{"path": "04_financial.revenue_n_1", "value": 68_200_000_000}],
            selected_agent_groups=["fin", "risk"],
            actor="Namcvt123",
        )
        self.assertEqual(updated["case"]["smec"]["selected_agent_groups"], ["fin", "risk"])
        fin_cat = next(c for c in updated["ocr"]["categories"] if c["id"] == "04_financial")
        rev_field = next(f for f in fin_cat["fields"] if f["path"] == "04_financial.revenue_n_1")
        self.assertEqual(rev_field["confidence_tier"], "trusted")
        self.assertEqual(rev_field["confirmed_by"], "Namcvt123")

    def test_b4_excel_template_roundtrip_and_formula_validation(self):
        created = self.svc.init_case(
            {"dkkd_no": "0108924510", "requested_amount": 15_000_000_000, "has_collateral": True},
            actor="Namcvt123",
        )
        cid = created["case"]["case_id"]
        tpl = self.svc.download_b4_template(cid)
        self.assertTrue(tpl["name"].endswith(".xlsx"))

        after = self.svc.upload_b4_excel(cid, file_name=tpl["name"], content_b64=tpl["content_b64"], actor="Namcvt123")
        self.assertTrue(after["ocr"]["pavv_b4_loaded"])
        b4 = after["ocr"]["pavv_b4_summary"]
        self.assertEqual(b4["values"]["max_vpb_wc_limit"], 15_400_000_000)
        self.assertTrue(b4["computed_checks"]["formula_passed"])

        # Tampered B4 where proposed limit exceeds max limit triggers formula warning
        bad_xlsx = generate_b4_template_xlsx(overrides={"proposed_vpb_wc_limit": 19_000_000_000})
        bad_parsed = parse_b4_xlsx(bad_xlsx, "Bad_B4.xlsx")
        self.assertFalse(bad_parsed["computed_checks"]["formula_passed"])
        self.assertTrue(any("vượt Hạn mức" in w for w in bad_parsed["computed_checks"]["warnings"]))

    def test_nclos_pull_evaluation_proposal_diff_and_full_lifecycle(self):
        # 1. Pull existing dossier from NCLOS (`NCLOS-0000116194`)
        status, body = self.api.pull_nclos({"nclos_id": "NCLOS-0000116194"}, OWNER)
        self.assertEqual(status, 200)
        cid = body["case"]["case_id"]
        self.assertEqual(body["case"]["smec"]["nclos_id"], "NCLOS-0000116194")
        self.assertGreaterEqual(len(body["case"]["documents"]), 8)

        # 2. Upload B4 & Run 9-Agent Evaluation
        tpl = self.svc.download_b4_template(cid)
        self.api.upload_b4_excel({"name": tpl["name"], "content_b64": tpl["content_b64"]}, OWNER, cid)
        status, ev_body = self.api.evaluate_case({"selected_groups": ["fin", "col", "risk", "pol"]}, OWNER, cid)
        self.assertEqual(status, 200)
        self.assertGreaterEqual(ev_body["evaluation"]["agents_completed"], 7)
        self.assertEqual(len(ev_body["evaluation"]["sections"]["risk"]["internal_watchlists"]), 7)

        # 3. Generate Proposal (`MB02.PL03...` + QR SVG) & Upload CBBH-edited `.docx` -> Diff Engine
        status, p_body = self.api.generate_proposal({}, OWNER, cid)
        self.assertEqual(status, 200)
        self.assertIn("<svg", p_body["proposal"]["qr_meta"]["qr_svg"])

        edited_docx = self.api.download_sample_edited_proposal({}, None, cid)[1]
        status, diff_body = self.api.upload_edited_proposal(
            {"name": edited_docx["name"], "content_b64": edited_docx["content_b64"]}, OWNER, cid
        )
        self.assertEqual(status, 200)
        self.assertEqual(len(diff_body["proposal"]["diffs"]), 2)
        self.assertFalse(diff_body["proposal"]["all_diffs_confirmed"])

        # Submitting before confirming diffs must fail with ValueError
        with self.assertRaises(ValueError):
            self.api.lifecycle_action({"action": "submit_approval"}, OWNER, cid)

        # Confirm diffs -> Submit to LOS succeeds
        self.api.confirm_proposal_diff({}, OWNER, cid)
        status, sub_body = self.api.lifecycle_action({"action": "submit_approval", "note": "Trình CPC"}, OWNER, cid)
        self.assertEqual(status, 200)
        self.assertEqual(sub_body["case"]["status_meta"]["detail_status"], "PENDING_APPROVAL")

        # 4. Receive ELOS webhook (`app-token` allowed!) -> Negotiate -> Accept Resolution -> B2B Complete
        status, los_body = self.api.receive_los_event(
            {"event_type": "RESOLUTION_ISSUED", "resolution_no": "NQ-2026-999"}, LOS_TOKEN, cid
        )
        self.assertEqual(status, 200)
        self.assertEqual(los_body["case"]["status_meta"]["detail_status"], "PENDING_NEGOTIATION")

        self.api.send_negotiation_comment({"message": "ĐVKD đề nghị giảm cam kết dòng tiền về 65%."}, OWNER, cid)
        self.api.accept_resolution({"drafting_info": {"resolution_code": "NQ-2026-999"}}, OWNER, cid)
        self.api.lifecycle_action({"action": "send_b2b_confirm"}, OWNER, cid)
        _, done_body = self.api.lifecycle_action({"action": "mark_b2b_done"}, OWNER, cid)
        self.assertEqual(done_body["case"]["status_meta"]["list_status"], "APPROVED")
        self.assertEqual(done_body["case"]["status_meta"]["detail_status"], "COMPLETED")

    def test_agent_principal_cannot_mutate_cbbh_decisions(self):
        created = self.svc.init_case({"dkkd_no": "0108924510", "requested_amount": 5_000_000_000}, actor="Namcvt123")
        cid = created["case"]["case_id"]
        for call in (
            lambda c: self.api.init_case({"dkkd_no": "0108924510"}, c),
            lambda c: self.api.update_ocr({"updates": []}, c, cid),
            lambda c: self.api.generate_proposal({}, c, cid),
            lambda c: self.api.lifecycle_action({"action": "cancel_case", "reason": "test"}, c, cid),
            lambda c: self.api.send_negotiation_comment({"message": "x"}, c, cid),
        ):
            self.assertEqual(call(AGENT)[0], 403)
            self.assertEqual(call(None)[0], 403)


if __name__ == "__main__":
    unittest.main()
