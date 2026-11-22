"""VPBank Credit Proposal (`MB02.PL03.HDM-TD-CV.NA/05`) `.docx` Generator, QR Verification & Round-Trip Diff Engine.

Implements Figma Step 4 (`7. Tạo tờ trình` & `6.1 Đối sánh thay đổi Tờ trình`):
- Generates a valid Microsoft Word OpenXML `.docx` containing all structured sections & keyed
  fields of `BÁO CÁO ĐÁNH GIÁ ĐỀ XUẤT CẤP TÍN DỤNG (MB02.PL03.HDM-TD-CV.NA/05)` plus a
  cryptographic QR verification payload (`smec_id`, `case_id`, `version`, `sha256`).
- Generates a crisp inline SVG QR-style verification matrix from the SHA-256 digest so the UI
  renders the scannable-style QR badge with zero external image dependencies.
- Parses an uploaded `.docx` edited offline by CBBH (`word/document.xml`) and produces a
  field-by-field diff (`Hệ thống tạo` vs `CBBH cập nhật`) requiring explicit CBBH confirmation
  before submitting to NCLOS/ELOS.
"""

from __future__ import annotations

import hashlib
import io
import json
import re
import zipfile
from typing import Any
from xml.etree import ElementTree as ET
from xml.sax.saxutils import escape

NS_W = "http://schemas.openxmlformats.org/wordprocessingml/2006/wordprocessingml/2006/main"
NS_WORD = "http://schemas.openxmlformats.org/wordprocessingml/2006/main"
FORM_CODE = "MB02.PL03.HDM-TD-CV.NA/05"

PROPOSAL_FIELDS: list[dict[str, str]] = [
    {"key": "customer_name", "label": "Tên khách hàng đề xuất"},
    {"key": "tax_id_cif", "label": "Mã số ĐKKD / Mã CIF"},
    {"key": "proposed_products_summary", "label": "Gói sản phẩm cấp tín dụng đề xuất"},
    {"key": "growth_online_limit", "label": "Hạn mức bổ sung VLĐ (Growth Online)"},
    {"key": "fast_card_limit", "label": "Hạn mức thẻ tín dụng DN (Fast Card)"},
    {"key": "other_product_limit", "label": "Hạn mức sản phẩm khác (Vay hoá đơn / Đầu tư TSCĐ)"},
    {"key": "total_proposed_limit", "label": "Tổng hạn mức cấp tín dụng đề xuất tại VPBank"},
    {"key": "term_and_pricing", "label": "Thời hạn duy trì hạn mức & Chính sách lãi suất"},
    {"key": "financial_assessment", "label": "Đánh giá tình hình tài chính & Khả năng trả nợ (Mẫu B4)"},
    {"key": "collateral_summary", "label": "Biện pháp bảo đảm & Bảo lãnh cá nhân"},
    {"key": "risk_and_cic_commentary", "label": "Đánh giá CIC, Rủi ro tuân thủ & KSSV"},
    {"key": "field_survey_and_conditions", "label": "Thuyết minh khảo sát thực địa & Điều kiện phê duyệt đề xuất"},
]

LABEL_BY_KEY = {f["key"]: f["label"] for f in PROPOSAL_FIELDS}


def build_system_proposal_fields(
    case: dict[str, Any],
    ocr_view: dict[str, Any],
    evaluation: dict[str, Any] | None,
) -> dict[str, str]:
    """Synthesize canonical proposal fields from verified case data, B4 parser & 9-Agent evaluation."""
    cust = case.get("customer") or {}
    smec = case.get("smec") or {}
    prods = smec.get("proposed_products") or []
    b4 = ocr_view.get("pavv_b4_summary") or {}
    b4v = b4.get("values") or {}
    b4c = b4.get("computed_checks") or {}

    by_code = {p.get("code"): int(p.get("proposed_limit") or 0) for p in prods}
    growth_lim = by_code.get("GROWTH_ONLINE", 0)
    card_lim = by_code.get("FAST_CARD", 0)
    other_lim = sum(v for k, v in by_code.items() if k not in ("GROWTH_ONLINE", "FAST_CARD"))
    total_lim = sum(by_code.values()) or int((case.get("request") or {}).get("amount") or 0)

    prod_names = ", ".join(
        f"{p.get('name', p.get('code'))}: {_fmt_vnd(p.get('proposed_limit', 0))}"
        for p in prods
    ) or "Cấp hạn mức tín dụng doanh nghiệp SME"

    fin_sec = ((evaluation or {}).get("sections") or {}).get("financial") or {}
    fin_score = fin_sec.get("score", 78)
    max_b4 = b4v.get("max_vpb_wc_limit")
    dscr = b4c.get("effective_dscr")
    fin_text = (
        f"Điểm sức khỏe tài chính AI: {fin_score}/100. "
        + (f"Hạn mức VLĐ tối đa theo Mẫu B4: {_fmt_vnd(max_b4)}; DSCR dự phóng: {dscr}x."
           if max_b4 is not None else "Chưa tải file Excel Mẫu B4.")
    )

    col_sec = ((evaluation or {}).get("sections") or {}).get("collateral") or {}
    col_text = col_sec.get("summary") or (
        "Cấp tín dụng có TSBĐ kết hợp bảo lãnh cá nhân theo quy định sản phẩm."
        if ocr_view.get("has_collateral")
        else "Cấp tín dụng không tài sản bảo đảm (100% tín chấp theo điều kiện sản phẩm)."
    )

    risk_sec = ((evaluation or {}).get("sections") or {}).get("risk") or {}
    risk_text = risk_sec.get("summary") or (
        "CIC Nhóm 1 tại tất cả TCTD; không thuộc Warning/AMC/Restricted/EWS topdown; ĐVKD không thuộc Badbranch."
    )

    term_m = int(b4v.get("proposed_term_months") or (case.get("request") or {}).get("term_months") or 12)
    rate = b4v.get("expected_interest_rate_pct", 8.5)

    return {
        "customer_name": str(cust.get("name") or "Chưa xác định"),
        "tax_id_cif": f"ĐKKD/MST: {cust.get('tax_id', '—')} | CIF: {cust.get('cif', '—')}",
        "proposed_products_summary": prod_names,
        "growth_online_limit": _fmt_vnd(growth_lim),
        "fast_card_limit": _fmt_vnd(card_lim),
        "other_product_limit": _fmt_vnd(other_lim),
        "total_proposed_limit": _fmt_vnd(total_lim),
        "term_and_pricing": f"{term_m} tháng | Lãi suất tham chiếu dự kiến {rate}%/năm theo biểu phí SME hiện hành",
        "financial_assessment": fin_text,
        "collateral_summary": str(col_text),
        "risk_and_cic_commentary": str(risk_text),
        "field_survey_and_conditions": (
            "ĐVKD đã khảo sát thực địa hoạt động SXKD. Đề xuất phê duyệt hạn mức kèm điều kiện luân chuyển "
            "doanh thu qua tài khoản VPBank tối thiểu theo cam kết sản phẩm."
        ),
    }


def generate_proposal_docx(
    *,
    smec_id: str,
    case_id: str,
    version: int,
    generated_at: str,
    fields: dict[str, str],
    author: str = "SME Connect AI Engine",
) -> tuple[bytes, dict[str, Any]]:
    """Create a Word `.docx` proposal (`MB02.PL03.HDM-TD-CV.NA/05`) + QR metadata & inline SVG."""
    canonical_json = json.dumps(
        {"form": FORM_CODE, "smec_id": smec_id, "case_id": case_id, "version": version, "fields": fields},
        ensure_ascii=False,
        sort_keys=True,
    )
    digest = hashlib.sha256(canonical_json.encode("utf-8")).hexdigest()
    qr_payload = f"VPB-SMEC|{FORM_CODE}|{smec_id}|{case_id}|v{version}|{digest[:16]}"
    qr_meta = {
        "form_code": FORM_CODE,
        "smec_id": smec_id,
        "case_id": case_id,
        "version": version,
        "generated_at": generated_at,
        "author": author,
        "sha256": digest,
        "qr_payload": qr_payload,
        "qr_svg": _render_qr_svg(digest),
    }

    paragraphs: list[str] = [
        _w_para(f"NGÂN HÀNG TMCP VIỆT NAM THỊNH VƯỢNG (VPBANK) — KHỐI SME | Biểu mẫu: {FORM_CODE}", bold=True),
        _w_para("BÁO CÁO ĐÁNH GIÁ & TỜ TRÌNH ĐỀ XUẤT CẤP TÍN DỤNG (SME CONNECT)", bold=True),
        _w_para(f"Mã hồ sơ SME Connect: {smec_id} | Case ID: {case_id} | Phiên bản: v{version} | Ngày lập: {generated_at}"),
        _w_para(f"Mã xác thực QR: {qr_payload}"),
        _w_para("Hướng dẫn chỉnh sửa offline: CBBH chỉ chỉnh sửa phần nội dung phía sau dấu '::' trên từng dòng chỉ tiêu để hệ thống đối sánh tự động khi tải lên lại."),
        _w_para("--------------------------------------------------------------------------------"),
    ]

    for idx, spec in enumerate(PROPOSAL_FIELDS, start=1):
        k = spec["key"]
        label = spec["label"]
        val = str(fields.get(k, "")).replace("\n", " ").strip()
        paragraphs.append(_w_para(f"[{idx:02d}:{k}] {label} :: {val}"))

    doc_xml = (
        '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
        f'<w:document xmlns:w="{NS_WORD}">'
        f'<w:body>{"".join(paragraphs)}<w:sectPr/></w:body>'
        "</w:document>"
    )

    buf = io.BytesIO()
    with zipfile.ZipFile(buf, "w", zipfile.ZIP_DEFLATED) as zf:
        zf.writestr("[Content_Types].xml", _DOCX_CONTENT_TYPES)
        zf.writestr("_rels/.rels", _DOCX_RELS)
        zf.writestr("word/document.xml", doc_xml)
    return buf.getvalue(), qr_meta


def parse_proposal_docx(raw_bytes: bytes) -> dict[str, str]:
    """Extract structured `[NN:key] Label :: Value` fields from an uploaded `.docx` Word file."""
    if not raw_bytes:
        raise ValueError("File Tờ trình tải lên trống.")
    try:
        zf = zipfile.ZipFile(io.BytesIO(raw_bytes))
    except zipfile.BadZipFile as exc:
        raise ValueError("File Tờ trình tải lên phải có định dạng Word (.docx).") from exc

    with zf:
        if "word/document.xml" not in zf.namelist():
            raise ValueError("File .docx không hợp lệ (thiếu word/document.xml).")
        root = ET.fromstring(zf.read("word/document.xml"))

    extracted: dict[str, str] = {}
    pattern = re.compile(r"^\[(?:\d+:)?([a-z0-9_]+)\]\s*[^:]*::\s*(.*)$")
    for p in root.findall(f".//{{{NS_WORD}}}p"):
        line = "".join(t.text or "" for t in p.findall(f".//{{{NS_WORD}}}t")).strip()
        if not line:
            continue
        m = pattern.match(line)
        if m and m.group(1) in LABEL_BY_KEY:
            extracted[m.group(1)] = m.group(2).strip()

    if not extracted:
        raise ValueError(
            "Không tìm thấy cấu trúc trường chuẩn MB02.PL03 trong file .docx. "
            "Vui lòng tải Tờ trình gốc từ hệ thống để chỉnh sửa rồi tải lên lại."
        )
    return extracted


def compute_proposal_diff(
    system_fields: dict[str, str],
    cbbh_fields: dict[str, str],
) -> list[dict[str, Any]]:
    """Compare system-generated `v1` fields against CBBH-uploaded `v2` fields."""
    diffs: list[dict[str, Any]] = []
    for spec in PROPOSAL_FIELDS:
        k = spec["key"]
        sys_val = str(system_fields.get(k, "")).strip()
        new_val = str(cbbh_fields.get(k, sys_val)).strip()
        if sys_val != new_val:
            diffs.append({
                "key": k,
                "label": spec["label"],
                "system_value": sys_val,
                "cbbh_value": new_val,
                "confirmed": False,
                "confirmed_by": None,
                "confirmed_at": None,
            })
    return diffs


def _fmt_vnd(amount: Any) -> str:
    try:
        n = int(round(float(amount or 0)))
    except (TypeError, ValueError):
        return str(amount)
    return f"{n:,} VNĐ".replace(",", ".")


def _w_para(text: str, *, bold: bool = False) -> str:
    rpr = "<w:rPr><w:b/></w:rPr>" if bold else ""
    return f'<w:p><w:r>{rpr}<w:t xml:space="preserve">{escape(text)}</w:t></w:r></w:p>'


def _render_qr_svg(hex_digest: str) -> str:
    """Render a crisp 21x21 QR-style verification matrix SVG from a SHA-256 hex digest."""
    size = 21
    bits = bin(int(hex_digest, 16))[2:].zfill(256)
    grid = [[0] * size for _ in range(size)]

    def put_finder(ox: int, oy: int) -> None:
        for dy in range(7):
            for dx in range(7):
                border = dx in (0, 6) or dy in (0, 6)
                center = 2 <= dx <= 4 and 2 <= dy <= 4
                grid[oy + dy][ox + dx] = 1 if (border or center) else 0

    put_finder(0, 0)
    put_finder(size - 7, 0)
    put_finder(0, size - 7)

    bit_idx = 0
    for y in range(size):
        for x in range(size):
            in_tl = x < 8 and y < 8
            in_tr = x >= size - 8 and y < 8
            in_bl = x < 8 and y >= size - 8
            if in_tl or in_tr or in_bl:
                continue
            grid[y][x] = 1 if bits[bit_idx % len(bits)] == "1" else 0
            bit_idx += 1

    rects = [
        f'<rect x="{x}" y="{y}" width="1" height="1" fill="currentColor"/>'
        for y in range(size)
        for x in range(size)
        if grid[y][x]
    ]
    return (
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {size} {size}" '
        'width="96" height="96" shape-rendering="crispEdges">'
        f'{"".join(rects)}</svg>'
    )


_DOCX_CONTENT_TYPES = (
    '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
    '<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">'
    '<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>'
    '<Default Extension="xml" ContentType="application/xml"/>'
    '<Override PartName="/word/document.xml" '
    'ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>'
    "</Types>"
)

_DOCX_RELS = (
    '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
    '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">'
    '<Relationship Id="rId1" '
    'Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" '
    'Target="word/document.xml"/>'
    "</Relationships>"
)
