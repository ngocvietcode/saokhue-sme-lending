"""MCP stdio server `connect` for the independent `sme-connect` app.

Registered by Sao Khuê as `sme-connect:connect`; agents reference its tools as
`@sme-connect:connect/<tool>`. Storage is 100% isolated under `$SME_CONNECT_DATA`
(default `<app root>/data`).

Note: Human-only mutations (confirming OCR fields, confirming Proposal diffs,
submitting to LOS, accepting Resolutions, cancelling dossiers) live exclusively
on `backend/server.py` behind `owner_only(claim)`, never as MCP agent tools.
"""

from __future__ import annotations

import os
import sys
from pathlib import Path
from typing import Any

APP_ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(Path(__file__).resolve().parent))

from mcp.server.fastmcp import FastMCP  # noqa: E402

from smec.ports import query_vpbank_risk_and_cic  # noqa: E402
from smec.service import SmecService  # noqa: E402
from sme_core.store import _read_json  # noqa: E402

svc = SmecService(
    data_root=Path(os.environ.get("SME_CONNECT_DATA") or APP_ROOT / "data"),
    knowledge_root=Path(os.environ.get("SME_CONNECT_KNOWLEDGE") or APP_ROOT / "knowledge"),
    seed_if_empty=False,
)
mcp = FastMCP("connect")


def _safe(fn, *args: Any, **kwargs: Any) -> Any:
    try:
        return fn(*args, **kwargs)
    except (ValueError, KeyError, TimeoutError) as exc:
        return {"error": type(exc).__name__, "message": str(exc)}


@mcp.tool()
def sme_connect_list_cases() -> Any:
    """List all SME Connect dossiers with Dual IDs (HS-... & NCLOS-...), statuses and proposed products."""
    return _safe(svc.list_cases)


@mcp.tool()
def sme_connect_lookup_enterprise(dkkd_no: str, requested_amount: float = 10_000_000_000, has_collateral: bool = True) -> Any:
    """Lookup Core CIF, Badbranch flag and AI multi-product recommendations (% match score) for an enterprise MST/DKKD."""
    return _safe(svc.lookup_and_recommend, dkkd_no, requested_amount, has_collateral)


@mcp.tool()
def sme_connect_init_case(dkkd_no: str, requested_amount: float, has_collateral: bool = True,
                          proposed_products: list[dict] | None = None, flow: str = "A") -> Any:
    """Initialize a new SME Connect dossier in Draft/Processing state with proposed multi-product bundle."""
    payload = {
        "dkkd_no": dkkd_no,
        "requested_amount": requested_amount,
        "has_collateral": has_collateral,
        "proposed_products": proposed_products or [],
        "flow": flow,
    }
    return _safe(svc.init_case, payload, "agent:smec-copilot")


@mcp.tool()
def sme_case_get(case_id: str) -> Any:
    """Read full SME Connect case state: customer, proposed products, OCR summary, B4 PAVV, agent results and resolution."""
    return _safe(svc.get_full_case, case_id)


@mcp.tool()
def sme_case_put_result(case_id: str, agent: str, result: dict, rerun_reason: str = "") -> Any:
    """Store a verified version of a specialist/consolidation agent's result (rejects schema/evidence/calc mismatches)."""
    return _safe(svc.case_put_result, case_id, agent, result, rerun_reason)


@mcp.tool()
def sme_results_get(case_id: str, agent: str = "") -> Any:
    """Get latest result per agent (or one agent) along with its deterministic verification verdict."""
    return _safe(svc.results_get, case_id, agent)


@mcp.tool()
def sme_evidence_add(case_id: str, items: list[dict], agent: str) -> Any:
    """Register evidence items [{source, value, document_id, page, field}] and return their E### ids."""
    return _safe(svc.evidence_add, case_id, items, agent)


@mcp.tool()
def sme_evidence_get(case_id: str, ids: list[str] | None = None) -> Any:
    """Read evidence items by E### ids or the entire evidence map."""
    return _safe(svc.evidence_get, case_id, ids)


@mcp.tool()
def sme_review_add(case_id: str, reason_code: str, detail: str, agent: str,
                   evidence_refs: list[str] | None = None) -> Any:
    """Queue an issue for CBBH/CPC review (missing_document, data_conflict, rule_fail, low_confidence, exception_needed, expert_review, system_error)."""
    return _safe(svc.review_add, case_id, reason_code, detail, agent, evidence_refs)


@mcp.tool()
def sme_review_list(case_id: str, status: str = "") -> Any:
    """List review queue items for a case."""
    return _safe(svc.review_list, case_id, status)


@mcp.tool()
def sme_checklist_evaluate(case_id: str, as_of: str = "") -> Any:
    """Evaluate the two-layer SME Master Checklist (Groups A-I, 53 items) for the dossier."""
    return _safe(svc.checklist_evaluate, case_id, as_of)


@mcp.tool()
def sme_crosscheck_evaluate(case_id: str, as_of: str = "") -> Any:
    """Evaluate the 7 core cross-check rules (R1-R7) across DKKD, Charter, Contracts, VAT invoices, FS, Bank statements and Prosland valuation."""
    return _safe(svc.crosscheck_evaluate, case_id, as_of)


@mcp.tool()
def sme_policy_check(product_code: str, facts: dict, as_of: str) -> Any:
    """Evaluate credit policy rules for a product code against dossier facts."""
    return _safe(svc.policy_check, product_code, facts, as_of)


@mcp.tool()
def sme_fin_ratios(periods: list[dict]) -> Any:
    """Deterministically calculate financial ratios and YoY growth across financial statement periods."""
    return _safe(svc.fin_ratios, periods)


@mcp.tool()
def sme_repayment_capacity(cash_available_annual: float, existing_debt_service_annual: float,
                           loan_amount: float, annual_rate_pct: float, term_months: int,
                           method: str = "annuity", stress_pcts: list[float] | None = None) -> Any:
    """Deterministically calculate debt service and DSCR (base and stressed)."""
    return _safe(
        svc.repayment_capacity,
        cash_available_annual=cash_available_annual,
        existing_debt_service_annual=existing_debt_service_annual,
        loan_amount=loan_amount,
        annual_rate_pct=annual_rate_pct,
        term_months=term_months,
        method=method,
        stress_pcts=stress_pcts,
    )


@mcp.tool()
def sme_collateral_ltv(loan_amount: float, assets: list[dict], as_of: str) -> Any:
    """Deterministically check collateral valuation validity and LTV percentage."""
    return _safe(svc.collateral_ltv, loan_amount, assets, as_of)


@mcp.tool()
def sme_risk_cic_check(case_id: str) -> Any:
    """Query VPBank Badbranch (5 groups), Warning/Watch/Restructured/AMC/Restricted/Risk tax/EWS topdown, KSSV and multi-subject CIC."""
    def _run() -> dict[str, Any]:
        d = svc.store._dir(case_id)
        case = svc.store.get_case(case_id)
        entities = _read_json(d / "entities.json", {})
        return query_vpbank_risk_and_cic(case, entities)
    return _safe(_run)


@mcp.tool()
def sme_verify_result(case_id: str, agent: str) -> Any:
    """Deterministically verify an agent's latest result (schema, evidence refs, recomputed math, no credit decision)."""
    return _safe(svc.verify_result, case_id, agent)


@mcp.tool()
def sme_draft_customer_message(case_id: str, subject: str, body: str, item_keys: list[str] | None = None) -> Any:
    """Save a customer document-request draft message for CBBH to review and send."""
    return _safe(svc.store.add_draft, case_id, subject=subject, body=body, item_keys=item_keys or [], actor="agent:smec-copilot")


@mcp.tool()
def sme_workflow_source() -> Any:
    """Return the exact Python workflow source for `smec-credit-assessment` shipped with `sme-connect`."""
    path = APP_ROOT / "workflows" / "smec_credit_assessment.py"
    return {"name": "smec-credit-assessment", "source": path.read_text(encoding="utf-8")}


if __name__ == "__main__":
    mcp.run(transport="stdio")
