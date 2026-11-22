"""OCR Field-level Provenance, Bounding-Box Highlighting & 6-Category Data Model (`BẢN MỚI`).

Implements Figma URL 1 (`Điều chỉnh màn hình kết quả OCR - BẢN MỚI`):
- 6 credit-centric categories (`01_customer` .. `06_blcn`), hiding `06_blcn` dynamically
  when none of the selected products require collateral.
- Semantic confidence states (`trusted`, `needs_confirm`, `missing`) instead of raw %.
- Hard `readonly: True` enforcement on `01_customer.dkkd_no`, `01_customer.cif`, and all
  `05_pavv.*` fields (which come exclusively from `b4_excel.py`).
- Every extracted field carries `{doc_id, doc_name, page, bbox: [x0, y0, x1, y1], snippet}`
  so the Side-by-Side `🔍 Đối chiếu` viewer highlights the exact source region in yellow.
- Projects structured 1-N tables (`entities.json`) and fields back into flat `case.json`
  (`customer`, `request`, `facts`) so `checklist_engine` and `crosscheck` run seamlessly.
"""

from __future__ import annotations

from typing import Any

from .b4_excel import B4_SPEC
from .constants import CONFIDENCE_TIERS, HARD_READONLY_FIELDS, OCR_CATEGORIES

# Canonical Field Catalogue across the 6 Categories
FIELD_CATALOG: list[dict[str, Any]] = [
    # 01 · Thông tin khách hàng
    {"path": "01_customer.dkkd_no", "category": "01_customer", "label": "Mã số ĐKKD / Mã số thuế", "readonly": True},
    {"path": "01_customer.cif", "category": "01_customer", "label": "Mã CIF tại VPBank", "readonly": True},
    {"path": "01_customer.company_name", "category": "01_customer", "label": "Tên doanh nghiệp đầy đủ"},
    {"path": "01_customer.legal_form", "category": "01_customer", "label": "Loại hình doanh nghiệp"},
    {"path": "01_customer.established_date", "category": "01_customer", "label": "Ngày đăng ký lần đầu"},
    {"path": "01_customer.amendment_no", "category": "01_customer", "label": "Lần thay đổi ĐKKD gần nhất"},
    {"path": "01_customer.charter_capital", "category": "01_customer", "label": "Vốn điều lệ đăng ký (VNĐ)"},
    {"path": "01_customer.registered_address", "category": "01_customer", "label": "Địa chỉ trụ sở chính"},
    {"path": "01_customer.operating_address", "category": "01_customer", "label": "Địa chỉ giao dịch / kho xưởng thực tế"},
    {"path": "01_customer.legal_rep_name", "category": "01_customer", "label": "Người đại diện theo pháp luật"},
    {"path": "01_customer.legal_rep_title", "category": "01_customer", "label": "Chức danh ĐDPL"},
    {"path": "01_customer.legal_rep_id", "category": "01_customer", "label": "Số CCCD/Hộ chiếu ĐDPL"},
    # 02 · Thông tin khác
    {"path": "02_other.industry_code", "category": "02_other", "label": "Mã ngành kinh tế chính (VSIC)"},
    {"path": "02_other.main_business_line", "category": "02_other", "label": "Ngành nghề kinh doanh chính"},
    {"path": "02_other.conditional_license", "category": "02_other", "label": "Giấy phép kinh doanh có điều kiện"},
    {"path": "02_other.employee_count", "category": "02_other", "label": "Quy mô lao động (người)"},
    {"path": "02_other.esg_risk_level", "category": "02_other", "label": "Phân loại rủi ro Môi trường - Xã hội (MTXH)"},
    {"path": "02_other.years_in_operation", "category": "02_other", "label": "Số năm hoạt động thực tế"},
    # 03 · Hoạt động kinh doanh
    {"path": "03_business.business_model", "category": "03_business", "label": "Mô hình & quy trình hoạt động SXKD"},
    {"path": "03_business.key_products", "category": "03_business", "label": "Sản phẩm / dịch vụ chủ lực"},
    {"path": "03_business.warehouse_area_m2", "category": "03_business", "label": "Diện tích nhà xưởng / kho bãi (m2)"},
    {"path": "03_business.output_payment_terms", "category": "03_business", "label": "Phương thức & kỳ hạn thu tiền đầu ra"},
    {"path": "03_business.input_payment_terms", "category": "03_business", "label": "Phương thức & kỳ hạn thanh toán đầu vào"},
    {"path": "03_business.output_contracts_count", "category": "03_business", "label": "Số hợp đồng đầu ra đối chiếu hợp lệ"},
    {"path": "03_business.input_contracts_count", "category": "03_business", "label": "Số hợp đồng đầu vào đối chiếu hợp lệ"},
    # 04 · Tình hình tài chính
    {"path": "04_financial.revenue_n_1", "category": "04_financial", "label": "Doanh thu thuần BCTC năm N-1 (VNĐ)"},
    {"path": "04_financial.revenue_n_2", "category": "04_financial", "label": "Doanh thu thuần BCTC năm N-2 (VNĐ)"},
    {"path": "04_financial.net_income_n_1", "category": "04_financial", "label": "Lợi nhuận sau thuế năm N-1 (VNĐ)"},
    {"path": "04_financial.total_assets_n_1", "category": "04_financial", "label": "Tổng tài sản cuối năm N-1 (VNĐ)"},
    {"path": "04_financial.equity_n_1", "category": "04_financial", "label": "Vốn chủ sở hữu cuối năm N-1 (VNĐ)"},
    {"path": "04_financial.vat_revenue_12m", "category": "04_financial", "label": "Tổng doanh thu tờ khai VAT 12 tháng gần nhất (VNĐ)"},
    {"path": "04_financial.vat_filing_periods", "category": "04_financial", "label": "Chuỗi kỳ tờ khai VAT đã tải lên"},
    {"path": "04_financial.bank_inflow_12m", "category": "04_financial", "label": "Tổng dòng tiền ghi Có sao kê 12 tháng (VNĐ)"},
]

# Add `05_pavv.*` fields from B4_SPEC (all strictly readonly, populated from Excel B4)
for _b4 in B4_SPEC:
    FIELD_CATALOG.append({
        "path": f"05_pavv.{_b4['key']}",
        "category": "05_pavv",
        "label": f"[{_b4['code']}] {_b4['label']} ({_b4['unit']})",
        "readonly": True,
        "source_kind": "excel_b4",
    })

# Add `06_blcn.*` fields (Personal Guarantee & Collateral Summary)
FIELD_CATALOG.extend([
    {"path": "06_blcn.primary_guarantor_name", "category": "06_blcn", "label": "Họ tên người bảo lãnh cá nhân chính"},
    {"path": "06_blcn.primary_guarantor_id", "category": "06_blcn", "label": "Số CCCD người bảo lãnh cá nhân"},
    {"path": "06_blcn.primary_guarantor_relation", "category": "06_blcn", "label": "Mối quan hệ với khách hàng vay"},
    {"path": "06_blcn.guarantee_scope", "category": "06_blcn", "label": "Phạm vi nghĩa vụ bảo lãnh"},
    {"path": "06_blcn.collateral_total_valuation", "category": "06_blcn", "label": "Tổng giá trị định giá TSBĐ Prosland (VNĐ)"},
    {"path": "06_blcn.collateral_asset_summary", "category": "06_blcn", "label": "Tóm tắt tài sản bảo đảm"},
])

CATALOG_BY_PATH = {f["path"]: f for f in FIELD_CATALOG}


def build_ocr_view(
    extractions: dict[str, Any],
    entities: dict[str, Any],
    *,
    has_collateral: bool,
    pavv_b4: dict[str, Any] | None = None,
) -> dict[str, Any]:
    """Assemble the 6-category OCR verification payload with per-category & overall counters."""
    stored_fields = extractions.get("fields") or {}
    b4_values = (pavv_b4 or {}).get("values") or {}
    b4_file = (pavv_b4 or {}).get("source_file")

    visible_categories = [
        cat for cat in OCR_CATEGORIES
        if has_collateral or not cat["requires_collateral"]
    ]
    visible_cat_ids = {c["id"] for c in visible_categories}

    categories_out: list[dict[str, Any]] = []
    tot_all = tot_trusted = tot_confirm = tot_missing = 0

    for cat in visible_categories:
        cat_id = cat["id"]
        cat_fields: list[dict[str, Any]] = []
        c_total = c_trusted = c_confirm = c_missing = 0

        for spec in FIELD_CATALOG:
            if spec["category"] != cat_id:
                continue
            path = spec["path"]
            raw = dict(stored_fields.get(path) or {})

            if cat_id == "05_pavv":
                b4_key = path.split(".", 1)[1]
                if b4_key in b4_values:
                    val = b4_values[b4_key]
                    tier = "trusted"
                    source = {
                        "kind": "excel_b4",
                        "doc_name": b4_file or "PAVV_B4.xlsx",
                        "cell": next((r["cell"] for r in (pavv_b4 or {}).get("rows", []) if r["key"] == b4_key), "C?"),
                    }
                    confirmed_by = "excel_b4_parser"
                else:
                    val = None
                    tier = "missing"
                    source = {"kind": "excel_b4", "note": "Cần tải lên file Excel Mẫu B4"}
                    confirmed_by = None
                readonly = True
            else:
                val = raw.get("value")
                tier = raw.get("confidence_tier") or ("trusted" if val not in (None, "") else "missing")
                if tier not in CONFIDENCE_TIERS:
                    tier = "needs_confirm"
                if val in (None, ""):
                    tier = "missing"
                source = raw.get("source")
                confirmed_by = raw.get("confirmed_by")
                readonly = bool(spec.get("readonly") or path in HARD_READONLY_FIELDS or raw.get("readonly"))

            # If a `needs_confirm` field was already confirmed by CBBH, mark `confirmed: True`
            is_confirmed = bool(confirmed_by)
            effective_tier = "trusted" if (tier == "needs_confirm" and is_confirmed) else tier

            c_total += 1
            if effective_tier == "trusted":
                c_trusted += 1
            elif effective_tier == "needs_confirm":
                c_confirm += 1
            else:
                c_missing += 1

            cat_fields.append({
                "path": path,
                "label": spec["label"],
                "value": val,
                "confidence_tier": effective_tier,
                "raw_tier": tier,
                "readonly": readonly,
                "confirmed": is_confirmed,
                "confirmed_by": confirmed_by,
                "confirmed_at": raw.get("confirmed_at"),
                "conflict_note": raw.get("conflict_note", ""),
                "source": source,
            })

        tot_all += c_total
        tot_trusted += c_trusted
        tot_confirm += c_confirm
        tot_missing += c_missing

        categories_out.append({
            **cat,
            "counts": {
                "total": c_total,
                "trusted": c_trusted,
                "needs_confirm": c_confirm,
                "missing": c_missing,
            },
            "fields": cat_fields,
            "tables": _tables_for_category(cat_id, entities),
        })

    return {
        "schema_version": "smec-ocr-2.0",
        "has_collateral": has_collateral,
        "hidden_categories": [c["id"] for c in OCR_CATEGORIES if c["id"] not in visible_cat_ids],
        "pavv_b4_loaded": bool(b4_values),
        "pavv_b4_summary": pavv_b4,
        "summary": {
            "total": tot_all,
            "trusted": tot_trusted,
            "needs_confirm": tot_confirm,
            "missing": tot_missing,
        },
        "categories": categories_out,
    }


def apply_field_updates(
    extractions: dict[str, Any],
    updates: list[dict[str, Any]],
    *,
    actor: str,
    timestamp: str,
) -> dict[str, Any]:
    """Update or confirm OCR fields while strictly blocking `HARD_READONLY_FIELDS` and `05_pavv.*`."""
    fields = dict(extractions.get("fields") or {})
    for item in updates:
        path = str(item.get("path") or "").strip()
        if path not in CATALOG_BY_PATH:
            raise ValueError(f"Trường OCR không tồn tại trong danh mục: {path!r}")
        if path.startswith("05_pavv."):
            raise ValueError(
                "Nhóm 05 · PAVV không cho phép chỉnh sửa trực tiếp trên màn hình; vui lòng tải lên file Excel Mẫu B4."
            )
        cur = dict(fields.get(path) or {})
        new_value = item.get("value", cur.get("value"))
        if path in HARD_READONLY_FIELDS and "value" in item and str(item["value"]) != str(cur.get("value", "")):
            raise ValueError(f"Trường {CATALOG_BY_PATH[path]['label']} ({path}) đã bị khóa cứng (read-only).")

        cur["value"] = new_value
        cur["confidence_tier"] = "trusted" if new_value not in (None, "") else "missing"
        cur["confirmed_by"] = actor
        cur["confirmed_at"] = timestamp
        fields[path] = cur

    return {**extractions, "fields": fields, "updated_at": timestamp, "updated_by": actor}


def project_to_flat_case(
    case: dict[str, Any],
    extractions: dict[str, Any],
    entities: dict[str, Any],
    pavv_b4: dict[str, Any] | None,
) -> dict[str, Any]:
    """Project 6-category OCR fields, 1-N tables & B4 values into flat `customer/request/facts` for core engines."""
    fields = extractions.get("fields") or {}

    def val(path: str, default: Any = None) -> Any:
        v = (fields.get(path) or {}).get("value")
        return default if v in (None, "") else v

    customer = dict(case.get("customer") or {})
    request = dict(case.get("request") or {})
    facts = dict(case.get("facts") or {})

    if val("01_customer.dkkd_no"):
        customer["tax_id"] = str(val("01_customer.dkkd_no"))
    if val("01_customer.cif"):
        customer["cif"] = str(val("01_customer.cif"))
    if val("01_customer.company_name"):
        customer["name"] = str(val("01_customer.company_name"))
    if val("01_customer.legal_form"):
        customer["legal_form"] = _normalize_legal_form(str(val("01_customer.legal_form")))
    if val("01_customer.established_date"):
        customer["established"] = str(val("01_customer.established_date"))[:10]
    if val("01_customer.charter_capital") is not None:
        customer["charter_capital"] = _safe_num(val("01_customer.charter_capital"))
    if val("01_customer.legal_rep_name"):
        customer["legal_rep"] = str(val("01_customer.legal_rep_name"))
    if val("02_other.industry_code"):
        customer["industry_code"] = str(val("02_other.industry_code"))

    if val("02_other.years_in_operation") is not None:
        facts["years_in_operation"] = _safe_num(val("02_other.years_in_operation"))
    if val("04_financial.revenue_n_1") is not None:
        facts["revenue_last_year"] = _safe_num(val("04_financial.revenue_n_1"))
    if val("04_financial.net_income_n_1") is not None:
        facts["net_income_last_year"] = _safe_num(val("04_financial.net_income_n_1"))
    if val("04_financial.total_assets_n_1") is not None:
        facts["total_assets_last_year"] = _safe_num(val("04_financial.total_assets_n_1"))
    if val("04_financial.equity_n_1") is not None:
        facts["equity_last_year"] = _safe_num(val("04_financial.equity_n_1"))
    if val("04_financial.vat_revenue_12m") is not None:
        facts["vat_revenue_12m"] = _safe_num(val("04_financial.vat_revenue_12m"))
    if val("06_blcn.collateral_total_valuation") is not None:
        facts["collateral_value"] = _safe_num(val("06_blcn.collateral_total_valuation"))

    if pavv_b4 and pavv_b4.get("values"):
        b4v = pavv_b4["values"]
        facts["planned_revenue"] = b4v.get("planned_revenue", facts.get("planned_revenue"))
        facts["dscr"] = (pavv_b4.get("computed_checks") or {}).get("effective_dscr", facts.get("dscr"))
        request["term_months"] = int(b4v.get("proposed_term_months") or request.get("term_months") or 12)

    # Sync collateral type flags from 1-N `entities["collaterals"]`
    collaterals = entities.get("collaterals") or []
    if collaterals:
        kinds = {str(c.get("asset_type") or "").upper() for c in collaterals}
        facts["has_collateral"] = True
        if "REAL_ESTATE" in kinds or "BDS" in kinds:
            facts["collateral_type"] = "real_estate"
        elif "VEHICLE" in kinds or "PTVT" in kinds:
            facts["collateral_type"] = "vehicle"
        elif "DEPOSIT" in kinds:
            facts["collateral_type"] = "deposit"

    return {**case, "customer": customer, "request": request, "facts": facts}


def _tables_for_category(cat_id: str, entities: dict[str, Any]) -> dict[str, list[dict[str, Any]]]:
    if cat_id == "01_customer":
        return {
            "leaders": list(entities.get("leaders") or []),
            "shareholders": list(entities.get("shareholders") or []),
            "related_parties": list(entities.get("related_parties") or []),
        }
    if cat_id == "03_business":
        return {
            "buyers": list(entities.get("buyers") or []),
            "suppliers": list(entities.get("suppliers") or []),
            "invoices": list(entities.get("invoices") or []),
        }
    if cat_id == "06_blcn":
        return {
            "guarantors": list(entities.get("guarantors") or []),
            "collaterals": list(entities.get("collaterals") or []),
        }
    return {}


def _safe_num(v: Any) -> int | float | Any:
    if isinstance(v, (int, float)) and not isinstance(v, bool):
        return v
    if isinstance(v, str):
        s = v.strip().replace(",", "").replace(".", "") if v.count(".") > 1 else v.strip().replace(",", "")
        try:
            f = float(s)
            return int(f) if f.is_integer() else f
        except ValueError:
            return v
    return v


def _normalize_legal_form(raw: str) -> str:
    low = raw.lower()
    if "cổ phần" in low or "ctcp" in low or "jsc" in low:
        return "jsc"
    if "1 thành viên" in low or "một thành viên" in low or "mtv" in low:
        return "llc_1m"
    if "2 thành viên" in low or "hai thành viên" in low or "tnhh" in low:
        return "llc_2m"
    if "tư nhân" in low or "dntn" in low:
        return "private"
    return raw
