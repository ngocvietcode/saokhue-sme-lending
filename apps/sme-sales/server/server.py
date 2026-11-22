"""MCP stdio server `sales` for the sme-sales app.

Registered by Sao Khue as `sme-sales:sales`; agents reference its tools as
`@sme-sales:sales/<tool>`. All logic lives in `sme_core` (a generated copy of
core/sme_core; see tools/sync_core.py).

What an agent may NOT do here, by design: waive a requirement, mark a draft as
sent, or mark a case submitted. Those go through the app backend, which only
accepts them from the signed-in dashboard user.

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
def sme_case_create(customer: dict, request: dict, flow: str = "A") -> Any:
    """Create a dossier. customer: {name, tax_id, cif, industry_code}; request: {product_code, amount, purpose,
    term_months, proposal}; flow: "A" or "B". Documents are added on the app page. Returns the case_id."""
    return _safe(svc.case_create, customer, request, [], flow)


@mcp.tool()
def sme_case_get(case_id: str) -> Any:
    """Read a dossier: customer, request, facts, documents (id, name, type, issued_date)."""
    def get() -> Any:
        case = svc.store.get_case(case_id)
        return {k: v for k, v in case.items() if k not in ("results", "review_open")}
    return _safe(get)


@mcp.tool()
def sme_dossier_gaps(case_id: str) -> Any:
    """What the dossier still lacks: score (0-100), ready (bool), stage, and each open item with key, title,
    reason, the customer-facing `ask`, approved `alternatives`, `blocking` and status (open or requested).
    Computed by rules, not by a model: report these items, do not invent others."""
    return _safe(svc.gap_analysis, case_id)


@mcp.tool()
def sme_case_update(case_id: str, customer: dict | None = None, request: dict | None = None,
                    facts: dict | None = None) -> Any:
    """Fill dossier fields read from the customer's documents (customer: name, tax_id, cif, industry_code,
    address, legal_rep, established; request: product_code, amount, purpose, term_months, proposal; facts:
    years_in_operation, equity_contribution_pct). Only values a document states; cite it in your reply."""
    patch = {k: v for k, v in (("customer", customer), ("request", request), ("facts", facts)) if v}
    return _safe(svc.store.update_case, case_id, patch, actor=f"agent:{AGENT}")


@mcp.tool()
def sme_document_classify(case_id: str, document_id: str, doc_type: str, issued_date: str = "") -> Any:
    """Set a document's type (a key of sme_documents_catalog types) and issue date (YYYY-MM-DD) as read from
    its content. The Sale can correct it on the page."""
    patch: dict[str, Any] = {"type": doc_type}
    if issued_date:
        patch["issued_date"] = issued_date
    return _safe(svc.store.update_document, case_id, document_id, patch, actor=f"agent:{AGENT}")


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
