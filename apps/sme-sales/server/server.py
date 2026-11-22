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
    """What the dossier still lacks: score (0-100), ready (bool), stage, and each open item with key, title,
    reason, the customer-facing `ask`, approved `alternatives`, `blocking` and status (open or requested).
    Computed by rules, not by a model: report these items, do not invent others."""
    return _safe(svc.gap_analysis, case_id)


@mcp.tool()
def sme_case_update(case_id: str, customer: dict | None = None, request: dict | None = None,
                    facts: dict | None = None, labels: dict | None = None, flow: str = "") -> Any:
    """Set dossier fields the Sale told you or a document states. Keys are free-form snake_case, values single
    (text, number, date); null removes a field. flow can switch between "A" and "B". Facts the rules use:
    years_in_operation, equity_contribution_pct. labels maps "section.key" to a Vietnamese display label for a
    key the catalogue does not name (e.g. {"customer.so_lao_dong": "Số lao động"}). Never invent a value."""
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
                        summary: str = "") -> Any:
    """Add a file the Sale attached in chat (the path after `[attached_file N]`) to the dossier. Read the file
    first, then pass doc_type (a key of sme_documents_catalog types, empty if none fits), issued_date
    (YYYY-MM-DD) and a one-line summary of what it shows. Only chat upload folders are accepted.
    The result's `extract_next` lists the fields this document type should give that the dossier still
    lacks: right after, call sme_case_update with every one the document states, and sme_document_classify
    with not_stated for the ones it does not."""
    return _safe(svc.import_document, case_id, path, doc_type=doc_type, issued_date=issued_date,
                 summary=summary, actor=f"agent:{AGENT}")


@mcp.tool()
def sme_document_classify(case_id: str, document_id: str, doc_type: str = "", issued_date: str = "",
                          summary: str = "", not_stated: list[str] | None = None) -> Any:
    """Set an existing document's type (a key of sme_documents_catalog types), issue date (YYYY-MM-DD),
    one-line summary, and not_stated: field paths from extract_next that this document does not state (so
    they stop being asked for). Returns the document and its remaining extract_next."""
    return _safe(svc.classify_document, case_id, document_id, doc_type=doc_type, issued_date=issued_date,
                 summary=summary, not_stated=not_stated, actor=f"agent:{AGENT}")


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
