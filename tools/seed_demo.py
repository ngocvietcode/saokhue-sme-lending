"""Seed one complete demo dossier that walks every step of both apps.

The dossier is fictional ("Công ty TNHH Thương mại Sao Mai Demo"). Every document
carries a small generated PDF marked "DU LIEU MAU", its structured meta, and the
sample OCR extract the lending agents read. On the Sales side it reaches a
COMPLETE master checklist with all seven cross-checks run; it also carries a
customer letter, a requested item and its follow-up, so every tab has content.
With --submit it is handed over to sme-lending, ready for "Chạy thẩm định".

    python tools/seed_demo.py [--sales-data <sme-lending/data/sales>] [--lending-data <sme-lending/data>] [--submit]

Without --sales-data the installed apps under $KIROCREW_HOME (default
~/.vpbank/saokhue) are used. Run it while Sao Khuê is closed or idle.
"""

from __future__ import annotations

import argparse
import json
import os
import sys
from pathlib import Path
from typing import Any

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "core"))

from sme_core.sales import SalesService  # noqa: E402

ACTOR = "sale:demo"
TAX_ID = "0109990001"
NAME = "Công ty TNHH Thương mại Sao Mai Demo"
LEGAL_REP = "Trần Minh Demo"

CUSTOMER: dict[str, Any] = {
    "name": NAME,
    "tax_id": TAX_ID,
    "industry_code": "4669",
    "legal_type": "LLC_1",
    "legal_rep": LEGAL_REP,
    "charter_capital": 10_000_000_000,
    "address": "Số 12 Phố Mẫu, Cầu Giấy, Hà Nội",
    "established": "2020-03-10",
    "cif": "DEMO0002",
    "owners_summary": "Trần Minh Demo - 100% vốn điều lệ",
}
REQUEST: dict[str, Any] = {
    "product_code": "SME-WC",
    "amount": 5_000_000_000,
    "purpose": "working_capital",
    "term_months": 12,
    "annual_rate_pct": 9.0,
    "repayment_method": "equal_principal",
    "proposal": "ĐVKD đề xuất SME-WC 5 tỷ, 12 tháng, bảo đảm bằng QSDĐ tại Cầu Giấy",
    "loan_use": "Thanh toán tiền mua hàng hoá vật liệu xây dựng cho nhà cung cấp trong nước",
    "repayment_source": "Doanh thu từ hợp đồng bán hàng đầu ra và dòng tiền kinh doanh",
}
FACTS: dict[str, Any] = {
    "years_in_operation": 6,
    "equity_contribution_pct": 35,
    "has_collateral": True,
    "collateral_needs_valuation": True,
    "requires_bank_statement_flow_a": True,
    "related_party_tax_ids": "0109990002",
    "total_exposure": 5_500_000_000,
    "revenue_last_year": 45_000_000_000,
    "net_income_last_year": 6_300_000_000,
    "total_assets_last_year": 30_000_000_000,
    "equity_last_year": 15_500_000_000,
    "fiscal_year_last": 2025,
    "vat_revenue_12m": 44_200_000_000,
    "vat_filing_cycle": "quarterly",
    "output_contracts_value": 12_000_000_000,
    "main_customers": "Công ty CP Phân phối Mẫu (0107770001)",
    "collateral_description": "QSDĐ thửa 123, tờ bản đồ 45, Cầu Giấy, 120 m2",
    "collateral_value": 9_000_000_000,
    "valuation_date": "2026-10-25",
}
# Display labels for request fields the catalogue does not name.
LABELS = {
    "request.annual_rate_pct": "Lãi suất đề xuất (%/năm)",
    "request.repayment_method": "Phương thức trả nợ (equal_principal = gốc đều)",
}
# Fields a document is asked for but does not state (an investment sub-purpose on a
# working-capital loan): recorded as "not stated" rather than invented.
NOT_STATED = {"de_nghi_vay": ["request.sub_purpose"]}

PERIODS = [
    {"period": "2024", "revenue": 38e9, "cogs": 30.5e9, "ebitda": 8.1e9, "ebit": 7.4e9, "net_income": 5.2e9,
     "interest_expense": 0.35e9, "total_assets": 26e9, "total_liabilities": 13e9, "equity": 13e9,
     "current_assets": 18e9, "current_liabilities": 10e9, "receivables": 6e9, "inventory": 5e9,
     "short_term_debt": 4e9, "long_term_debt": 1e9},
    {"period": "2025", "revenue": 45e9, "cogs": 35.8e9, "ebitda": 9.6e9, "ebit": 8.8e9, "net_income": 6.3e9,
     "interest_expense": 0.4e9, "total_assets": 30e9, "total_liabilities": 14.5e9, "equity": 15.5e9,
     "current_assets": 21e9, "current_liabilities": 11e9, "receivables": 7.2e9, "inventory": 5.8e9,
     "short_term_debt": 4.5e9, "long_term_debt": 1e9},
]

# (file name, doc type, issued date, meta, sample OCR extract)
DOCS: list[tuple[str, str, str, dict[str, Any], dict[str, Any]]] = [
    ("dkkd.pdf", "dkkd", "2026-09-15",
     {"tax_id": TAX_ID, "company_name": NAME, "legal_rep": LEGAL_REP, "charter_capital": 10_000_000_000},
     {"company_name": NAME, "tax_id": TAX_ID, "established": "2020-03-10", "legal_rep": LEGAL_REP,
      "charter_capital": 10_000_000_000, "ocr_confidence": 0.98}),
    ("dieu_le.pdf", "dieu_le", "2026-09-15", {"tax_id": TAX_ID, "authority_valid": True},
     {"tax_id": TAX_ID, "legal_type": "LLC_1", "ocr_confidence": 0.95}),
    ("ds_thanh_vien.pdf", "ds_thanh_vien", "2026-09-15", {"ownership_pct_sum": 100, "ownership_consistent": True},
     {"members": "Trần Minh Demo 100%", "ocr_confidence": 0.96}),
    ("cccd_chu_chot.pdf", "cccd_chu_chot", "2026-09-15", {"id_numbers_valid": True},
     {"holder": LEGAL_REP, "ocr_confidence": 0.97}),
    ("de_nghi_vay.pdf", "de_nghi_vay", "2026-11-10", {"tax_id": TAX_ID},
     {"amount": 5_000_000_000, "purpose": "Bổ sung vốn lưu động mua hàng", "term_months": 12, "ocr_confidence": 0.97}),
    ("to_trinh_dexuat.pdf", "to_trinh_dexuat", "2026-11-12", {},
     {"product_code": "SME-WC", "amount": 5_000_000_000, "ocr_confidence": 0.99}),
    ("bctc_2024_2025.pdf", "bctc_2_ky", "2026-03-30", {"tax_id": TAX_ID, "reported_revenue": 45e9},
     {"tax_id": TAX_ID, "periods": PERIODS, "ocr_confidence": 0.95}),
    ("to_khai_vat_8_quy.pdf", "to_khai_vat", "2026-10-20",
     {"tax_id": TAX_ID, "filing_cycle": "quarterly", "periods_count": 8, "signature_valid": True,
      "continuous_chain": True, "taxable_revenue": 44.2e9},
     {"tax_id": TAX_ID, "year": 2025, "taxable_revenue": 44.2e9, "ocr_confidence": 0.93}),
    ("hop_dong_dau_ra.pdf", "hop_dong_dau_ra", "2026-08-01",
     {"customer_role": "seller", "counterparty_tax_id": "0107770001", "vat_invoice_matched": True, "contract_count": 1},
     {"buyer": "Công ty CP Phân phối Mẫu", "value": 12e9, "ocr_confidence": 0.94}),
    ("hoa_don_vat_dau_ra.pdf", "hoa_don_vat", "2026-08-20", {"counterparty_tax_id": "0107770001"},
     {"invoice_total": 3.3e9, "ocr_confidence": 0.95}),
    ("sao_ke_12_thang.pdf", "sao_ke_tk", "2026-11-05",
     {"months_covered": 12, "undeclared_related_party_tx": False, "related_party_tx_tax_ids": "0109990002"},
     {"bank": "Ngân hàng Mẫu", "inflow_12m": 46e9, "ocr_confidence": 0.92}),
    ("khai_bao_khlq.pdf", "khai_bao_khlq", "2026-11-05", {"related_party_tax_ids": "0109990002"},
     {"related": "Công ty TNHH Sao Mai Logistics Demo (0109990002)", "ocr_confidence": 0.96}),
    ("thong_tin_cic.pdf", "thong_tin_cic", "2026-11-15", {},
     {"debt_group": 1, "total_outstanding": 5_500_000_000, "ocr_confidence": 0.99}),
    ("gcn_qsdd.pdf", "gcn_qsdd", "2026-06-01", {"owner_tax_id": TAX_ID},
     {"parcel": "Thửa 123, tờ bản đồ 45, Cầu Giấy", "area_m2": 120, "ocr_confidence": 0.94}),
    ("bc_dinh_gia_prosland.pdf", "bc_dinh_gia_prosland", "2026-10-25",
     {"valuation_value": 9_000_000_000, "matches_title": True},
     {"value": 9_000_000_000, "valuation_date": "2026-10-25", "ocr_confidence": 0.97}),
    ("anh_thuc_dia.pdf", "anh_thuc_dia", "2026-11-08", {"photo_count": 6},
     {"photo_count": 6, "ocr_confidence": 1.0}),
]


def _pdf(lines: list[str]) -> bytes:
    """A one-page PDF with ASCII text (built-in Helvetica has no Vietnamese glyphs)."""
    def esc(s: str) -> str:
        return s.replace("\\", "\\\\").replace("(", "\\(").replace(")", "\\)")
    body = "BT /F1 12 Tf 60 780 Td 16 TL " + " ".join(f"({esc(x)}) Tj T*" for x in lines) + " ET"
    objs = [
        "<< /Type /Catalog /Pages 2 0 R >>",
        "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
        "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Contents 4 0 R "
        "/Resources << /Font << /F1 5 0 R >> >> >>",
        f"<< /Length {len(body)} >>\nstream\n{body}\nendstream",
        "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
    ]
    out, offsets = b"%PDF-1.4\n", []
    for i, o in enumerate(objs, 1):
        offsets.append(len(out))
        out += f"{i} 0 obj\n{o}\nendobj\n".encode("latin-1")
    xref = len(out)
    out += f"xref\n0 {len(objs) + 1}\n0000000000 65535 f \n".encode()
    out += "".join(f"{o:010d} 00000 n \n" for o in offsets).encode()
    out += f"trailer\n<< /Size {len(objs) + 1} /Root 1 0 R >>\nstartxref\n{xref}\n%%EOF\n".encode()
    return out


def _ascii(s: str) -> str:
    import unicodedata
    s = s.replace("đ", "d").replace("Đ", "D")
    return unicodedata.normalize("NFKD", s).encode("ascii", "ignore").decode()


def _attach_sample_extract(svc: SalesService, case_id: str, extracts: dict[str, dict[str, Any]],
                           customer_samples: dict[str, Any]) -> None:
    """Demo-only: the OCR/CIC/NCLOS sample data no public API writes (see integrations.py)."""
    store = svc.store
    d = store._dir(case_id)
    with store._lock(d):
        case = json.loads((d / "case.json").read_text(encoding="utf-8"))
        for doc in case.get("documents", []):
            if doc["id"] in extracts:
                doc["sample_extract"] = extracts[doc["id"]]
        case.setdefault("customer", {}).update(customer_samples)
        (d / "case.json").write_text(json.dumps(case, ensure_ascii=False, indent=2), encoding="utf-8")
        store._audit(d, "demo_sample_data", {"documents": len(extracts), "actor": ACTOR})


# Held back on the first pass, so the dossier shows a real request cycle:
# the Sale asks the customer for them, then they arrive and close the items.
LATE_TYPES = ("to_khai_vat", "hop_dong_dau_ra", "hoa_don_vat")
DUE_DATE = "2026-11-25"


def _add(svc: SalesService, case_id: str, spec: tuple[str, str, str, dict[str, Any], dict[str, Any]],
         extracts: dict[str, dict[str, Any]]) -> None:
    fname, dtype, issued, meta, sample = spec
    pdf = _pdf([
        "DU LIEU MAU - KHONG PHAI CHUNG TU THAT",
        _ascii(NAME), f"MST {TAX_ID}",
        f"Loai chung tu: {dtype}", f"Ngay lap: {issued}",
        *[_ascii(f"{k}: {v}") for k, v in list(sample.items())[:8] if k != "periods"],
    ])
    doc = svc.store.add_document(case_id, name=fname, doc_type=dtype, issued_date=issued,
                                 data=pdf, meta=meta, summary=f"DỮ LIỆU MẪU - {fname}", actor=ACTOR)
    if dtype in NOT_STATED:
        svc.classify_document(case_id, doc["id"], not_stated=NOT_STATED[dtype], actor=ACTOR)
    extracts[doc["id"]] = sample


def _request_late_documents(svc: SalesService, case_id: str) -> list[str]:
    """Write and send the customer letter for every open customer item (the held-back documents)."""
    ov = svc.overview(case_id)
    keys = [i["key"] for i in ov["items"]
            if i["status"] == "open" and i.get("owner_role", "CUSTOMER") == "CUSTOMER"
            and i.get("rule_status") != "SKIPPED" and i["kind"] != "policy_precheck"]
    if not keys:
        return []
    titles = "\n".join(f"- {i['title']}" for i in ov["items"] if i["key"] in keys)
    draft = svc.draft_save(
        case_id, channel="email",
        subject=f"Bổ sung hồ sơ vay vốn - {NAME}",
        body=(f"Kính gửi Quý công ty,\n\nĐể hoàn thiện hồ sơ đề nghị cấp tín dụng, ngân hàng kính đề nghị "
              f"Quý công ty bổ sung các tài liệu sau:\n{titles}\n\nTrân trọng."),
        requirement_keys=keys, agent="dossier-coach",
    )
    svc.store.mark_draft_sent(case_id, draft["id"], actor=ACTOR, due_date=DUE_DATE)
    return keys


def build(svc: SalesService) -> str:
    """Create the dossier and walk it to a ready, COMPLETE state. Returns its case id."""
    case_id = svc.create_dossier(CUSTOMER, REQUEST, "A", actor=ACTOR)["case_id"]
    svc.store.update_case(case_id, {"facts": FACTS, "labels": LABELS}, actor=ACTOR)
    extracts: dict[str, dict[str, Any]] = {}
    for spec in DOCS:
        if spec[1] not in LATE_TYPES:
            _add(svc, case_id, spec, extracts)
    _request_late_documents(svc, case_id)
    for spec in DOCS:
        if spec[1] in LATE_TYPES:
            _add(svc, case_id, spec, extracts)
    _attach_sample_extract(svc, case_id, extracts, {
        "sample_cic": {"debt_group": 1, "total_outstanding": 5_500_000_000, "lenders": 2, "overdue_last_12m": False},
        "sample_exposure": {"outstanding": 5_500_000_000, "limits": 7_000_000_000, "annual_debt_service": 600_000_000},
    })
    return case_id


def submit(svc: SalesService, case_id: str) -> dict[str, Any]:
    """Submit the ready dossier; the handover adapter copies it into sme-lending."""
    ov = svc.submit_dossier(case_id, actor=ACTOR,
                            note="Hồ sơ mẫu đủ điều kiện, bàn giao để chạy thử thẩm định.")
    case = svc.store.get_case(case_id)
    return {"stage": ov["stage"], "receipt": (case.get("submitted") or {}).get("handover") or case.get("handover")}


def report(svc: SalesService, case_id: str) -> dict[str, Any]:
    ov = svc.overview(case_id)
    not_ok = [(i["key"], i.get("rule_status"), i["status"], i.get("reason", "")[:80])
              for i in ov["items"] if i.get("applicable", True) and i.get("rule_status") != "SKIPPED"
              and i["status"] not in ("ok", "resolved", "waived")]
    return {
        "case_id": case_id,
        "ready": ov["readiness"]["ready"],
        "checklist": ov["checklist_overall"],
        "counts": ov["checklist_counts"],
        "progress": ov["progress"],
        "crosschecks": {r["id"]: r["status"] for r in ov["crosschecks"]["rules"]},
        "not_ok": not_ok,
    }


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    home = Path(os.environ.get("KIROCREW_HOME") or Path.home() / ".vpbank" / "saokhue")
    ap.add_argument("--sales-data", type=Path, default=home / "apps" / "sme-lending" / "data" / "sales")
    ap.add_argument("--lending-data", type=Path, default=None)
    ap.add_argument("--submit", action="store_true", help="hand the dossier over to the assessment")
    args = ap.parse_args()
    lending = args.lending_data or args.sales_data.parent
    svc = SalesService(args.sales_data, ROOT / "core" / "knowledge", lending_data_root=lending)
    case_id = build(svc)
    out = report(svc, case_id)
    if args.submit:
        out["handover"] = submit(svc, case_id)
    print(json.dumps(out, ensure_ascii=False, indent=1))


if __name__ == "__main__":
    main()
