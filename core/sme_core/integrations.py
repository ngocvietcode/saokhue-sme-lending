"""Adapters for existing bank services: OCR EDA, NCLOS, CIC.

The real adapters are deliberately NOT implemented: each returns
`not_configured` so an agent records a `system_error` review item instead of
inventing data. Replace each body with a call to the real internal API
(timeout, retry, idempotency and error mapping per the Tool/API contract).

Sample mode, for demos and UAT dry runs only: a case created with
`sample_extract` on a document, or `sample_cic` / `sample_exposure` on the
customer, gets that data back marked `status: "sample"`, so every result
built on it is visibly built on sample data.
"""

from __future__ import annotations

from typing import Any


def _not_configured(service: str) -> dict[str, Any]:
    return {"status": "not_configured", "service": service,
            "message": f"{service} adapter is not configured in sme_core/integrations.py"}


def _sample(service: str, data: Any) -> dict[str, Any]:
    return {"status": "sample", "service": service, "data": data,
            "warning": "SAMPLE DATA supplied at case creation, not from the real service"}


def ocr_extract(case: dict[str, Any], document_id: str) -> dict[str, Any]:
    for doc in case.get("documents", []):
        if doc.get("id") == document_id:
            if "sample_extract" in doc:
                return _sample("OCR EDA", doc["sample_extract"])
            return _not_configured("OCR EDA")
    return {"status": "error", "message": f"document {document_id!r} is not in this case"}


def nclos_exposure(case: dict[str, Any], customer_ids: list[str]) -> dict[str, Any]:
    sample = case.get("customer", {}).get("sample_exposure")
    return _sample("NCLOS", sample) if sample is not None else _not_configured("NCLOS")


def cic_report(case: dict[str, Any], customer_ids: list[str]) -> dict[str, Any]:
    sample = case.get("customer", {}).get("sample_cic")
    return _sample("CIC", sample) if sample is not None else _not_configured("CIC")
