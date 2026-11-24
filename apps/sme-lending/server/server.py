"""MCP stdio server `lending` for the sme-lending app (dossier and assessment).

Registered by Sao Khue as `sme-lending:lending`; agents reference its tools as
`@sme-lending:lending/<tool>`. All logic lives in `sme_core`; this file only
declares the tool signatures the model sees.

Two stores, one per stage (see sme_core.paths): `sme_dossier_*` and the other
dossier tools work on the Sale's dossier; `sme_case_*`, results, evidence and
review work on the assessment copy the handover creates.

By design no tool can waive a requirement, mark a letter sent, remove a file,
submit a dossier or close a review item: those decisions go through the app
backend for the signed-in dashboard user only.
"""

from __future__ import annotations

import sys
from pathlib import Path
from typing import Any

APP_ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(Path(__file__).resolve().parent))

from mcp.server.fastmcp import FastMCP  # noqa: E402

from sme_core.paths import app_paths  # noqa: E402
from sme_core.sales import SalesService  # noqa: E402
from sme_core.service import LendingService  # noqa: E402

_paths = app_paths(APP_ROOT)
svc = LendingService(data_root=_paths.lending, knowledge_root=_paths.knowledge)
sales = SalesService(data_root=_paths.sales, knowledge_root=_paths.knowledge,
                     data_home=_paths.home, lending_data_root=_paths.lending)
mcp = FastMCP("lending")
ASSISTANT = "sme-assistant"


def _safe(fn, *args: Any, **kwargs: Any) -> Any:
    try:
        return fn(*args, **kwargs)
    except (ValueError, KeyError, TimeoutError) as exc:
        return {"error": type(exc).__name__, "message": str(exc)}


# -- the Sale's dossier ------------------------------------------------------

@mcp.tool()
def sme_dossier_find(query: str = "") -> Any:
    """Existing dossiers whose customer name, tax id or case id contains `query` (all when empty). Check this
    before creating a dossier, so one customer's documents do not split across two dossiers."""
    return _safe(sales.find_dossiers, query)


@mcp.tool()
def sme_dossier_create(customer: dict, request: dict, flow: str = "A") -> Any:
    """Create a dossier from what the Sale said in chat. customer and request are free-form single values with
    snake_case keys; the gap rules expect customer.name, customer.tax_id, customer.industry_code and
    request.product_code, amount, purpose (working_capital, fixed_asset, expansion, trade_finance),
    term_months. flow: "A" or "B". Returns the case with its case_id and the opening gap list."""
    def create() -> Any:
        case = sales.create_dossier(customer, request, flow, actor=f"agent:{ASSISTANT}")
        return sales.gap_analysis(case["case_id"])
    return _safe(create)


@mcp.tool()
def sme_dossier_get(case_id: str) -> Any:
    """Read a dossier: customer, request, facts, documents (id, name, type, issued_date, local_path,
    extract_missing)."""
    def get() -> Any:
        case = sales.store.get_case(case_id)
        out = {k: v for k, v in case.items() if k not in ("results", "review_open")}
        docs = []
        for d in out.get("documents") or []:
            item = dict(d)
            p = sales.store.document_path(case_id, d["id"])
            if p and p.is_file():
                item["local_path"] = str(p)
            item["extract_missing"] = sales.extract_next(case_id, d["id"])
            docs.append(item)
        out["documents"] = docs
        return out
    return _safe(get)


@mcp.tool()
def sme_dossier_gaps(case_id: str) -> Any:
    """Two-layer Master Checklist (A-I) and 7 cross-check preview: returns checklist_overall (COMPLETE/INCOMPLETE),
    checklist_counts (PASS/MISSING_REQUIRED/FAIL/SKIPPED/UNDETERMINED_CONDITION), crosscheck_overall,
    open_customer_items (to ask customer), open_rm_items (internal bank docs/approvals), and
    undetermined_items (missing condition inputs). Computed deterministically by rules."""
    return _safe(sales.gap_analysis, case_id)


@mcp.tool()
def sme_crosscheck_preview(case_id: str) -> Any:
    """Preview the 7 core cross-check rules (R1-R7) across currently uploaded documents and fields."""
    return _safe(sales.crosscheck_preview, case_id)


@mcp.tool()
def sme_dossier_update(case_id: str, customer: dict | None = None, request: dict | None = None,
                    facts: dict | None = None, labels: dict | None = None, flow: str = "") -> Any:
    """Set dossier fields the Sale told you or a document states. Keys are free-form snake_case, values single
    (text, number, bool, date); null removes a field. flow switches between "A" and "B".
    Master Checklist condition keys include: customer.legal_type (LLC_1/LLC_2/JSC/PRIVATE/PARTNERSHIP/COOP),
    customer.signer_is_legal_rep, customer.borrower_is_branch, customer.is_fdi, customer.is_construction,
    customer.is_conditional_industry; request.case_type (NEW/RENEWAL/AMEND_CONDITION), request.sub_purpose
    (mmtb/ptvt/xay_dung/mua_bds/du_an); facts.has_collateral, facts.collateral_types (csv: real_estate,vehicle),
    facts.has_fixed_assets, facts.has_other_bank_tx, facts.vat_filing_cycle (quarterly/monthly),
    facts.total_exposure, facts.has_deposit_paid, facts.is_imported, facts.vehicle_registered.
    Never invent a value."""
    patch: dict[str, Any] = {
        k: v for k, v in (("customer", customer), ("request", request), ("facts", facts), ("labels", labels)) if v
    }
    if flow:
        patch["flow"] = flow
    def update() -> Any:
        sales.store.update_case(case_id, patch, actor=f"agent:{ASSISTANT}")
        return sales.gap_analysis(case_id)
    return _safe(update)


@mcp.tool()
def sme_document_import(case_id: str, path: str, doc_type: str = "", issued_date: str = "",
                        summary: str = "", meta: dict | None = None) -> Any:
    """Import a file the Sale attached in chat (path after `[attached_file N]`). Read the file yourself first (open it and look at the content: no code, script or OCR), then pass
    doc_type (from sme_documents_catalog types), issued_date (YYYY-MM-DD), a one-line summary, and optional
    structured scalar `meta` for Layer 2 rules & cross-checks (e.g. VAT: tax_id, filing_cycle, periods_count,
    signature_valid, continuous_chain, reported_revenue; Contracts: customer_role='seller'|'buyer',
    contract_count, counterparty_tax_id, vat_invoice_matched; Bank statement: months_covered;
    Site photos: photo_count; Collateral/Prosland: owner_name, asset_code).
    Right after, handle all `extract_next` fields via sme_case_update or sme_document_classify(not_stated=...)."""
    return _safe(sales.import_document, case_id, path, doc_type=doc_type, issued_date=issued_date,
                 summary=summary, meta=meta, actor=f"agent:{ASSISTANT}")


@mcp.tool()
def sme_document_classify(case_id: str, document_id: str, doc_type: str = "", issued_date: str = "",
                          summary: str = "", not_stated: list[str] | None = None,
                          meta: dict | None = None) -> Any:
    """Update an existing document's type, issued_date (YYYY-MM-DD), summary, not_stated paths, or structured
    scalar `meta` (for VAT period counts/signature, contract roles/MST, bank statement months, photo_count, etc.).
    Returns the updated document and remaining extract_next."""
    return _safe(sales.classify_document, case_id, document_id, doc_type=doc_type, issued_date=issued_date,
                 summary=summary, not_stated=not_stated, meta=meta, actor=f"agent:{ASSISTANT}")


@mcp.tool()
def sme_documents_catalog() -> Any:
    """Document types with label, group, validity in months, the customer-facing ask and approved substitutes."""
    return _safe(sales.documents_catalog)


@mcp.tool()
def sme_draft_save(case_id: str, channel: str, subject: str, body: str, requirement_keys: list[str]) -> Any:
    """Save a draft request to the customer for the Sale to review and send. channel: email, zalo or
    phone_script. requirement_keys: the open item keys it asks for. Refused if it promises an outcome."""
    return _safe(sales.draft_save, case_id, channel, subject, body, requirement_keys, agent=ASSISTANT)


@mcp.tool()
def sme_drafts_list(case_id: str) -> Any:
    """Drafts saved for this dossier, with status draft or sent."""
    return _safe(sales.store.list_drafts, case_id)



# -- the assessment ---------------------------------------------------------

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
def sme_checklist_evaluate(case_id: str, as_of: str = "", detail: str = "brief") -> Any:
    """Evaluate the unified two-layer SME Master Checklist (Groups A-I, 53 items) for a case: returns
    overall_status (COMPLETE/INCOMPLETE), counts (PASS/MISSING_REQUIRED/FAIL/SKIPPED/UNDETERMINED_CONDITION),
    group statuses. detail="brief" (default, about 5 KB) lists only the items that are not PASS/SKIPPED;
    detail="full" adds every item's condition -> rule -> status breakdown (about 45 KB, ask for it only
    when you must quote one item)."""
    return _safe(svc.checklist_evaluate if detail == "full" else svc.checklist_brief, case_id, as_of)


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
def sme_progress(case_id: str, agent: str, step: str, detail: str = "", state: str = "running") -> Any:
    """Tell the officer what you are doing right now. Call it at each main step, in one short Vietnamese
    sentence (for example "Đang đối chiếu 7 rule R1-R7"), at most about 8 times per run. state: running,
    done, failed. Self-reported progress only: never put a credit decision or a customer secret in it."""
    return _safe(svc.progress_add, case_id, agent, step, detail, state)


@mcp.tool()
def sme_document_pack(case_id: str, as_of: str = "") -> Any:
    """One call for the whole document stage: OCR extraction of every file of the case, the Master Checklist
    evaluation and the R1-R7 cross-checks. Use it instead of calling sme_ocr_extract file by file."""
    return _safe(svc.document_pack, case_id, as_of)


@mcp.tool()
def sme_workflow_source() -> Any:
    """The exact source of the sme-credit-assessment workflow shipped with this app. Pass it unchanged
    as `source` to workflow_run when the library has no saved `sme-credit-assessment`."""
    path = APP_ROOT / "workflows" / "sme_credit_assessment.py"
    return {"name": "sme-credit-assessment", "source": path.read_text(encoding="utf-8")}


if __name__ == "__main__":
    mcp.run()
