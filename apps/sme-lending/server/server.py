"""MCP stdio server `lending` for the sme-lending app.

Registered by Sao Khue as `sme-lending:lending`; agents reference its tools as
`@sme-lending:lending/<tool>`. All logic lives in `sme_core`; this file only
declares the tool signatures the model sees.

Data directory: $SME_LENDING_DATA, else `<app root>/data`.
"""

from __future__ import annotations

import os
import sys
from pathlib import Path
from typing import Any

APP_ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(Path(__file__).resolve().parent))

from mcp.server.fastmcp import FastMCP  # noqa: E402

from sme_core.service import LendingService  # noqa: E402

svc = LendingService(
    data_root=Path(os.environ.get("SME_LENDING_DATA") or APP_ROOT / "data"),
    knowledge_root=Path(os.environ.get("SME_LENDING_KNOWLEDGE") or APP_ROOT / "knowledge"),
)
mcp = FastMCP("lending")


def _safe(fn, *args: Any, **kwargs: Any) -> Any:
    try:
        return fn(*args, **kwargs)
    except (ValueError, KeyError, TimeoutError) as exc:
        return {"error": type(exc).__name__, "message": str(exc)}


@mcp.tool()
def sme_case_create(customer: dict, request: dict, documents: list[dict], flow: str = "A") -> Any:
    """Create a case. customer: {cif, tax_id, name, industry_code}; request: {amount, purpose, term_months,
    proposal}; documents: [{id, name, type, path}]; flow: "A" or "B". Returns the case with its case_id."""
    return _safe(svc.case_create, customer, request, documents, flow)


@mcp.tool()
def sme_case_get(case_id: str) -> Any:
    """Read a case: customer, request, documents, latest result version and verification per agent."""
    return _safe(svc.case_get, case_id)


@mcp.tool()
def sme_case_put_result(case_id: str, agent: str, result: dict, rerun_reason: str = "") -> Any:
    """Store a new version of an agent's result. Rejected (accepted=false, errors) when the result breaks
    the shared schema, cites an unknown evidence id or states a credit decision."""
    return _safe(svc.case_put_result, case_id, agent, result, rerun_reason)


@mcp.tool()
def sme_results_get(case_id: str, agent: str = "") -> Any:
    """Latest result per agent (or one agent), each with its verification verdict."""
    return _safe(svc.results_get, case_id, agent)


@mcp.tool()
def sme_evidence_add(case_id: str, items: list[dict], agent: str) -> Any:
    """Register evidence items [{source, value, document_id, page, field, date}]; returns their E### ids."""
    return _safe(svc.evidence_add, case_id, items, agent)


@mcp.tool()
def sme_evidence_get(case_id: str, ids: list[str] | None = None) -> Any:
    """Evidence items by id, or the whole evidence map when ids is empty."""
    return _safe(svc.evidence_get, case_id, ids)


@mcp.tool()
def sme_review_add(case_id: str, reason_code: str, detail: str, agent: str,
                   evidence_refs: list[str] | None = None) -> Any:
    """Queue an item for officer review. reason_code: missing_document, data_conflict, rule_fail,
    low_confidence, exception_needed, expert_review, system_error."""
    return _safe(svc.review_add, case_id, reason_code, detail, agent, evidence_refs)


@mcp.tool()
def sme_review_list(case_id: str, status: str = "") -> Any:
    """The case's officer review queue, optionally filtered by status (open, resolved)."""
    return _safe(svc.review_list, case_id, status)


@mcp.tool()
def sme_knowledge_products() -> Any:
    """The product catalogue (code, purposes, max term, collateral requirement) with its version."""
    return _safe(svc.knowledge_products)


@mcp.tool()
def sme_knowledge_checklist(product_code: str, flow: str) -> Any:
    """Legacy required documents map for a product and flow."""
    return _safe(svc.knowledge_checklist, product_code, flow)


@mcp.tool()
def sme_checklist_evaluate(case_id: str, as_of: str = "") -> Any:
    """Evaluate the unified two-layer SME Master Checklist (Groups A-I, 53 items) for a case: returns
    overall_status (COMPLETE/INCOMPLETE), counts (PASS/MISSING_REQUIRED/FAIL/SKIPPED/UNDETERMINED_CONDITION),
    group statuses and per-item condition -> rule -> status breakdown."""
    return _safe(svc.checklist_evaluate, case_id, as_of)


@mcp.tool()
def sme_crosscheck_evaluate(case_id: str, as_of: str = "") -> Any:
    """Evaluate the 7 core cross-check rules (R1: DKKD anchor, R2: ownership/authority, R3: contract
    buyer/seller roles, R4: contract-VAT invoice MST mapping, R5: FS/VAT periods & signature,
    R6: bank statement vs KHLQ/AR/AP, R7: collateral vs Prosland valuation)."""
    return _safe(svc.crosscheck_evaluate, case_id, as_of)


@mcp.tool()
def sme_policy_check(product_code: str, facts: dict, as_of: str) -> Any:
    """Evaluate the policy in force on as_of (YYYY-MM-DD) against facts such as years_in_operation,
    loan_amount, term_months, dscr, ltv_pct, cic_debt_group. Returns a met/not_met/missing/na matrix."""
    return _safe(svc.policy_check, product_code, facts, as_of)


@mcp.tool()
def sme_fin_ratios(periods: list[dict]) -> Any:
    """Financial ratios per period (oldest first) and growth. Period fields: period, revenue, cogs,
    gross_profit, ebitda, ebit, net_income, interest_expense, total_assets, total_liabilities, equity,
    current_assets, current_liabilities, receivables, inventory, short_term_debt, long_term_debt."""
    return _safe(svc.fin_ratios, periods)


@mcp.tool()
def sme_repayment_capacity(cash_available_annual: float, existing_debt_service_annual: float,
                           loan_amount: float, annual_rate_pct: float, term_months: int,
                           method: str = "annuity", stress_pcts: list[float] | None = None) -> Any:
    """First-year debt service of the new loan and DSCR, base and stressed. method: annuity,
    equal_principal or bullet."""
    return _safe(svc.repayment_capacity, cash_available_annual=cash_available_annual,
                 existing_debt_service_annual=existing_debt_service_annual, loan_amount=loan_amount,
                 annual_rate_pct=annual_rate_pct, term_months=term_months, method=method,
                 stress_pcts=stress_pcts)


@mcp.tool()
def sme_collateral_ltv(loan_amount: float, assets: list[dict], as_of: str) -> Any:
    """Valuation validity and LTV. assets: [{id, type, value, valuation_date, encumbered}]."""
    return _safe(svc.collateral_ltv, loan_amount, assets, as_of)


@mcp.tool()
def sme_verify_result(case_id: str, agent: str) -> Any:
    """Deterministically verify an agent's latest result (schema, evidence ids, recomputed calculations,
    no credit decision) and store the verdict."""
    return _safe(svc.verify_result, case_id, agent)


@mcp.tool()
def sme_ocr_extract(case_id: str, document_id: str) -> Any:
    """OCR EDA extraction for one document of the case."""
    return _safe(svc.ocr_extract, case_id, document_id)


@mcp.tool()
def sme_nclos_exposure(case_id: str, customer_ids: list[str]) -> Any:
    """Outstanding exposure and limits from NCLOS."""
    return _safe(svc.nclos_exposure, case_id, customer_ids)


@mcp.tool()
def sme_cic_report(case_id: str, customer_ids: list[str]) -> Any:
    """CIC credit report for the customer and related parties."""
    return _safe(svc.cic_report, case_id, customer_ids)


@mcp.tool()
def sme_workflow_source() -> Any:
    """The exact source of the sme-credit-assessment workflow shipped with this app. Pass it unchanged
    as `source` to workflow_run when the library has no saved `sme-credit-assessment`."""
    path = APP_ROOT / "workflows" / "sme_credit_assessment.py"
    return {"name": "sme-credit-assessment", "source": path.read_text(encoding="utf-8")}


if __name__ == "__main__":
    mcp.run()
