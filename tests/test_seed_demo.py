"""The demo dossier (tools/seed_demo.py) must keep walking every step cleanly."""

from __future__ import annotations

import sys
import tempfile
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "core"))
sys.path.insert(0, str(ROOT / "tools"))

import seed_demo  # noqa: E402
from sme_core.sales import SalesService  # noqa: E402
from sme_core.service import LendingService  # noqa: E402

TODAY = "2026-11-22"


class SeedDemoTest(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        base = Path(self.tmp.name)
        (base / "lending").mkdir()
        self.svc = SalesService(base / "sales", ROOT / "core" / "knowledge", lending_data_root=base / "lending")
        self.svc.store.clock = lambda: TODAY + "T08:00:00+00:00"
        self.lending_root = base / "lending"
        self.case_id = seed_demo.build(self.svc)

    def tearDown(self):
        self.tmp.cleanup()

    def test_sales_side_is_complete_with_every_crosscheck_run(self):
        ov = self.svc.overview(self.case_id, TODAY)
        self.assertTrue(ov["readiness"]["ready"], ov["readiness"])
        self.assertEqual(ov["checklist_overall"], "COMPLETE")
        self.assertEqual({r["id"]: r["status"] for r in ov["crosschecks"]["rules"]},
                         {f"R{i}": "PASS" for i in range(1, 8)})
        self.assertEqual([a["kind"] for a in ov["actions"]], ["submit"])
        self.assertTrue(all(p["status"] == "met" for p in ov["policy_checks"]))
        # Sample integration data stays out of the profile; every field shown has a label.
        paths = {f["path"]: f["label"] for f in ov["profile"]}
        self.assertFalse([p for p in paths if p.split(".", 1)[1].startswith("sample_")])
        self.assertEqual(paths["request.annual_rate_pct"], seed_demo.LABELS["request.annual_rate_pct"])

    def test_it_carries_a_sent_customer_letter_and_real_files(self):
        drafts = self.svc.store.list_drafts(self.case_id)
        self.assertEqual([d["status"] for d in drafts], ["sent"])
        case = self.svc.store.get_case(self.case_id)
        self.assertEqual(len(case["documents"]), len(seed_demo.DOCS))
        for d in case["documents"]:
            self.assertTrue(self.svc.store.document_path(self.case_id, d["id"]).read_bytes().startswith(b"%PDF-"), d)
            self.assertIn("sample_extract", d)

    def test_submit_hands_it_over_ready_for_assessment(self):
        out = seed_demo.submit(self.svc, self.case_id)
        self.assertEqual(out["stage"], "submitted")
        lending = LendingService(self.lending_root, ROOT / "core" / "knowledge")
        case = lending.case_get(self.case_id)
        self.assertEqual(case["sales_handover"]["checklist_overall"], "COMPLETE")
        bctc = next(d["id"] for d in case["documents"] if d["type"] == "bctc_2_ky")
        self.assertEqual(lending.ocr_extract(self.case_id, bctc)["status"], "sample")
        self.assertEqual(lending.cic_report(self.case_id, [])["data"]["debt_group"], 1)


if __name__ == "__main__":
    unittest.main()
