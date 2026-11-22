"""Self-reported progress, the one-call document pack and the compact checklist."""

from __future__ import annotations

import sys
import tempfile
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "core"))

from sme_core.service import LendingService  # noqa: E402

DOCS = [{"id": "D1", "name": "dkkd.pdf", "type": "dkkd", "path": ""}]


class ProgressTest(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.svc = LendingService(Path(self.tmp.name), ROOT / "core" / "knowledge")
        case = self.svc.case_create({"cif": "C1", "tax_id": "0100000001", "name": "Demo", "industry_code": "4669"},
                                    {"amount": 5e9, "purpose": "working_capital", "term_months": 12,
                                     "product_code": "SME-WC"}, DOCS, "A")
        self.cid = case["case_id"]

    def tearDown(self):
        self.tmp.cleanup()

    def test_steps_are_listed_in_order_with_their_state(self):
        self.svc.progress_add(self.cid, "document-evidence", "Đang đọc chứng từ")
        self.svc.progress_add(self.cid, "document-evidence", "Đang lập bằng chứng", "13 mục")
        rows = self.svc.progress_list(self.cid)["rows"]
        self.assertEqual([r["step"] for r in rows], ["Đang đọc chứng từ", "Đang lập bằng chứng"])
        self.assertEqual(rows[1]["detail"], "13 mục")
        self.assertEqual({r["state"] for r in rows}, {"running"})

    def test_bad_state_and_long_text_are_handled(self):
        with self.assertRaises(ValueError):
            self.svc.progress_add(self.cid, "a", "s", state="paused")
        row = self.svc.progress_add(self.cid, "a", "x" * 500, "y" * 900)
        self.assertEqual((len(row["step"]), len(row["detail"])), (160, 400))

    def test_an_accepted_result_marks_the_agent_done(self):
        out = self.svc.case_put_result(self.cid, "product-match", {
            "agent": "product-match", "case_id": self.cid, "summary": "ok", "findings": [],
            "confidence": "medium", "stored_version": 1})
        self.assertTrue(out["accepted"], out)
        last = self.svc.progress_list(self.cid)["rows"][-1]
        self.assertEqual((last["agent"], last["state"]), ("product-match", "done"))

    def test_document_pack_reads_every_file_in_one_call(self):
        pack = self.svc.document_pack(self.cid)
        self.assertEqual([d["id"] for d in pack["documents"]], ["D1"])
        self.assertIn("ocr", pack["documents"][0])
        self.assertIn("attention_items", pack["checklist"])
        self.assertNotIn("items", pack["checklist"])
        self.assertIn("rules", pack["crosschecks"])

    def test_brief_checklist_is_much_smaller_than_the_full_one(self):
        import json
        brief = json.dumps(self.svc.checklist_brief(self.cid))
        full = json.dumps(self.svc.checklist_evaluate(self.cid))
        self.assertLess(len(brief), len(full) / 3)
        self.assertEqual(self.svc.checklist_brief(self.cid)["overall_status"],
                         self.svc.checklist_evaluate(self.cid)["overall_status"])


if __name__ == "__main__":
    unittest.main()
