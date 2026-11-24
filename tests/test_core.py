"""Tests for the deterministic core. Run: python -m unittest discover -s tests"""

from __future__ import annotations

import ast
import json
import re
import sys
import tempfile
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
CORE = ROOT / "core"
UW = ROOT / "apps" / "sme-lending"
sys.path.insert(0, str(CORE))

from sme_core.collateral import collateral_ltv  # noqa: E402
from sme_core.finance import fin_ratios, repayment_capacity  # noqa: E402
from sme_core.service import LendingService  # noqa: E402
from sme_core.store import CaseStore  # noqa: E402
from sme_core.verify import recompute  # noqa: E402

FIXED_NOW = "2026-11-21T08:00:00+00:00"


def _service(tmp: str) -> LendingService:
    svc = LendingService(Path(tmp), CORE / "knowledge")
    svc.store.clock = lambda: FIXED_NOW
    return svc


def _case(svc: LendingService) -> str:
    return svc.case_create({"tax_id": "0101234567", "name": "Cong ty A"},
                           {"amount": 5e9, "purpose": "working_capital", "term_months": 12},
                           [{"id": "D1", "name": "bctc.pdf", "type": "bctc"}], "A")["case_id"]


def _result(agent: str, case_id: str, refs: list[str], **extra) -> dict:
    base = {"agent": agent, "case_id": case_id, "summary": "Tóm tắt.",
            "findings": [{"id": "F1", "topic": "t", "statement": "Doanh thu tăng.",
                          "severity": "info", "evidence_refs": refs}],
            "missing_information": [], "open_issues": [], "calculations": [], "confidence": "medium"}
    base.update(extra)
    return base


class FinanceTest(unittest.TestCase):
    def test_ratios_and_growth(self):
        out = fin_ratios([
            {"period": "2024", "revenue": 100, "cogs": 60, "net_income": 10, "equity": 50},
            {"period": "2025", "revenue": 120, "cogs": 70, "net_income": 15, "equity": 60},
        ])
        self.assertEqual(out["periods"][0]["ratios"]["gross_margin"], 0.4)
        self.assertEqual(out["periods"][1]["ratios"]["roe"], 0.25)
        self.assertEqual(out["growth"][0]["revenue_growth"], 0.2)
        self.assertIn("current_ratio", out["periods"][0]["missing"])

    def test_zero_denominator_is_none_not_error(self):
        out = fin_ratios([{"period": "2025", "revenue": 0, "net_income": 5}])
        self.assertIsNone(out["periods"][0]["ratios"]["net_margin"])

    def test_dscr_with_stress(self):
        out = repayment_capacity(1_200, 0, 1_200, 0, 12, "equal_principal", [50])
        self.assertEqual(out["total_debt_service_annual"], 1200.0)
        self.assertEqual(out["scenarios"][0]["dscr"], 1.0)
        self.assertEqual(out["scenarios"][1]["dscr"], 0.5)

    def test_bad_method_refused(self):
        with self.assertRaises(ValueError):
            repayment_capacity(1, 0, 1, 10, 12, "magic")


class CollateralTest(unittest.TestCase):
    RULES = {"valuation_validity_months": {"real_estate": 12}, "max_ltv_pct": {"real_estate": 70}}

    def test_expired_valuation_excluded_and_flagged(self):
        out = collateral_ltv(700, [
            {"id": "A1", "type": "real_estate", "value": 1000, "valuation_date": "2026-06-01"},
            {"id": "A2", "type": "real_estate", "value": 5000, "valuation_date": "2024-01-01"},
        ], "2026-11-21", self.RULES)
        self.assertEqual(out["eligible_value"], 1000)
        self.assertEqual(out["ltv_pct"], 70.0)
        self.assertIn("valuation_expired", [f["flag"] for f in out["flags"]])
        self.assertNotIn("ltv_above_cap", [f["flag"] for f in out["flags"]])

    def test_ltv_above_cap(self):
        out = collateral_ltv(800, [{"id": "A1", "type": "real_estate", "value": 1000,
                                    "valuation_date": "2026-06-01"}], "2026-11-21", self.RULES)
        self.assertIn("ltv_above_cap", [f["flag"] for f in out["flags"]])


class PolicyTest(unittest.TestCase):
    def test_matrix_statuses(self):
        with tempfile.TemporaryDirectory() as tmp:
            out = _service(tmp).policy_check(
                "SME-WC", {"years_in_operation": 1, "loan_amount": 5e9, "dscr": None}, "2026-11-21")
        status = {r["id"]: r["status"] for r in out["matrix"]}
        self.assertEqual(status["C1"], "not_met")
        self.assertEqual(status["C2"], "met")
        self.assertEqual(status["C3"], "missing")
        self.assertEqual(status["C4"], "na")
        self.assertEqual(out["policy_version"], "sample-0.1")

    def test_no_policy_in_force(self):
        with tempfile.TemporaryDirectory() as tmp:
            out = _service(tmp).policy_check("SME-WC", {}, "2025-01-01")
        self.assertEqual(out["error"], "no_policy_in_force")


class StoreAndVerifyTest(unittest.TestCase):
    def test_result_without_known_evidence_is_rejected(self):
        with tempfile.TemporaryDirectory() as tmp:
            svc = _service(tmp)
            cid = _case(svc)
            res = svc.case_put_result(cid, "financial-analysis", _result("financial-analysis", cid, ["E009"]))
        self.assertFalse(res["accepted"])
        self.assertTrue(any("unknown ids" in e for e in res["errors"]))

    def test_credit_decision_wording_is_rejected(self):
        with tempfile.TemporaryDirectory() as tmp:
            svc = _service(tmp)
            cid = _case(svc)
            eid = svc.evidence_add(cid, [{"source": "D1 p1", "value": 1}], "document-evidence")["ids"][0]
            res = svc.case_put_result(cid, "consolidation",
                                      _result("consolidation", cid, [eid], summary="Đề xuất phê duyệt khoản vay."))
        self.assertFalse(res["accepted"])

    def test_sections_that_rest_on_a_number_must_carry_its_calculation(self):
        with tempfile.TemporaryDirectory() as tmp:
            svc = _service(tmp)
            cid = _case(svc)
            eid = svc.evidence_add(cid, [{"source": "D1 p1", "value": 1}], "document-evidence")["ids"][0]
            for agent, kind in (("financial-analysis", "repayment_capacity"), ("collateral", "collateral_ltv"),
                                ("policy-exception", "policy_check")):
                res = svc.case_put_result(cid, agent, _result(agent, cid, [eid]))
                self.assertFalse(res["accepted"], agent)
                self.assertTrue(any(kind in e for e in res["errors"]), res["errors"])
            # Sections without a number behind them are unaffected.
            self.assertTrue(svc.case_put_result(cid, "consolidation", _result("consolidation", cid, [eid]))["accepted"])

    def test_a_malformed_calculations_field_is_refused_with_a_hint_not_a_crash(self):
        with tempfile.TemporaryDirectory() as tmp:
            svc = _service(tmp)
            cid = _case(svc)
            eid = svc.evidence_add(cid, [{"source": "D1 p1", "value": 1}], "document-evidence")["ids"][0]
            for bad in ({"repayment_capacity": {"dscr": 1.6}}, ["repayment_capacity"], "x"):
                res = svc.case_put_result(cid, "consolidation", _result("consolidation", cid, [eid], calculations=bad))
                self.assertFalse(res["accepted"], bad)
                self.assertTrue(res["errors"], bad)
            self.assertEqual(svc.case_get(cid)["results"].get("consolidation"), None)

    def test_verify_catches_a_wrong_number(self):
        with tempfile.TemporaryDirectory() as tmp:
            svc = _service(tmp)
            cid = _case(svc)
            eid = svc.evidence_add(cid, [{"source": "D1 p1", "value": 100}], "document-evidence")["ids"][0]
            inputs = {"periods": [{"period": "2025", "revenue": 100, "net_income": 10}]}
            outputs = fin_ratios(inputs["periods"])
            rc_in = {"cash_available_annual": 30.0, "existing_debt_service_annual": 5.0, "loan_amount": 100.0,
                     "annual_rate_pct": 9.0, "term_months": 12}
            rc = {"kind": "repayment_capacity", "inputs": rc_in, "outputs": repayment_capacity(**rc_in)}
            good = _result("financial-analysis", cid, [eid],
                           calculations=[{"kind": "fin_ratios", "inputs": inputs, "outputs": outputs}, rc])
            self.assertTrue(svc.case_put_result(cid, "financial-analysis", good)["accepted"])
            self.assertTrue(svc.verify_result(cid, "financial-analysis")["passed"])

            bad_outputs = json.loads(json.dumps(outputs))
            bad_outputs["periods"][0]["ratios"]["net_margin"] = 0.5
            bad = _result("financial-analysis", cid, [eid],
                          calculations=[{"kind": "fin_ratios", "inputs": inputs, "outputs": bad_outputs}, rc])
            # A wrong number is refused at submit time, so the agent fixes it in the same turn.
            rejected = svc.case_put_result(cid, "financial-analysis", bad)
            self.assertFalse(rejected["accepted"])
            self.assertTrue(any("net_margin" in e for e in rejected["errors"]))
            latest = svc.case_get(cid)["results"]["financial-analysis"]
            self.assertEqual(latest["version"], 1)
            self.assertTrue(latest["verification"]["passed"])

    def test_review_queue_and_audit(self):
        with tempfile.TemporaryDirectory() as tmp:
            svc = _service(tmp)
            cid = _case(svc)
            svc.review_add(cid, "missing_document", "Thiếu tờ khai VAT", "document-evidence")
            with self.assertRaises(ValueError):
                svc.review_add(cid, "whatever", "x", "document-evidence")
            self.assertEqual(svc.case_get(cid)["review_open"], 1)
            audit = (Path(tmp) / "cases" / cid / "audit.jsonl").read_text(encoding="utf-8").splitlines()
        self.assertEqual([json.loads(line)["action"] for line in audit], ["case_create", "review_add"])

    def test_sample_mode_is_explicit_and_real_mode_refuses(self):
        fixture = json.loads((ROOT / "tests" / "fixtures" / "sample_case.json").read_text(encoding="utf-8"))
        with tempfile.TemporaryDirectory() as tmp:
            svc = _service(tmp)
            cid = svc.case_create(fixture["customer"], fixture["request"], fixture["documents"],
                                  fixture["flow"])["case_id"]
            self.assertEqual(svc.ocr_extract(cid, "D2")["status"], "sample")
            self.assertEqual(svc.cic_report(cid, ["DEMO0001"])["data"]["debt_group"], 1)
            self.assertEqual(svc.ocr_extract(cid, "D9")["status"], "error")
            plain = _case(svc)
            self.assertEqual(svc.ocr_extract(plain, "D1")["status"], "not_configured")
            self.assertEqual(svc.nclos_exposure(plain, [])["status"], "not_configured")

    def test_case_id_is_validated(self):
        with tempfile.TemporaryDirectory() as tmp:
            with self.assertRaises(ValueError):
                CaseStore(Path(tmp)).get_case("../../etc")


class RecomputeTest(unittest.TestCase):
    """An agent may quote part of a tool output, but never invent or drop rows."""

    def _errors(self, outputs):
        with tempfile.TemporaryDirectory() as tmp:
            svc = _service(tmp)
            inputs = {"product_code": "SME-WC", "facts": {"years_in_operation": 1, "loan_amount": 5e9},
                      "as_of": "2026-11-21"}
            full = svc.policy_check(**inputs)
            payload = {"calculations": [{"kind": "policy_check", "inputs": inputs, "outputs": outputs(full)}]}
            return recompute(payload, svc._calculators())

    def test_quoting_part_of_the_output_passes(self):
        self.assertEqual(self._errors(lambda full: {
            "policy_version": full["policy_version"], "not_met": full["not_met"],
            "matrix": [{"id": r["id"], "status": r["status"]} for r in full["matrix"]]}), [])

    def test_a_changed_status_fails(self):
        def tamper(full):
            rows = [{"id": r["id"], "status": r["status"]} for r in full["matrix"]]
            rows[0]["status"] = "met"
            return {"matrix": rows}
        self.assertTrue(any("matrix[0].status" in e for e in self._errors(tamper)))

    def test_a_dropped_row_fails(self):
        errs = self._errors(lambda full: {"matrix": [{"id": r["id"]} for r in full["matrix"][1:]]})
        self.assertTrue(any("length" in e for e in errs))

    def test_an_invented_key_or_empty_output_fails(self):
        self.assertTrue(any("not produced" in e for e in self._errors(lambda full: {"approved": True})))
        self.assertTrue(any("no outputs" in e for e in self._errors(lambda full: {})))


class PackagingTest(unittest.TestCase):
    """The manifest, agents, skills and MCP server must agree with each other."""

    def _server_tools(self) -> set[str]:
        tree = ast.parse((UW / "server" / "server.py").read_text(encoding="utf-8"))
        return {n.name for n in tree.body if isinstance(n, ast.FunctionDef) and n.name.startswith("sme_")}

    def test_every_agent_tool_and_skill_exists(self):
        manifest = json.loads((UW / "app.json").read_text(encoding="utf-8"))
        tools = self._server_tools()
        skills = {Path(s).name for s in manifest["skills"]}
        for rel in manifest["agents"]:
            spec = json.loads((UW / rel).read_text(encoding="utf-8"))
            self.assertEqual(spec["model"], "auto", rel)
            for ref in spec["tools"]:
                if ref.startswith("@sme-lending:lending/"):
                    self.assertIn(ref.split("/", 1)[1], tools, rel)
            for res in spec.get("resources", []):
                self.assertIn(res.split("/")[-2], skills, rel)
        for s in manifest["skills"]:
            text = (UW / s / "SKILL.md").read_text(encoding="utf-8")
            desc = next(line for line in text.splitlines() if line.startswith("description: "))
            # An unquoted value holding ": " is a YAML error, so the skill would not load.
            self.assertTrue(desc[13:].startswith('"'), s)
            json.loads(desc[13:])

        for rel in manifest["agents"]:
            spec = json.loads((UW / rel).read_text(encoding="utf-8"))
            for res in spec.get("resources", []):
                # `~/` expands against the home dir, not a relocated data home.
                self.assertTrue(res.startswith("skill://{APP_ROOT}/skills/"), rel)

    def test_workflow_names_only_declared_agents(self):
        manifest = json.loads((UW / "app.json").read_text(encoding="utf-8"))
        declared = {Path(a).stem for a in manifest["agents"]}
        src = (UW / "workflows" / "sme_credit_assessment.py").read_text(encoding="utf-8")
        self.assertTrue(src.isascii())
        named = set(re.findall(r'await run\("([a-z-]+)"', src))
        self.assertEqual(named, {"document-product", "credit-analysis", "consolidation"})
        self.assertTrue(named <= declared, named - declared)


if __name__ == "__main__":
    unittest.main()
