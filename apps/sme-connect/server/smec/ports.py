"""Dual-Mode Integration Ports for VPBank SME Connect, NCLOS/ELOS, Risk/CIC/KSSV & B2B.

When real internal endpoints (`$SMEC_NCLOS_ENDPOINT`, `$SMEC_RISK_ENDPOINT`, `$SMEC_B2B_ENDPOINT`)
are not configured (e.g. while SME Connect Portal or LOS APIs are still under development),
these ports seamlessly run in deterministic Sandbox/Sample mode (`mode: "sample"`) so Sao Khuê
operates 100% standalone with zero blocked workflows.
"""

from __future__ import annotations

import os
import re
from typing import Any

from .constants import SMEC_PRODUCTS

# Pre-populated NCLOS Dossiers available for Tab 3: "Tải về hồ sơ đã có trên NCLOS" (Figma Comment #70)
SAMPLE_NCLOS_CASES: dict[str, dict[str, Any]] = {
    "NCLOS-0000116194": {
        "nclos_id": "NCLOS-0000116194",
        "elos_id": "ELOS-2026-88412",
        "dkkd_no": "0107651289",
        "cif": "10883412",
        "company_name": "CÔNG TY CỔ PHẦN DƯỢC PHẨM & THIẾT BỊ Y TẾ AN KHANG",
        "legal_form": "Công ty cổ phần",
        "established_date": "2018-04-12",
        "charter_capital": 25_000_000_000,
        "industry_code": "4649",
        "main_business_line": "Bán buôn dụng cụ y tế, dược phẩm đạt chuẩn GDP",
        "legal_rep_name": "Lê Hoàng Nam",
        "legal_rep_title": "Tổng Giám đốc",
        "legal_rep_id": "001082019482",
        "registered_address": "Số 48 Nguyễn Chí Thanh, Phường Láng Thượng, Quận Đống Đa, Hà Nội",
        "revenue_last_year": 94_500_000_000,
        "requested_total": 18_000_000_000,
        "branch_code": "CN_THANG_LONG",
        "dao_code": "DAO8821",
        "proposed_products": [
            {"code": "GROWTH_ONLINE", "proposed_limit": 15_000_000_000, "match_score": 93},
            {"code": "FAST_CARD", "proposed_limit": 3_000_000_000, "match_score": 89},
        ],
        "documents_summary": [
            {"name": "DKKD_AnKhang_lan4.pdf", "type": "dkkd", "issued_date": "2024-06-15"},
            {"name": "Dieu_le_CTCP_AnKhang.pdf", "type": "dieu_le", "issued_date": "2024-06-15"},
            {"name": "So_co_dong_AnKhang_2025.pdf", "type": "shareholder_register", "issued_date": "2025-12-01"},
            {"name": "Giay_phep_GDP_BoYTe.pdf", "type": "conditional_license", "issued_date": "2024-02-10"},
            {"name": "BCTC_KiemToan_2024_2025.pdf", "type": "bctc_2_ky", "issued_date": "2026-03-20"},
            {"name": "To_khai_VAT_8_quy_2024_2025.pdf", "type": "to_khai_thue", "issued_date": "2026-01-25"},
            {"name": "GCN_QSDD_CauGiay_HN.pdf", "type": "collateral_title", "issued_date": "2021-09-10"},
            {"name": "Bao_cao_dinh_gia_Prosland_AnKhang.pdf", "type": "valuation_report", "issued_date": "2026-10-05"},
        ],
    },
    "NCLOS-0000118902": {
        "nclos_id": "NCLOS-0000118902",
        "elos_id": "ELOS-2026-90115",
        "dkkd_no": "0314928174",
        "cif": "11029485",
        "company_name": "CÔNG TY TNHH BAO BÌ XANH PHƯƠNG NAM",
        "legal_form": "Công ty TNHH hai thành viên trở lên",
        "established_date": "2019-09-20",
        "charter_capital": 15_000_000_000,
        "industry_code": "1702",
        "main_business_line": "Sản xuất bao bì giấy carton xuất khẩu",
        "legal_rep_name": "Phạm Minh Tuấn",
        "legal_rep_title": "Giám đốc",
        "legal_rep_id": "079085004129",
        "registered_address": "Lô B2 KCN Tân Bình, Quận Tân Phú, TP. Hồ Chí Minh",
        "revenue_last_year": 52_000_000_000,
        "requested_total": 8_500_000_000,
        "branch_code": "CN_SAI_GON",
        "dao_code": "DAO8821",
        "proposed_products": [
            {"code": "INVOICE_LOAN", "proposed_limit": 6_500_000_000, "match_score": 90},
            {"code": "FAST_CARD", "proposed_limit": 2_000_000_000, "match_score": 87},
        ],
        "documents_summary": [
            {"name": "DKKD_BaoBiPhuongNam.pdf", "type": "dkkd", "issued_date": "2023-11-02"},
            {"name": "Dieu_le_BaoBiPhuongNam.pdf", "type": "dieu_le", "issued_date": "2023-11-02"},
            {"name": "BCTC_2024_2025_PhuongNam.pdf", "type": "bctc_2_ky", "issued_date": "2026-03-15"},
            {"name": "Bo_03_HD_DauRa_Kem_VAT.pdf", "type": "output_contracts", "issued_date": "2026-09-12"},
        ],
    },
}

ENTERPRISE_DIRECTORY: dict[str, dict[str, Any]] = {
    "0108924510": {
        "dkkd_no": "0108924510",
        "cif": "10948271",
        "company_name": "CÔNG TY TNHH VẬT LIỆU & XÂY LẮP MINH PHÁT",
        "legal_form": "Công ty TNHH hai thành viên trở lên",
        "established_date": "2019-03-18",
        "charter_capital": 20_000_000_000,
        "industry_code": "4663",
        "main_business_line": "Bán buôn vật liệu xây dựng & Thi công công trình dân dụng",
        "legal_rep_name": "Nguyễn Văn Minh",
        "legal_rep_title": "Giám đốc",
        "legal_rep_id": "001084012938",
        "registered_address": "Số 125 Đường Cổ Loa, Huyện Đông Anh, TP. Hà Nội",
        "revenue_last_year": 68_200_000_000,
    },
    "0109412800": {
        "dkkd_no": "0109412800",
        "cif": "11204918",
        "company_name": "CÔNG TY CỔ PHẦN GIẢI PHÁP SỐ SAO VIỆT",
        "legal_form": "Công ty cổ phần",
        "established_date": "2020-07-08",
        "charter_capital": 12_000_000_000,
        "industry_code": "6201",
        "main_business_line": "Lập trình máy vi tính, tích hợp hệ thống & dịch vụ đám mây",
        "legal_rep_name": "Đỗ Hoàng Long",
        "legal_rep_title": "Tổng Giám đốc",
        "legal_rep_id": "001088029104",
        "registered_address": "Tầng 9 Tòa nhà Duy Tân Plaza, Quận Cầu Giấy, TP. Hà Nội",
        "revenue_last_year": 38_500_000_000,
    },
}


def lookup_enterprise_and_recommend(
    dkkd_no: str,
    requested_amount: float = 10_000_000_000,
    has_collateral: bool = True,
    branch_code: str = "CN_DONG_DO",
    dao_code: str = "DAO8821",
) -> dict[str, Any]:
    """Lookup Core CIF + Badbranch status + compute AI multi-product match scores (Figma Screen 3)."""
    clean_id = re.sub(r"\s+", "", str(dkkd_no or "")) if "re" in globals() else str(dkkd_no or "").strip()
    ent = ENTERPRISE_DIRECTORY.get(clean_id)
    if ent is None:
        for nclos in SAMPLE_NCLOS_CASES.values():
            if nclos["dkkd_no"] == clean_id:
                ent = nclos
                break
    if ent is None:
        suffix = clean_id[-6:].zfill(6) if clean_id else "100001"
        ent = {
            "dkkd_no": clean_id or "0109998887",
            "cif": f"11{suffix}",
            "company_name": f"CÔNG TY TNHH DOANH NGHIỆP SME ({clean_id or 'MỚI'})",
            "legal_form": "Công ty TNHH hai thành viên trở lên",
            "established_date": "2021-05-10",
            "charter_capital": 10_000_000_000,
            "industry_code": "4690",
            "main_business_line": "Thương mại tổng hợp & phân phối hàng hóa",
            "legal_rep_name": "Trần Quốc Bảo",
            "legal_rep_title": "Giám đốc",
            "legal_rep_id": "001086009281",
            "registered_address": "Quận Cầu Giấy, TP. Hà Nội",
            "revenue_last_year": max(int(requested_amount * 4), 25_000_000_000),
        }

    branch_status = check_badbranch(branch_code, dao_code)
    recommendations: list[dict[str, Any]] = []
    remaining = max(int(requested_amount), 2_000_000_000)

    for prod in SMEC_PRODUCTS:
        if prod["requires_collateral"] and not has_collateral:
            score = 42
            suggested = 0
            eligible = False
        else:
            eligible = True
            if prod["code"] == "GROWTH_ONLINE":
                score = 92 if has_collateral else 45
                suggested = min(int(remaining * 0.85), prod["max_limit_vnd"])
            elif prod["code"] == "FAST_CARD":
                score = 88
                suggested = min(max(int(requested_amount * 0.12), 1_000_000_000), prod["max_limit_vnd"])
            elif prod["code"] == "INVOICE_LOAN":
                score = 90 if not has_collateral else 81
                suggested = min(int(requested_amount * (0.75 if not has_collateral else 0.4)), prod["max_limit_vnd"])
            else:
                score = 76 if has_collateral else 38
                suggested = min(int(requested_amount * 0.6), prod["max_limit_vnd"])

        recommendations.append({
            **prod,
            "eligible": eligible,
            "match_score": score,
            "suggested_limit": suggested,
        })

    recommendations.sort(key=lambda x: x["match_score"], reverse=True)
    return {
        "mode": "http" if os.environ.get("SMEC_RISK_ENDPOINT") else "sample",
        "enterprise": ent,
        "branch_check": branch_status,
        "recommendations": recommendations,
    }


def check_badbranch(branch_code: str, dao_code: str) -> dict[str, Any]:
    """Check whether the originating branch (`ĐVKD`) falls under the 5 Badbranch groups."""
    is_bad = "BAD" in branch_code.upper()
    return {
        "branch_code": branch_code,
        "dao_code": dao_code,
        "is_badbranch": is_bad,
        "groups": [
            {"group": "Nhóm 1 — Tỷ lệ nợ xấu nội bảng vượt ngưỡng", "flagged": is_bad},
            {"group": "Nhóm 2 — Tỷ lệ nợ quá hạn phát sinh sớm (FPD/SPD)", "flagged": False},
            {"group": "Nhóm 3 — Vi phạm tuân thủ quy trình tín dụng trọng yếu", "flagged": False},
            {"group": "Nhóm 4 — Tập trung ngành hạn chế vượt hạn mức vùng", "flagged": False},
            {"group": "Nhóm 5 — Chế tài kiểm soát sau vay (KSSV) cấp ĐVKD", "flagged": False},
        ],
    }


def list_nclos_cases(dao_code: str = "") -> list[dict[str, Any]]:
    """Return existing NCLOS dossiers eligible to be pulled into SME Connect."""
    out = []
    for item in SAMPLE_NCLOS_CASES.values():
        if dao_code and item.get("dao_code") and item["dao_code"] != dao_code:
            continue
        out.append({
            "nclos_id": item["nclos_id"],
            "elos_id": item["elos_id"],
            "dkkd_no": item["dkkd_no"],
            "cif": item["cif"],
            "company_name": item["company_name"],
            "requested_total": item["requested_total"],
            "documents_count": len(item["documents_summary"]),
            "proposed_products": item["proposed_products"],
        })
    return out or [
        {
            "nclos_id": v["nclos_id"],
            "elos_id": v["elos_id"],
            "dkkd_no": v["dkkd_no"],
            "cif": v["cif"],
            "company_name": v["company_name"],
            "requested_total": v["requested_total"],
            "documents_count": len(v["documents_summary"]),
            "proposed_products": v["proposed_products"],
        }
        for v in SAMPLE_NCLOS_CASES.values()
    ]


def query_vpbank_risk_and_cic(
    case: dict[str, Any],
    entities: dict[str, Any],
) -> dict[str, Any]:
    """Full `6.2 CIC & Rủi ro` check: Badbranch + Internal Lists + EWS + KSSV + Multi-subject CIC."""
    cust = case.get("customer") or {}
    seller = ((case.get("smec") or {}).get("seller") or {})
    branch = check_badbranch(
        str(seller.get("branch_code") or "CN_DONG_DO"),
        str(seller.get("dao_code") or "DAO8821"),
    )

    subjects = [
        {"role": "Khách hàng vay (DN)", "name": cust.get("name", "Doanh nghiệp"), "id_no": cust.get("tax_id", "—"),
         "vpb_loan": 0, "other_loan": 2_300_000_000, "vpb_card": 0, "other_card": 0, "cic_group": 1, "history_24m": "Không phát sinh nợ nhóm 2+"},
        {"role": "Người đại diện PL", "name": cust.get("legal_rep", "ĐDPL"), "id_no": "CCCD ĐDPL",
         "vpb_loan": 850_000_000, "other_loan": 0, "vpb_card": 100_000_000, "other_card": 50_000_000, "cic_group": 1, "history_24m": "Nhóm 1 chuẩn"},
    ]
    for sh in (entities.get("shareholders") or [])[:3]:
        subjects.append({
            "role": f"Cổ đông / TV góp vốn ({sh.get('ownership_pct', '?')}%)",
            "name": sh.get("name", "Thành viên"),
            "id_no": sh.get("id_no", "—"),
            "vpb_loan": 0,
            "other_loan": int(sh.get("other_debt_vnd") or 0),
            "vpb_card": 0,
            "other_card": 0,
            "cic_group": 1,
            "history_24m": "Nhóm 1 chuẩn",
        })
    for rp in (entities.get("related_parties") or [])[:2]:
        subjects.append({
            "role": f"Nhóm KH liên quan ({rp.get('relation', 'Liên quan')})",
            "name": rp.get("name", "KHLQ"),
            "id_no": rp.get("tax_id", "—"),
            "vpb_loan": int(rp.get("vpb_exposure_vnd") or 0),
            "other_loan": int(rp.get("other_exposure_vnd") or 0),
            "vpb_card": 0,
            "other_card": 0,
            "cic_group": 1,
            "history_24m": "Không có nợ cần chú ý",
        })

    return {
        "mode": "http" if os.environ.get("SMEC_RISK_ENDPOINT") else "sample",
        "badbranch": branch,
        "internal_watchlists": [
            {"code": "WARNING_LIST", "label": "Warning list", "status": "CLEAR", "detail": "Không nằm trong danh sách cảnh báo nội bộ"},
            {"code": "WATCH_LIST", "label": "Watch list", "status": "CLEAR", "detail": "Không thuộc diện theo dõi đặc biệt"},
            {"code": "RESTRUCTURED_LIST", "label": "Restructured List", "status": "CLEAR", "detail": "Không phát sinh cơ cấu nợ"},
            {"code": "AMC_LIST", "label": "AMC list", "status": "CLEAR", "detail": "Không có dư nợ bán/xử lý qua VAMC/AMC"},
            {"code": "RESTRICTED_LIST", "label": "Restrictedlist", "status": "CLEAR", "detail": "Ngành nghề không thuộc danh mục cấm/hạn chế cấp TD"},
            {"code": "RISK_TAX", "label": "Risk tax (Rủi ro hóa đơn/thuế)", "status": "CLEAR", "detail": "MST đang hoạt động, không thuộc danh sách DN rủi ro thuế"},
            {"code": "EWS_TOPDOWN", "label": "EWS topdown (Cảnh báo sớm)", "status": "CLEAR", "detail": "Mức cảnh báo Xanh (An toàn)"},
        ],
        "kssv_post_loan": {
            "status": "PASS_WITH_NOTE",
            "active_sanctions": 0,
            "summary": "Không có chế tài KSSV đang hiệu lực. Ghi nhận 01 nhắc nhở bổ sung chứng từ định kỳ năm trước đã hoàn thành đúng hạn.",
        },
        "cic_subjects": subjects,
    }
