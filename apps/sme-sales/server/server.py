"""MCP stdio server `sales` for the sme-sales app.

Registered by Sao Khue as `sme-sales:sales`; agents reference its tools as
`@sme-sales:sales/<tool>`. All logic lives in `sme_core` (a generated copy of
core/sme_core; see tools/sync_core.py).

By design, agent tools cannot waive requirements, mark drafts sent, remove
files, submit, or unlock a submitted dossier: those decisions go through the
app backend for the signed-in dashboard user only.

Data directory: $SME_SALES_DATA, else `<app root>/data`.
"""

from __future__ import annotations

import os
import sys
from pathlib import Path
from typing import Any

APP_ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(Path(__file__).resolve().parent))

from mcp.server.fastmcp import FastMCP  # noqa: E402

from sme_core.sales import SalesService  # noqa: E402

svc = SalesService(
    data_root=Path(os.environ.get("SME_SALES_DATA") or APP_ROOT / "data"),
    knowledge_root=Path(os.environ.get("SME_SALES_KNOWLEDGE") or APP_ROOT / "knowledge"),
)
mcp = FastMCP("sales")
AGENT = "dossier-coach"


def _safe(fn, *args: Any, **kwargs: Any) -> Any:
    try:
        return fn(*args, **kwargs)
    except (ValueError, KeyError, TimeoutError) as exc:
        return {"error": type(exc).__name__, "message": str(exc)}


@mcp.tool()
def sme_cases_find(query: str = "") -> Any:
    """Existing dossiers whose customer name, tax id or case id contains `query` (all when empty). Check this
    before creating a dossier, so one customer's documents do not split across two dossiers."""
    return _safe(svc.find_dossiers, query)


@mcp.tool()
def sme_case_create(customer: dict, request: dict, flow: str = "A") -> Any:
    """Create a dossier from what the Sale said in chat. customer and request are free-form single values with
    snake_case keys; the gap rules expect customer.name, customer.tax_id, customer.industry_code and
    request.product_code, amount, purpose (working_capital, fixed_asset, expansion, trade_finance),
    term_months. flow: "A" or "B". Returns the case with its case_id and the opening gap list."""
    def create() -> Any:
        case = svc.create_dossier(customer, request, flow, actor=f"agent:{AGENT}")
        return svc.gap_analysis(case["case_id"])
    return _safe(create)


@mcp.tool()
def sme_case_get(case_id: str) -> Any:
    """Read a dossier: customer, request, facts, documents (id, name, type, issued_date, local_path,
    extract_missing)."""
    def get() -> Any:
        case = svc.store.get_case(case_id)
        out = {k: v for k, v in case.items() if k not in ("results", "review_open")}
        docs = []
        for d in out.get("documents") or []:
            item = dict(d)
            p = svc.store.document_path(case_id, d["id"])
            if p and p.is_file():
                item["local_path"] = str(p)
            item["extract_missing"] = svc.extract_next(case_id, d["id"])
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
    return _safe(svc.gap_analysis, case_id)


@mcp.tool()
def sme_crosscheck_preview(case_id: str) -> Any:
    """Preview the 7 core cross-check rules (R1-R7) across currently uploaded documents and fields."""
    return _safe(svc.crosscheck_preview, case_id)


@mcp.tool()
def sme_case_update(case_id: str, customer: dict | None = None, request: dict | None = None,
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
        svc.store.update_case(case_id, patch, actor=f"agent:{AGENT}")
        return svc.gap_analysis(case_id)
    return _safe(update)


@mcp.tool()
def sme_document_import(case_id: str, path: str, doc_type: str = "", issued_date: str = "",
                        summary: str = "", meta: dict | None = None) -> Any:
    """Import a file the Sale attached in chat (path after `[attached_file N]`). Read the file first, then pass
    doc_type (from sme_documents_catalog types), issued_date (YYYY-MM-DD), a one-line summary, and optional
    structured scalar `meta` for Layer 2 rules & cross-checks (e.g. VAT: tax_id, filing_cycle, periods_count,
    signature_valid, continuous_chain, reported_revenue; Contracts: customer_role='seller'|'buyer',
    contract_count, counterparty_tax_id, vat_invoice_matched; Bank statement: months_covered;
    Site photos: photo_count; Collateral/Prosland: owner_name, asset_code).
    Right after, handle all `extract_next` fields via sme_case_update or sme_document_classify(not_stated=...)."""
    return _safe(svc.import_document, case_id, path, doc_type=doc_type, issued_date=issued_date,
                 summary=summary, meta=meta, actor=f"agent:{AGENT}")


@mcp.tool()
def sme_document_classify(case_id: str, document_id: str, doc_type: str = "", issued_date: str = "",
                          summary: str = "", not_stated: list[str] | None = None,
                          meta: dict | None = None) -> Any:
    """Update an existing document's type, issued_date (YYYY-MM-DD), summary, not_stated paths, or structured
    scalar `meta` (for VAT period counts/signature, contract roles/MST, bank statement months, photo_count, etc.).
    Returns the updated document and remaining extract_next."""
    return _safe(svc.classify_document, case_id, document_id, doc_type=doc_type, issued_date=issued_date,
                 summary=summary, not_stated=not_stated, meta=meta, actor=f"agent:{AGENT}")


@mcp.tool()
def sme_ocr_extract(case_id: str, document_id: str) -> Any:
    """OCR extraction for one document of the dossier (sample data until the OCR adapter is connected)."""
    return _safe(svc.ocr_extract, case_id, document_id)


@mcp.tool()
def sme_documents_catalog() -> Any:
    """Document types with label, group, validity in months, the customer-facing ask and approved substitutes."""
    return _safe(svc.documents_catalog)


@mcp.tool()
def sme_knowledge_products() -> Any:
    """The product catalogue (code, purposes, max term, collateral requirement)."""
    return _safe(svc.knowledge_products)


@mcp.tool()
def sme_draft_save(case_id: str, channel: str, subject: str, body: str, requirement_keys: list[str]) -> Any:
    """Save a draft request to the customer for the Sale to review and send. channel: email, zalo or
    phone_script. requirement_keys: the open item keys it asks for. Refused if it promises an outcome."""
    return _safe(svc.draft_save, case_id, channel, subject, body, requirement_keys, agent=AGENT)


@mcp.tool()
def sme_drafts_list(case_id: str) -> Any:
    """Drafts saved for this dossier, with status draft or sent."""
    return _safe(svc.store.list_drafts, case_id)


if __name__ == "__main__":
    mcp.run()
