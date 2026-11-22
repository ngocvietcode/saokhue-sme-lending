"""Deterministic OpenXML `.xlsx` Template Generator & Parser for `05 · PAVV` (Mẫu Excel B4).

Figma design rules for `05 · Phương án và đề xuất cấp tín dụng (PAVV)`:
1. The 11 credit-limit fields and repayment capacity metrics are NOT extracted via OCR.
2. They are NOT directly editable as free-text inputs on the UI.
3. CBBH downloads standard Excel Template B4, updates numbers in Excel, and re-uploads it;
   this module deterministically parses the uploaded `.xlsx` and cross-checks formulas.

Implemented with Python standard library (`zipfile` + `xml.etree.ElementTree`) so it works
reliably across Windows/macOS/Linux without external pip dependencies.
"""

from __future__ import annotations

import io
import math
import re
import zipfile
from typing import Any
from xml.etree import ElementTree as ET
from xml.sax.saxutils import escape

from sme_core.finance import repayment_capacity

NS_MAIN = "http://schemas.openxmlformats.org/spreadsheetml/2006/main"
ET.register_namespace("", NS_MAIN)

# Canonical B4 Row Schema (Sheet 1, Column A = Code, B = Label, C = Value, D = Unit, E = Note)
B4_SPEC: list[dict[str, Any]] = [
    # Part I: 11 Working Capital Limit Indicators (Xác định hạn mức cho vay VLĐ - 11 chỉ tiêu)
    {"row": 5, "key": "planned_revenue", "section": "limit", "code": "01",
     "label": "Doanh thu thuần kế hoạch năm tiếp theo", "unit": "VNĐ", "default": 80_000_000_000},
    {"row": 6, "key": "planned_cogs", "section": "limit", "code": "02",
     "label": "Giá vốn hàng bán / Chi phí SXKD kế hoạch", "unit": "VNĐ", "default": 68_400_000_000},
    {"row": 7, "key": "avg_inventory", "section": "limit", "code": "03",
     "label": "Hàng tồn kho bình quân", "unit": "VNĐ", "default": 11_200_000_000},
    {"row": 8, "key": "avg_receivables", "section": "limit", "code": "04",
     "label": "Khoản phải thu ngắn hạn bình quân", "unit": "VNĐ", "default": 15_600_000_000},
    {"row": 9, "key": "avg_payables", "section": "limit", "code": "05",
     "label": "Khoản phải trả người bán ngắn hạn bình quân", "unit": "VNĐ", "default": 5_750_000_000},
    {"row": 10, "key": "wc_turnover", "section": "limit", "code": "06",
     "label": "Vòng quay vốn lưu động (02 / (03 + 04 - 05))", "unit": "Vòng/năm", "default": 3.25},
    {"row": 11, "key": "wc_need_per_cycle", "section": "limit", "code": "07",
     "label": "Nhu cầu vốn lưu động bình quân 1 vòng quay (02 / 06)", "unit": "VNĐ", "default": 21_050_000_000},
    {"row": 12, "key": "own_wc_equity", "section": "limit", "code": "08",
     "label": "Vốn lưu động tự có tham gia phương án", "unit": "VNĐ", "default": 3_350_000_000},
    {"row": 13, "key": "other_bank_wc_debt", "section": "limit", "code": "09",
     "label": "Dư nợ / hạn mức vay VLĐ tại TCTD khác", "unit": "VNĐ", "default": 2_300_000_000},
    {"row": 14, "key": "max_vpb_wc_limit", "section": "limit", "code": "10",
     "label": "Hạn mức cho vay VLĐ tối đa tại VPBank (07 - 08 - 09)", "unit": "VNĐ", "default": 15_400_000_000},
    {"row": 15, "key": "proposed_vpb_wc_limit", "section": "limit", "code": "11",
     "label": "Hạn mức cấp tín dụng đề xuất tại VPBank", "unit": "VNĐ", "default": 15_000_000_000},
    # Part II: Efficiency & Repayment Capacity (Hiệu quả phương án & Khả năng trả nợ)
    {"row": 18, "key": "projected_ebitda", "section": "repayment", "code": "12",
     "label": "EBITDA / Nguồn tiền thuần từ HĐKD dự phóng năm", "unit": "VNĐ", "default": 6_400_000_000},
    {"row": 19, "key": "projected_net_profit", "section": "repayment", "code": "13",
     "label": "Lợi nhuận sau thuế dự kiến năm kế hoạch", "unit": "VNĐ", "default": 3_850_000_000},
    {"row": 20, "key": "existing_annual_debt_service", "section": "repayment", "code": "14",
     "label": "Nghĩa vụ trả nợ gốc + lãi hiện hữu hàng năm", "unit": "VNĐ", "default": 1_850_000_000},
    {"row": 21, "key": "expected_interest_rate_pct", "section": "repayment", "code": "15",
     "label": "Lãi suất cho vay dự kiến (%/năm)", "unit": "%/năm", "default": 8.5},
    {"row": 22, "key": "proposed_term_months", "section": "repayment", "code": "16",
     "label": "Thời hạn duy trì hạn mức / Thời hạn vay đề xuất", "unit": "Tháng", "default": 12},
]

SPEC_BY_ROW = {item["row"]: item for item in B4_SPEC}
SPEC_BY_KEY = {item["key"]: item for item in B4_SPEC}


def generate_b4_template_xlsx(
    customer_name: str = "CÔNG TY TNHH MẪU",
    tax_id: str = "0100000000",
    overrides: dict[str, float | int] | None = None,
) -> bytes:
    """Generate a valid OpenXML `.xlsx` workbook matching the B4 PAVV cell specification."""
    values = {item["key"]: item["default"] for item in B4_SPEC}
    if overrides:
        for k, v in overrides.items():
            if k in values and v is not None:
                values[k] = v

    rows_xml: list[str] = [
        _str_row(1, [("A1", "BIỂU MẪU B4 — PHƯƠNG ÁN VAY VỐN & XÁC ĐỊNH HẠN MỨC CẤP TÍN DỤNG (SME CONNECT)")]),
        _str_row(2, [("A2", f"Khách hàng: {customer_name}"), ("C2", f"MST/ĐKKD: {tax_id}")]),
        _str_row(3, [("A3", "Mã CT"), ("B3", "Chỉ tiêu phương án (Mẫu B4)"), ("C3", "Giá trị"), ("D3", "Đơn vị"), ("E3", "Ghi chú")]),
        _str_row(4, [("A4", "I"), ("B4", "XÁC ĐỊNH HẠN MỨC CHO VAY BỔ SUNG VỐN LƯU ĐỘNG (11 CHỈ TIÊU)")]),
    ]

    for item in B4_SPEC:
        r = item["row"]
        if r == 18:
            rows_xml.append(_str_row(17, [("A17", "II"), ("B17", "ĐÁNH GIÁ HIỆU QUẢ PHƯƠNG ÁN & KHẢ NĂNG TRẢ NỢ")]))
        val = values[item["key"]]
        rows_xml.append(
            f'<row r="{r}">'
            f'{_inline_cell(f"A{r}", item["code"])}'
            f'{_inline_cell(f"B{r}", item["label"])}'
            f'<c r="C{r}"><v>{val}</v></c>'
            f'{_inline_cell(f"D{r}", item["unit"])}'
            f'{_inline_cell(f"E{r}", item["key"])}'
            f"</row>"
        )

    sheet_xml = (
        '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
        f'<worksheet xmlns="{NS_MAIN}">'
        '<cols>'
        '<col min="1" max="1" width="10" customWidth="1"/>'
        '<col min="2" max="2" width="56" customWidth="1"/>'
        '<col min="3" max="3" width="24" customWidth="1"/>'
        '<col min="4" max="4" width="14" customWidth="1"/>'
        '<col min="5" max="5" width="26" customWidth="1"/>'
        "</cols>"
        f'<sheetData>{"".join(rows_xml)}</sheetData>'
        "</worksheet>"
    )

    buf = io.BytesIO()
    with zipfile.ZipFile(buf, "w", zipfile.ZIP_DEFLATED) as zf:
        zf.writestr("[Content_Types].xml", _CONTENT_TYPES_XML)
        zf.writestr("_rels/.rels", _ROOT_RELS_XML)
        zf.writestr("xl/workbook.xml", _WORKBOOK_XML)
        zf.writestr("xl/_rels/workbook.xml.rels", _WORKBOOK_RELS_XML)
        zf.writestr("xl/styles.xml", _STYLES_XML)
        zf.writestr("xl/worksheets/sheet1.xml", sheet_xml)
    return buf.getvalue()


def parse_b4_xlsx(raw_bytes: bytes, file_name: str = "PAVV_B4.xlsx") -> dict[str, Any]:
    """Deterministically parse an uploaded B4 `.xlsx` file and verify all accounting formulas."""
    if not raw_bytes:
        raise ValueError("File Excel Mẫu B4 trống.")
    try:
        zf = zipfile.ZipFile(io.BytesIO(raw_bytes))
    except zipfile.BadZipFile as exc:
        raise ValueError("File tải lên không đúng định dạng Excel OpenXML (.xlsx).") from exc

    with zf:
        shared_strings = _read_shared_strings(zf)
        sheet_name = next(
            (n for n in zf.namelist() if n.startswith("xl/worksheets/sheet") and n.endswith(".xml")),
            None,
        )
        if not sheet_name:
            raise ValueError("Không tìm thấy worksheet dữ liệu trong file Excel Mẫu B4.")
        cells = _read_sheet_cells(zf.read(sheet_name), shared_strings)

    parsed_values: dict[str, float] = {}
    # Primary lookup: Column E key tag if preserved, else exact row C<row>
    key_by_row: dict[int, str] = {}
    for ref, val in cells.items():
        m = re.fullmatch(r"([A-Z]+)(\d+)", ref)
        if not m:
            continue
        col, row_num = m.group(1), int(m.group(2))
        if col == "E" and str(val).strip() in SPEC_BY_KEY:
            key_by_row[row_num] = str(val).strip()

    for item in B4_SPEC:
        r = item["row"]
        k = key_by_row.get(r, item["key"])
        raw_val = cells.get(f"C{r}")
        if raw_val is None or str(raw_val).strip() == "":
            raise ValueError(f"Thiếu giá trị tại ô C{r} ({item['label']}) trong file Excel Mẫu B4.")
        parsed_values[k] = _to_float(raw_val, f"C{r} ({item['label']})")

    return evaluate_b4_metrics(parsed_values, file_name=file_name)


def evaluate_b4_metrics(values: dict[str, float], file_name: str = "PAVV_B4.xlsx") -> dict[str, Any]:
    """Recompute deterministic working-capital & DSCR checks from parsed B4 numbers."""
    cogs = values["planned_cogs"]
    net_operating_assets = values["avg_inventory"] + values["avg_receivables"] - values["avg_payables"]
    recomputed_turnover = round(cogs / net_operating_assets, 2) if net_operating_assets > 0 else 0.0
    effective_turnover = values["wc_turnover"] if values["wc_turnover"] > 0 else recomputed_turnover
    recomputed_need = round(cogs / effective_turnover) if effective_turnover > 0 else 0.0
    recomputed_max_limit = round(values["wc_need_per_cycle"] - values["own_wc_equity"] - values["other_bank_wc_debt"])

    warnings: list[str] = []
    if net_operating_assets > 0 and abs(values["wc_turnover"] - recomputed_turnover) > 0.15:
        warnings.append(
            f"Vòng quay VLĐ trong file B4 ({values['wc_turnover']:.2f}) lệch so với công thức chuẩn "
            f"Giá vốn / (Tồn kho + Phải thu - Phải trả) = {recomputed_turnover:.2f} vòng."
        )
    if recomputed_need > 0 and abs(values["wc_need_per_cycle"] - recomputed_need) / max(recomputed_need, 1) > 0.03:
        warnings.append(
            f"Nhu cầu VLĐ bình quân ({values['wc_need_per_cycle']:,.0f}) lệch >3% so với Giá vốn / Vòng quay ({recomputed_need:,.0f})."
        )
    if abs(values["max_vpb_wc_limit"] - recomputed_max_limit) > 50_000_000:
        warnings.append(
            f"Hạn mức VLĐ tối đa tại VPBank ({values['max_vpb_wc_limit']:,.0f}) lệch so với công thức (07 - 08 - 09) = {recomputed_max_limit:,.0f}."
        )
    if values["proposed_vpb_wc_limit"] > values["max_vpb_wc_limit"]:
        warnings.append(
            f"Hạn mức đề xuất ({values['proposed_vpb_wc_limit']:,.0f} VNĐ) vượt Hạn mức cho vay tối đa theo B4 ({values['max_vpb_wc_limit']:,.0f} VNĐ)."
        )

    # Deterministic interest-coverage / DSCR check for working-capital revolving or term facility
    term_months = max(int(round(values["proposed_term_months"])), 1)
    rate_pct = max(float(values["expected_interest_rate_pct"]), 0.1)
    # For 12M revolving WC lines, banks evaluate annual interest + existing debt service against EBITDA
    annual_interest_new = values["proposed_vpb_wc_limit"] * (rate_pct / 100.0)
    total_service_wc = values["existing_annual_debt_service"] + annual_interest_new
    icr_dscr = round(values["projected_ebitda"] / total_service_wc, 2) if total_service_wc > 0 else 99.0

    # Also compute standard amortizing stress test via `sme_core.finance.repayment_capacity` when term > 12M
    amort_check = repayment_capacity(
        cash_available_annual=values["projected_ebitda"],
        existing_debt_service_annual=values["existing_annual_debt_service"],
        loan_amount=values["proposed_vpb_wc_limit"],
        annual_rate_pct=rate_pct,
        term_months=max(term_months, 36) if term_months <= 12 else term_months,
        method="equal_principal",
    )
    effective_dscr = icr_dscr if term_months <= 12 else float(amort_check.get("dscr_base") or icr_dscr)
    if effective_dscr < 1.2:
        warnings.append(f"Khả năng trả nợ / DSCR dự phóng ({effective_dscr:.2f}x) thấp hơn ngưỡng an toàn 1.20x.")

    rows_out = []
    for item in B4_SPEC:
        v = values[item["key"]]
        rows_out.append({
            "code": item["code"],
            "key": item["key"],
            "section": item["section"],
            "label": item["label"],
            "value": round(v, 2) if item["unit"] in ("Vòng/năm", "%/năm") else int(round(v)),
            "unit": item["unit"],
            "cell": f"C{item['row']}",
        })

    return {
        "schema_version": "smec-b4-1.0",
        "source_file": file_name,
        "readonly_locked": True,
        "values": {r["key"]: r["value"] for r in rows_out},
        "rows": rows_out,
        "computed_checks": {
            "recomputed_wc_turnover": recomputed_turnover,
            "recomputed_wc_need": int(recomputed_need),
            "recomputed_max_vpb_limit": int(recomputed_max_limit),
            "effective_dscr": effective_dscr,
            "annual_new_interest": int(round(annual_interest_new)),
            "formula_passed": len(warnings) == 0,
            "warnings": warnings,
        },
    }


def _to_float(raw: Any, label: str) -> float:
    if isinstance(raw, (int, float)) and not isinstance(raw, bool):
        if math.isnan(raw) or math.isinf(raw):
            raise ValueError(f"Giá trị không hợp lệ tại {label}")
        return float(raw)
    s = str(raw).strip().replace(",", "").replace(" ", "")
    try:
        val = float(s)
    except ValueError as exc:
        raise ValueError(f"Ô {label} phải là số, nhận được: {raw!r}") from exc
    if math.isnan(val) or math.isinf(val):
        raise ValueError(f"Giá trị không hợp lệ tại {label}")
    return val


def _inline_cell(ref: str, text: str) -> str:
    return f'<c r="{ref}" t="inlineStr"><is><t>{escape(str(text))}</t></is></c>'


def _str_row(row_idx: int, pairs: list[tuple[str, str]]) -> str:
    return f'<row r="{row_idx}">' + "".join(_inline_cell(ref, txt) for ref, txt in pairs) + "</row>"


def _read_shared_strings(zf: zipfile.ZipFile) -> list[str]:
    if "xl/sharedStrings.xml" not in zf.namelist():
        return []
    root = ET.fromstring(zf.read("xl/sharedStrings.xml"))
    out: list[str] = []
    for si in root.findall(f".//{{{NS_MAIN}}}si"):
        texts = [t.text or "" for t in si.findall(f".//{{{NS_MAIN}}}t")]
        out.append("".join(texts))
    return out


def _read_sheet_cells(xml_bytes: bytes, shared_strings: list[str]) -> dict[str, Any]:
    root = ET.fromstring(xml_bytes)
    out: dict[str, Any] = {}
    for c in root.findall(f".//{{{NS_MAIN}}}c"):
        ref = c.attrib.get("r", "")
        if not ref:
            continue
        ctype = c.attrib.get("t", "")
        if ctype == "inlineStr":
            texts = [t.text or "" for t in c.findall(f".//{{{NS_MAIN}}}t")]
            out[ref] = "".join(texts)
        elif ctype == "s":
            v_el = c.find(f"{{{NS_MAIN}}}v")
            idx = int(v_el.text) if v_el is not None and v_el.text and v_el.text.isdigit() else -1
            out[ref] = shared_strings[idx] if 0 <= idx < len(shared_strings) else ""
        else:
            v_el = c.find(f"{{{NS_MAIN}}}v")
            if v_el is not None and v_el.text is not None:
                out[ref] = v_el.text
    return out


_CONTENT_TYPES_XML = (
    '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
    '<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">'
    '<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>'
    '<Default Extension="xml" ContentType="application/xml"/>'
    '<Override PartName="/xl/workbook.xml" '
    'ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>'
    '<Override PartName="/xl/worksheets/sheet1.xml" '
    'ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>'
    '<Override PartName="/xl/styles.xml" '
    'ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>'
    "</Types>"
)

_ROOT_RELS_XML = (
    '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
    '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">'
    '<Relationship Id="rId1" '
    'Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" '
    'Target="xl/workbook.xml"/>'
    "</Relationships>"
)

_WORKBOOK_XML = (
    '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
    f'<workbook xmlns="{NS_MAIN}" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">'
    '<sheets><sheet name="PAVV_Mau_B4" sheetId="1" r:id="rId1"/></sheets>'
    "</workbook>"
)

_WORKBOOK_RELS_XML = (
    '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
    '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">'
    '<Relationship Id="rId1" '
    'Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" '
    'Target="worksheets/sheet1.xml"/>'
    '<Relationship Id="rId2" '
    'Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" '
    'Target="styles.xml"/>'
    "</Relationships>"
)

_STYLES_XML = (
    '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
    f'<styleSheet xmlns="{NS_MAIN}">'
    '<fonts count="1"><font><sz val="11"/><name val="Arial"/></font></fonts>'
    '<fills count="1"><fill><patternFill patternType="none"/></fill></fills>'
    '<borders count="1"><border><left/><right/><top/><bottom/><diagonal/></border></borders>'
    '<cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs>'
    '<cellXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/></cellXfs>'
    "</styleSheet>"
)
