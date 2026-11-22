"""The tool surface, independent of MCP: one method per `sme_*` tool.

`server.py` only adapts these methods to MCP. Tests drive this class directly.
"""

from __future__ import annotations

from pathlib import Path
from typing import Any

from . import integrations
from .collateral import collateral_ltv
from .finance import fin_ratios, repayment_capacity
from .knowledge import Knowledge
from .store import CaseStore
from .verify import recompute, validate_result


class LendingService:
    def __init__(self, data_root: Path, knowledge_root: Path):
        self.store = CaseStore(data_root)
        self.kb = Knowledge(knowledge_root)

    # -- calculators shared by the tools and by verification ---------------
    def _calculators(self) -> dict[str, Any]:
        return {
            "fin_ratios": lambda i: fin_ratios(i["periods"]),
            "repayment_capacity": lambda i: repayment_capacity(**i),
            "collateral_ltv": lambda i: collateral_ltv(i["loan_amount"], i["assets"], i["as_of"],
                                                       self.kb.collateral_rules()),
            "policy_check": lambda i: self.kb.policy_check(i["product_code"], i["facts"], i["as_of"]),
        }

    # -- case --------------------------------------------------------------
    def case_create(self, customer: dict, request: dict, documents: list, flow: str = "A") -> dict:
        return self.store.create_case(customer, request, documents, flow)

    def case_get(self, case_id: str) -> dict:
        return self.store.get_case(case_id)

    def case_put_result(self, case_id: str, agent: str, result: dict, rerun_reason: str = "") -> dict:
        """Store a result only if it passes the full deterministic verification.

        Recomputing here, at submit time, lets the agent fix a rejected result
        in the same turn, so the workflow needs no separate verifier turn per
        agent. The stored verdict is the one `verify_result` would write.
        """
        errors = recompute(result, self._calculators()) if isinstance(result, dict) else []
        if errors:
            return {"accepted": False, "errors": errors}
        stored = self.store.put_result(case_id, agent, result, rerun_reason)
        if stored.get("accepted"):
            self.store.set_verification(case_id, agent, {"agent": agent, "passed": True, "errors": [],
                                                         "checked_by": "deterministic"})
        return stored

    def results_get(self, case_id: str, agent: str = "") -> dict:
        return self.store.get_results(case_id, agent or None)

    # -- evidence and review -----------------------------------------------
    def evidence_add(self, case_id: str, items: list, agent: str) -> dict:
        return {"ids": self.store.add_evidence(case_id, items, agent)}

    def evidence_get(self, case_id: str, ids: list | None = None) -> dict:
        return self.store.get_evidence(case_id, ids)

    def review_add(self, case_id: str, reason_code: str, detail: str, agent: str,
                   evidence_refs: list | None = None) -> dict:
        return self.store.add_review(case_id, reason_code, detail, agent, evidence_refs)

    def review_list(self, case_id: str, status: str = "") -> list:
        return self.store.list_review(case_id, status or None)

    # -- knowledge and deterministic calculations --------------------------
    def knowledge_products(self) -> dict:
        return self.kb.products()

    def knowledge_checklist(self, product_code: str, flow: str) -> dict:
        return self.kb.checklist(product_code, flow)

    def policy_check(self, product_code: str, facts: dict, as_of: str) -> dict:
        return self._calculators()["policy_check"]({"product_code": product_code, "facts": facts, "as_of": as_of})

    def fin_ratios(self, periods: list) -> dict:
        return fin_ratios(periods)

    def repayment_capacity(self, **kwargs: Any) -> dict:
        return repayment_capacity(**kwargs)

    def collateral_ltv(self, loan_amount: float, assets: list, as_of: str) -> dict:
        return collateral_ltv(loan_amount, assets, as_of, self.kb.collateral_rules())

    # -- verification ------------------------------------------------------
    def verify_result(self, case_id: str, agent: str) -> dict:
        """Re-validate the latest result and recompute its calculations.

        The verdict is stored beside the result, so consolidation and the
        workflow read the same status this returns.
        """
        results = self.store.get_results(case_id, agent)
        if agent not in results:
            return {"agent": agent, "passed": False, "errors": ["no result stored for this agent"]}
        payload = {k: v for k, v in results[agent].items() if not k.startswith("_") and k != "verification"}
        known = set(self.store.get_evidence(case_id))
        errors = validate_result(payload, agent=agent, case_id=case_id, known_evidence=known)
        errors += recompute(payload, self._calculators())
        verdict = {"agent": agent, "passed": not errors, "errors": errors}
        verdict["version"] = self.store.set_verification(case_id, agent, verdict)
        return verdict

    # -- existing bank services --------------------------------------------
    def ocr_extract(self, case_id: str, document_id: str) -> dict:
        return integrations.ocr_extract(self.store.get_case(case_id), document_id)

    def nclos_exposure(self, case_id: str, customer_ids: list) -> dict:
        return integrations.nclos_exposure(self.store.get_case(case_id), customer_ids)

    def cic_report(self, case_id: str, customer_ids: list) -> dict:
        return integrations.cic_report(self.store.get_case(case_id), customer_ids)
