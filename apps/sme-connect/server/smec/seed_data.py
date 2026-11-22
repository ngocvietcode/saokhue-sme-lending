"""Seed builder for realistic SME Connect demo dossiers (100% self-contained in `apps/sme-connect/data`).

Creates minimal valid PDF & Excel files on disk inside `apps/sme-connect/data/cases/<case_id>/files/`
so document preview, Side-by-Side PDF Bounding-Box (`🔍 Đối chiếu`), Excel Mẫu B4 download/re-upload,
and Proposal QR/Diff work immediately on first launch.
"""

from __future__ import annotations

from typing import Any


def make_minimal_pdf(title: str, lines: list[str]) -> bytes:
    """Create a valid, lightweight 2-page PDF file using pure ASCII/transliterated text streams for preview."""
    def _ascii(s: str) -> str:
        repl = str.maketrans(
            "àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ"
            "ÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐ",
            "aaaaaaaaaaaaaaaaaeeeeeeeeeeeiiiiiooooooooooooooooouuuuuuuuuuuyyyyyd"
            "AAAAAAAAAAAAAAAAAEEEEEEEEEEEIIIIIOOOOOOOOOOOOOOOOOUUUUUUUUUUUYYYYYD",
        )
        cleaned = s.translate(repl)
        return "".join(ch if 32 <= ord(ch) < 127 else " " for ch in cleaned).replace("(", "[").replace(")", "]")

    stream_lines = ["BT", "/F1 13 Tf", "48 760 Td", f"({_ascii(title)}) Tj", "/F1 10 Tf"]
    for ln in lines[:24]:
        stream_lines.append("0 -22 Td")
        stream_lines.append(f"({_ascii(ln)}) Tj")
    stream_lines.append("ET")
    content = "\n".join(stream_lines).encode("ascii")

    objs = [
        b"1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj\n",
        b"2 0 obj << /Type /Pages /Kids [3 0 R] /Count 1 >> endobj\n",
        b"3 0 obj << /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >> endobj\n",
        b"4 0 obj << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> endobj\n",
        f"5 0 obj << /Length {len(content)} >> stream\n".encode("ascii") + content + b"\nendstream endobj\n",
    ]
    header = b"%PDF-1.4\n"
    offsets = []
    pos = len(header)
    for o in objs:
        offsets.append(pos)
        pos += len(o)
    xref = [f"xref\n0 {len(objs) + 1}\n0000000000 65535 f \n".encode("ascii")]
    for off in offsets:
        xref.append(f"{off:010d} 00000 n \n".encode("ascii"))
    trailer = f"trailer << /Size {len(objs) + 1} /Root 1 0 R >>\nstartxref\n{pos}\n%%EOF\n".encode("ascii")
    return header + b"".join(objs) + b"".join(xref) + trailer


def minh_phat_seed_payload() -> dict[str, Any]:
    """Flagship multi-product secured dossier (`HS-2026-0842` — Công ty TNHH Vật liệu & Xây lắp Minh Phát)."""
    return {
        "smec_id": "HS-2026-0842",
        "nclos_id": None,
        "elos_id": None,
        "flow": "A",
        "seller": {
            "user_id": "Namcvt123",
            "full_name": "Nguyễn Thành Nam",
            "dao_code": "DAO8821",
            "branch_code": "CN_DONG_DO",
            "branch_name": "VPBank CN Đông Đô — Phòng SME 1",
            "is_badbranch": False,
        },
        "customer": {
            "cif": "10948271",
            "tax_id": "0108924510",
            "name": "CÔNG TY TNHH VẬT LIỆU & XÂY LẮP MINH PHÁT",
            "legal_form": "llc_2m",
            "established": "2019-03-18",
            "charter_capital": 20_000_000_000,
            "legal_rep": "Nguyễn Văn Minh",
            "industry_code": "4663",
        },
        "request": {
            "product_code": "SME-WC",
            "amount": 17_000_000_000,
            "purpose": "working_capital",
            "term_months": 12,
            "proposal": "Cấp hạn mức gói đa sản phẩm Growth Online 15 tỷ + Thẻ TD Fast Card 2 tỷ",
        },
        "facts": {
            "years_in_operation": 7,
            "revenue_last_year": 68_200_000_000,
            "net_income_last_year": 3_420_000_000,
            "total_assets_last_year": 44_800_000_000,
            "equity_last_year": 23_600_000_000,
            "vat_revenue_12m": 67_900_000_000,
            "vat_Declared_months": 24,
            "vat_filing_frequency": "quarterly",
            "vat_files_count": 8,
            "vat_signature_valid": True,
            "fs_signature_valid": True,
            "has_collateral": True,
            "collateral_type": "real_estate",
            "collateral_value": 22_500_000_000,
            "valuation_date": "2026-09-25",
            "is_construction": True,
            "has_other_bank_accounts": True,
            "site_photos_count": 6,
            "cic_debt_group": 1,
            "ltv_pct": 66.7,
            "dscr": 1.48,
        },
        "proposed_products": [
            {
                "code": "GROWTH_ONLINE",
                "core_product_code": "SME-WC",
                "name": "Hạn mức bổ sung VLĐ — Growth Online",
                "requires_collateral": True,
                "match_score": 92,
                "proposed_limit": 15_000_000_000,
                "term_months": 12,
                "commitments_checked": True,
            },
            {
                "code": "FAST_CARD",
                "core_product_code": "SME-WC",
                "name": "Thẻ tín dụng Doanh nghiệp — Fast Card",
                "requires_collateral": False,
                "match_score": 88,
                "proposed_limit": 2_000_000_000,
                "term_months": 12,
                "commitments_checked": True,
            },
        ],
        "documents": [
            {"name": "01_DKKD_MinhPhat_lan3.pdf", "type": "dkkd", "issued_date": "2024-08-12",
             "meta": {"tax_id": "0108924510", "company_name": "CÔNG TY TNHH VẬT LIỆU & XÂY LẮP MINH PHÁT", "legal_rep": "Nguyễn Văn Minh", "charter_capital": 20_000_000_000}},
            {"name": "02_Dieu_le_MinhPhat_2022.pdf", "type": "dieu_le", "issued_date": "2022-05-10",
             "meta": {"tax_id": "0108924510", "charter_capital": 20_000_000_000}},
            {"name": "03_Danh_sach_HDTV_Bien_ban_hop.pdf", "type": "board_resolution", "issued_date": "2026-10-20",
             "meta": {"authorized_amount": 17_000_000_000}},
            {"name": "04_CCCD_DDPL_va_TV_gop_von.pdf", "type": "id_card", "issued_date": "2023-04-01", "meta": {}},
            {"name": "05_De_nghi_cap_TD_kiem_PAVV.pdf", "type": "loan_application", "issued_date": "2026-11-10", "meta": {}},
            {"name": "06_To_trinh_de_xuat_so_bo.pdf", "type": "credit_proposal", "issued_date": "2026-11-12", "meta": {}},
            {"name": "07_BCTC_2024_2025_Co_chu_ky_so.pdf", "type": "bctc_2_ky", "issued_date": "2026-03-28",
             "meta": {"tax_id": "0108924510", "periods": "2024,2025", "digital_signature": True}},
            {"name": "08_BCTC_Quy3_2026_MinhPhat.pdf", "type": "interim_fs", "issued_date": "2026-10-25", "meta": {"tax_id": "0108924510"}},
            {"name": "09_To_khai_VAT_8_Quy_2024_2025.pdf", "type": "to_khai_thue", "issued_date": "2026-01-28",
             "meta": {"tax_id": "0108924510", "filing_type": "quarterly", "periods_count": 8, "digital_signature": True}},
            {"name": "10_Bo_03_HD_Dau_Ra_kem_VAT.pdf", "type": "output_contracts", "issued_date": "2026-09-18",
             "meta": {"customer_role": "seller", "contracts_count": 3, "counterparty_tax_id": "0105523190", "invoice_matched": True}},
            {"name": "11_Bo_03_HD_Dau_Vao_kem_VAT.pdf", "type": "input_contracts", "issued_date": "2026-09-05",
             "meta": {"customer_role": "buyer", "contracts_count": 3, "counterparty_tax_id": "0101248910", "invoice_matched": True}},
            {"name": "12_Sao_ke_TK_12_thang_BIDV_VPB.pdf", "type": "sao_ke_12m", "issued_date": "2026-11-05",
             "meta": {"months_covered": 12}},
            {"name": "13_GCN_QSDD_DongAnh_HaNoi.pdf", "type": "collateral_title", "issued_date": "2021-11-15",
             "meta": {"parcel_no": "Thửa 128, Tờ bản đồ 14", "owner_name": "Nguyễn Văn Minh"}},
            {"name": "14_Bao_cao_dinh_gia_Prosland.pdf", "type": "valuation_report", "issued_date": "2026-09-25",
             "meta": {"parcel_no": "Thửa 128, Tờ bản đồ 14", "owner_name": "Nguyễn Văn Minh", "valuation_amount": 22_500_000_000}},
            {"name": "15_Anh_khao_sat_thuc_dia_06_anh.pdf", "type": "site_photos", "issued_date": "2026-11-08",
             "meta": {"photos_count": 6}},
            {"name": "16_Bao_cao_CIC_DN_va_DDPL.pdf", "type": "cic_report", "issued_date": "2026-11-14", "meta": {}},
        ],
        "entities": {
            "leaders": [
                {"name": "Nguyễn Văn Minh", "role": "Giám đốc / ĐDPL", "id_no": "001084012938", "experience_years": 12},
                {"name": "Trần Thu Hà", "role": "Phó Giám đốc Tài chính", "id_no": "001187004912", "experience_years": 9},
            ],
            "shareholders": [
                {"name": "Nguyễn Văn Minh", "id_no": "001084012938", "capital_vnd": 14_000_000_000, "ownership_pct": 70.0, "source_match": "Khớp ĐKKD lần 3"},
                {"name": "Trần Thu Hà", "id_no": "001187004912", "capital_vnd": 6_000_000_000, "ownership_pct": 30.0, "source_match": "ĐKKD lần 3 ghi 30% (Điều lệ 2022 ghi 35% — cần xác nhận)"},
            ],
            "related_parties": [
                {"name": "Công ty CP Vận tải Minh Hà", "tax_id": "0109112405", "relation": "Vợ ĐDPL góp 40% vốn", "vpb_exposure_vnd": 0, "other_exposure_vnd": 1_200_000_000},
            ],
            "buyers": [
                {"name": "Công ty CP Đầu tư Xây dựng Đô thị Hà Thành", "tax_id": "0105523190", "annual_turnover_vnd": 24_500_000_000, "payment_terms": "Chuyển khoản 45 ngày"},
                {"name": "Tổng Công ty Xây lắp Công nghiệp Thăng Long", "tax_id": "0102389120", "annual_turnover_vnd": 19_800_000_000, "payment_terms": "Chuyển khoản 30 ngày"},
                {"name": "Công ty TNHH Hạ tầng Bắc Hà", "tax_id": "0106781209", "annual_turnover_vnd": 14_200_000_000, "payment_terms": "Chuyển khoản 30 ngày"},
            ],
            "suppliers": [
                {"name": "Công ty CP Thép Hòa Phát Dung Quất — CN Miền Bắc", "tax_id": "0101248910", "annual_purchase_vnd": 28_400_000_000, "payment_terms": "TT ngay / Bảo lãnh 15 ngày"},
                {"name": "Công ty CP Xi măng Vicem Bút Sơn", "tax_id": "0700119284", "annual_purchase_vnd": 16_900_000_000, "payment_terms": "Chuyển khoản 20 ngày"},
            ],
            "invoices": [
                {"invoice_no": "0001842", "date": "2026-08-14", "direction": "Đầu ra (Bán)", "counterparty": "XD Đô thị Hà Thành", "counterparty_mst": "0105523190", "amount_vnd": 4_620_000_000, "status": "Khớp HĐ & Tổng cục Thuế"},
                {"invoice_no": "0001905", "date": "2026-09-18", "direction": "Đầu ra (Bán)", "counterparty": "Xây lắp Thăng Long", "counterparty_mst": "0102389120", "amount_vnd": 5_180_000_000, "status": "Khớp HĐ & Tổng cục Thuế"},
                {"invoice_no": "0049120", "date": "2026-09-02", "direction": "Đầu vào (Mua)", "counterparty": "Thép Hòa Phát CN MB", "counterparty_mst": "0101248910", "amount_vnd": 6_350_000_000, "status": "Khớp HĐ & Sao kê NH"},
            ],
            "guarantors": [
                {"name": "Nguyễn Văn Minh", "id_no": "001084012938", "relation": "Giám đốc / Chủ sở hữu 70%", "scope": "Toàn bộ nghĩa vụ tín dụng tại VPBank"},
                {"name": "Trần Thu Hà", "id_no": "001187004912", "relation": "Thành viên góp vốn 30%", "scope": "Toàn bộ nghĩa vụ tín dụng tại VPBank"},
            ],
            "collaterals": [
                {
                    "asset_id": "TSBD-01",
                    "asset_type": "REAL_ESTATE",
                    "type_label": "Bất động sản (QSDĐ & Nhà ở)",
                    "description": "Thửa đất số 128, Tờ bản đồ số 14, diện tích 285 m2 tại Thị trấn Đông Anh, Hà Nội",
                    "owner": "Ông Nguyễn Văn Minh & Bà Lê Thị Mai",
                    "certificate_no": "CS-DA-882910 (GCN cấp ngày 15/11/2021)",
                    "valuation_agency": "Prosland",
                    "valuation_date": "2026-09-25",
                    "valuation_vnd": 22_500_000_000,
                    "max_ltv_pct": 70,
                    "max_secured_limit_vnd": 15_750_000_000,
                },
            ],
        },
        "extractions": {
            "01_customer.dkkd_no": {"value": "0108924510", "confidence_tier": "trusted", "readonly": True,
                                    "source": {"doc_id": "D1", "doc_name": "01_DKKD_MinhPhat_lan3.pdf", "page": 1, "bbox": [0.16, 0.21, 0.52, 0.26], "snippet": "Ma so doanh nghiep: 0108924510"}},
            "01_customer.cif": {"value": "10948271", "confidence_tier": "trusted", "readonly": True,
                                "source": {"doc_id": "D1", "doc_name": "Core CIF Lookup", "page": 1, "bbox": [0.56, 0.21, 0.86, 0.26], "snippet": "Core CIF VPBank: 10948271"}},
            "01_customer.company_name": {"value": "CÔNG TY TNHH VẬT LIỆU & XÂY LẮP MINH PHÁT", "confidence_tier": "trusted",
                                         "source": {"doc_id": "D1", "doc_name": "01_DKKD_MinhPhat_lan3.pdf", "page": 1, "bbox": [0.14, 0.29, 0.88, 0.35], "snippet": "CONG TY TNHH VAT LIEU & XAY LAP MINH PHAT"}},
            "01_customer.legal_form": {"value": "Công ty TNHH hai thành viên trở lên", "confidence_tier": "trusted",
                                       "source": {"doc_id": "D1", "doc_name": "01_DKKD_MinhPhat_lan3.pdf", "page": 1, "bbox": [0.14, 0.36, 0.68, 0.40], "snippet": "Loai hinh: Cong ty TNHH hai thanh vien tro len"}},
            "01_customer.established_date": {"value": "2019-03-18", "confidence_tier": "trusted",
                                             "source": {"doc_id": "D1", "doc_name": "01_DKKD_MinhPhat_lan3.pdf", "page": 1, "bbox": [0.14, 0.41, 0.55, 0.45], "snippet": "Dang ky lan dau: 18/03/2019"}},
            "01_customer.amendment_no": {"value": "Thay đổi lần thứ 3 ngày 12/08/2024 (Cập nhật tỷ lệ góp vốn 70% - 30%)",
                                         "confidence_tier": "needs_confirm",
                                         "conflict_note": "Điều lệ scan năm 2022 ghi tỷ lệ TV2 Trần Thu Hà là 35%, ĐKKD lần 3 (2024) ghi 30%. Cần CBBH xác nhận theo ĐKKD mới nhất.",
                                         "source": {"doc_id": "D1", "doc_name": "01_DKKD_MinhPhat_lan3.pdf", "page": 1, "bbox": [0.14, 0.47, 0.84, 0.54], "snippet": "Dang ky thay doi lan thu 3: 12/08/2024 - TV Tran Thu Ha: 30.00%"}},
            "01_customer.charter_capital": {"value": 20_000_000_000, "confidence_tier": "trusted",
                                            "source": {"doc_id": "D1", "doc_name": "01_DKKD_MinhPhat_lan3.pdf", "page": 1, "bbox": [0.14, 0.56, 0.66, 0.61], "snippet": "Von dieu le: 20.000.000.000 VND"}},
            "01_customer.registered_address": {"value": "Số 125 Đường Cổ Loa, Huyện Đông Anh, TP. Hà Nội", "confidence_tier": "trusted",
                                               "source": {"doc_id": "D1", "doc_name": "01_DKKD_MinhPhat_lan3.pdf", "page": 1, "bbox": [0.14, 0.63, 0.85, 0.68], "snippet": "Dia chi tru so: So 125 Duong Co Loa, Dong Anh, Ha Noi"}},
            "01_customer.operating_address": {"value": "Kho bãi VLXD Km6 Quốc lộ 3, Đông Anh, Hà Nội (1.200 m2)",
                                              "confidence_tier": "needs_confirm",
                                              "conflict_note": "Trích xuất từ biên bản khảo sát thực địa, chưa ghi nhận chi nhánh/kho hàng trên ĐKKD.",
                                              "source": {"doc_id": "D15", "doc_name": "15_Anh_khao_sat_thuc_dia_06_anh.pdf", "page": 1, "bbox": [0.12, 0.32, 0.86, 0.40], "snippet": "Kho VLXD thuc te tai Km6 QL3 Dong Anh - Dien tich ~1.200m2"}},
            "01_customer.legal_rep_name": {"value": "Nguyễn Văn Minh", "confidence_tier": "trusted",
                                           "source": {"doc_id": "D1", "doc_name": "01_DKKD_MinhPhat_lan3.pdf", "page": 1, "bbox": [0.14, 0.70, 0.60, 0.75], "snippet": "Nguoi dai dien theo phap luat: NGUYEN VAN MINH"}},
            "01_customer.legal_rep_title": {"value": "Giám đốc", "confidence_tier": "trusted",
                                            "source": {"doc_id": "D1", "doc_name": "01_DKKD_MinhPhat_lan3.pdf", "page": 1, "bbox": [0.62, 0.70, 0.84, 0.75], "snippet": "Chuc danh: Giam doc"}},
            "01_customer.legal_rep_id": {"value": "001084012938", "confidence_tier": "trusted",
                                         "source": {"doc_id": "D4", "doc_name": "04_CCCD_DDPL_va_TV_gop_von.pdf", "page": 1, "bbox": [0.20, 0.25, 0.64, 0.32], "snippet": "So CCCD: 001084012938"}},
            "02_other.industry_code": {"value": "4663", "confidence_tier": "trusted",
                                       "source": {"doc_id": "D1", "doc_name": "01_DKKD_MinhPhat_lan3.pdf", "page": 1, "bbox": [0.14, 0.78, 0.42, 0.83], "snippet": "Ma nganh chinh: 4663"}},
            "02_other.main_business_line": {"value": "Bán buôn vật liệu xây dựng & Thi công công trình dân dụng",
                                            "confidence_tier": "needs_confirm",
                                            "conflict_note": "OCR nhận diện thêm ngành phụ 4101 (Xây dựng nhà để ở) làm kích hoạt điều kiện Báo cáo tiến độ công trình.",
                                            "source": {"doc_id": "D1", "doc_name": "01_DKKD_MinhPhat_lan3.pdf", "page": 1, "bbox": [0.14, 0.78, 0.88, 0.85], "snippet": "4663: Ban buon VLXD; 4101: Thi cong xay dung dan dung"}},
            "02_other.conditional_license": {"value": "Không thuộc ngành nghề yêu cầu giấy phép con với mảng thương mại VLXD", "confidence_tier": "trusted",
                                             "source": {"doc_id": "D6", "doc_name": "06_To_trinh_de_xuat_so_bo.pdf", "page": 1, "bbox": [0.14, 0.30, 0.82, 0.36], "snippet": "Giay phep con: Khong ap dung"}},
            "02_other.employee_count": {"value": 46, "confidence_tier": "trusted",
                                        "source": {"doc_id": "D7", "doc_name": "07_BCTC_2024_2025_Co_chu_ky_so.pdf", "page": 1, "bbox": [0.18, 0.68, 0.52, 0.73], "snippet": "So lao dong cuoi nam: 46 nguoi"}},
            "02_other.esg_risk_level": {"value": "Thấp - Trung bình (Nhóm C - Không thuộc danh mục loại trừ MTXH)", "confidence_tier": "trusted",
                                        "source": {"doc_id": "D6", "doc_name": "06_To_trinh_de_xuat_so_bo.pdf", "page": 1, "bbox": [0.14, 0.40, 0.82, 0.46], "snippet": "Phan loai MTXH: Rui ro Thap"}},
            "02_other.years_in_operation": {"value": 7, "confidence_tier": "trusted",
                                            "source": {"doc_id": "D1", "doc_name": "01_DKKD_MinhPhat_lan3.pdf", "page": 1, "bbox": [0.14, 0.41, 0.55, 0.45], "snippet": "7 nam hoat dong (tu 2019)"}},
            "03_business.business_model": {"value": "Phân phối thép/xi măng từ nhà máy cấp 1 cho nhà thầu xây dựng & nhận thầu phụ phần thô", "confidence_tier": "trusted",
                                           "source": {"doc_id": "D5", "doc_name": "05_De_nghi_cap_TD_kiem_PAVV.pdf", "page": 1, "bbox": [0.12, 0.28, 0.88, 0.36], "snippet": "Mo hinh SXKD: Phan phoi VLXD cap 1 & thau phu xay lap"}},
            "03_business.key_products": {"value": "Thép xây dựng Hòa Phát, Xi măng Vicem, Gạch ốp lát & thi công phần thô", "confidence_tier": "trusted",
                                         "source": {"doc_id": "D5", "doc_name": "05_De_nghi_cap_TD_kiem_PAVV.pdf", "page": 1, "bbox": [0.12, 0.38, 0.84, 0.44], "snippet": "San pham chinh: Thep Hoa Phat, Xi mang Vicem"}},
            "03_business.warehouse_area_m2": {"value": 1200, "confidence_tier": "trusted",
                                              "source": {"doc_id": "D15", "doc_name": "15_Anh_khao_sat_thuc_dia_06_anh.pdf", "page": 1, "bbox": [0.12, 0.32, 0.86, 0.40], "snippet": "Dien tich kho bai: 1.200 m2"}},
            "03_business.output_payment_terms": {"value": "Chuyển khoản qua NH, công nợ 30–45 ngày theo đợt nghiệm thu", "confidence_tier": "trusted",
                                                 "source": {"doc_id": "D10", "doc_name": "10_Bo_03_HD_Dau_Ra_kem_VAT.pdf", "page": 1, "bbox": [0.14, 0.52, 0.85, 0.58], "snippet": "Thanh toan chuyen khoan trong vong 30-45 ngay"}},
            "03_business.input_payment_terms": {"value": "Thanh toán ngay hoặc trả chậm 15–20 ngày có bảo lãnh thanh toán", "confidence_tier": "trusted",
                                                "source": {"doc_id": "D11", "doc_name": "11_Bo_03_HD_Dau_Vao_kem_VAT.pdf", "page": 1, "bbox": [0.14, 0.52, 0.85, 0.58], "snippet": "Thanh toan tra cham 15-20 ngay"}},
            "03_business.output_contracts_count": {"value": 3, "confidence_tier": "trusted",
                                                   "source": {"doc_id": "D10", "doc_name": "10_Bo_03_HD_Dau_Ra_kem_VAT.pdf", "page": 1, "bbox": [0.14, 0.22, 0.72, 0.28], "snippet": "03 Hop dong dau ra kem hoa don VAT hop le"}},
            "03_business.input_contracts_count": {"value": 3, "confidence_tier": "trusted",
                                                  "source": {"doc_id": "D11", "doc_name": "11_Bo_03_HD_Dau_Vao_kem_VAT.pdf", "page": 1, "bbox": [0.14, 0.22, 0.72, 0.28], "snippet": "03 Hop dong dau vao kem hoa don VAT hop le"}},
            "04_financial.revenue_n_1": {"value": 68_200_000_000, "confidence_tier": "trusted",
                                         "source": {"doc_id": "D7", "doc_name": "07_BCTC_2024_2025_Co_chu_ky_so.pdf", "page": 1, "bbox": [0.15, 0.30, 0.82, 0.36], "snippet": "Chi tieu 10 - Doanh thu thuan 2025: 68.200.000.000 VND"}},
            "04_financial.revenue_n_2": {"value": 57_600_000_000, "confidence_tier": "trusted",
                                         "source": {"doc_id": "D7", "doc_name": "07_BCTC_2024_2025_Co_chu_ky_so.pdf", "page": 1, "bbox": [0.15, 0.37, 0.82, 0.42], "snippet": "Chi tieu 10 - Doanh thu thuan 2024: 57.600.000.000 VND"}},
            "04_financial.net_income_n_1": {"value": 3_420_000_000, "confidence_tier": "trusted",
                                            "source": {"doc_id": "D7", "doc_name": "07_BCTC_2024_2025_Co_chu_ky_so.pdf", "page": 1, "bbox": [0.15, 0.44, 0.82, 0.49], "snippet": "Chi tieu 60 - LNST 2025: 3.420.000.000 VND"}},
            "04_financial.total_assets_n_1": {"value": 44_800_000_000, "confidence_tier": "trusted",
                                              "source": {"doc_id": "D7", "doc_name": "07_BCTC_2024_2025_Co_chu_ky_so.pdf", "page": 1, "bbox": [0.15, 0.51, 0.82, 0.56], "snippet": "Chi tieu 270 - Tong tai san: 44.800.000.000 VND"}},
            "04_financial.equity_n_1": {"value": 23_600_000_000, "confidence_tier": "trusted",
                                        "source": {"doc_id": "D7", "doc_name": "07_BCTC_2024_2025_Co_chu_ky_so.pdf", "page": 1, "bbox": [0.15, 0.58, 0.82, 0.63], "snippet": "Chi tieu 400 - Von chu so huu: 23.600.000.000 VND"}},
            "04_financial.vat_revenue_12m": {"value": 67_900_000_000, "confidence_tier": "needs_confirm",
                                             "conflict_note": "Doanh thu VAT 4 quý (67,9 tỷ) chênh 0,44% so với BCTC (68,2 tỷ) do 1 hóa đơn điều chỉnh cuối kỳ — cần CBBH xác nhận.",
                                             "source": {"doc_id": "D9", "doc_name": "09_To_khai_VAT_8_Quy_2024_2025.pdf", "page": 1, "bbox": [0.14, 0.34, 0.84, 0.41], "snippet": "Tong doanh thu HHDV ban ra 4 quy 2025: 67.900.000.000 VND"}},
            "04_financial.vat_filing_periods": {"value": "Đủ 08 quý liên tiếp (Q1/2024 – Q4/2025), chữ ký số hợp lệ", "confidence_tier": "trusted",
                                                "source": {"doc_id": "D9", "doc_name": "09_To_khai_VAT_8_Quy_2024_2025.pdf", "page": 1, "bbox": [0.14, 0.24, 0.84, 0.30], "snippet": "Chuoi ky khai thue: Q1/2024 -> Q4/2025 (8 to khai)"}},
            "04_financial.bank_inflow_12m": {"value": 71_400_000_000, "confidence_tier": "trusted",
                                             "source": {"doc_id": "D12", "doc_name": "12_Sao_ke_TK_12_thang_BIDV_VPB.pdf", "page": 1, "bbox": [0.14, 0.42, 0.84, 0.48], "snippet": "Tong phat sinh Co 12 thang: 71.400.000.000 VND"}},
            "06_blcn.primary_guarantor_name": {"value": "Nguyễn Văn Minh", "confidence_tier": "trusted",
                                               "source": {"doc_id": "D5", "doc_name": "05_De_nghi_cap_TD_kiem_PAVV.pdf", "page": 1, "bbox": [0.14, 0.62, 0.78, 0.67], "snippet": "Nguoi bao lanh ca nhan: Ong Nguyen Van Minh"}},
            "06_blcn.primary_guarantor_id": {"value": "001084012938", "confidence_tier": "trusted",
                                             "source": {"doc_id": "D4", "doc_name": "04_CCCD_DDPL_va_TV_gop_von.pdf", "page": 1, "bbox": [0.20, 0.25, 0.64, 0.32], "snippet": "CCCD: 001084012938"}},
            "06_blcn.primary_guarantor_relation": {"value": "Giám đốc / Thành viên góp vốn 70%", "confidence_tier": "trusted",
                                                   "source": {"doc_id": "D1", "doc_name": "01_DKKD_MinhPhat_lan3.pdf", "page": 1, "bbox": [0.14, 0.70, 0.80, 0.75], "snippet": "Giam doc - So huu 70% von dieu le"}},
            "06_blcn.guarantee_scope": {"value": "Bảo lãnh vô điều kiện, không hủy ngang cho toàn bộ nghĩa vụ tín dụng", "confidence_tier": "trusted",
                                        "source": {"doc_id": "D5", "doc_name": "05_De_nghi_cap_TD_kiem_PAVV.pdf", "page": 1, "bbox": [0.14, 0.68, 0.86, 0.74], "snippet": "Pham vi bao lanh: Toan bo nghia vu goc, lai, phi"}},
            "06_blcn.collateral_total_valuation": {"value": 22_500_000_000, "confidence_tier": "trusted",
                                                   "source": {"doc_id": "D14", "doc_name": "14_Bao_cao_dinh_gia_Prosland.pdf", "page": 1, "bbox": [0.16, 0.35, 0.84, 0.42], "snippet": "Gia tri dinh gia Prosland: 22.500.000.000 VND"}},
            "06_blcn.collateral_asset_summary": {"value": "01 BĐS Đất ở + Nhà tại Đông Anh, Hà Nội (285 m2, LTV tối đa 70% = 15,75 tỷ)", "confidence_tier": "trusted",
                                                 "source": {"doc_id": "D13", "doc_name": "13_GCN_QSDD_DongAnh_HaNoi.pdf", "page": 1, "bbox": [0.16, 0.28, 0.85, 0.34], "snippet": "GCN QSDD Thua 128 To ban do 14 - 285 m2 Dong Anh"}},
        },
    }


def sao_viet_unsecured_seed_payload() -> dict[str, Any]:
    """Second demo dossier (`HS-2026-0819` — 100% unsecured `Fast Card + Vay hoá đơn`, auto-hides `06 · BLCN`)."""
    return {
        "smec_id": "HS-2026-0819",
        "nclos_id": "NCLOS-0000115420",
        "elos_id": "ELOS-2026-87901",
        "flow": "A",
        "seller": {
            "user_id": "Namcvt123",
            "full_name": "Nguyễn Thành Nam",
            "dao_code": "DAO8821",
            "branch_code": "CN_DONG_DO",
            "branch_name": "VPBank CN Đông Đô — Phòng SME 1",
            "is_badbranch": False,
        },
        "customer": {
            "cif": "11204918",
            "tax_id": "0109412800",
            "name": "CÔNG TY CỔ PHẦN GIẢI PHÁP SỐ SAO VIỆT",
            "legal_form": "jsc",
            "established": "2020-07-08",
            "charter_capital": 12_000_000_000,
            "legal_rep": "Đỗ Hoàng Long",
            "industry_code": "6201",
        },
        "request": {
            "product_code": "SME-TRADE",
            "amount": 6_500_000_000,
            "purpose": "trade_finance",
            "term_months": 9,
            "proposal": "Gói tín chấp Vay hoá đơn 5 tỷ + Thẻ Fast Card 1,5 tỷ",
        },
        "facts": {
            "years_in_operation": 6,
            "revenue_last_year": 38_500_000_000,
            "net_income_last_year": 4_120_000_000,
            "total_assets_last_year": 21_400_000_000,
            "equity_last_year": 15_200_000_000,
            "vat_revenue_12m": 38_500_000_000,
            "vat_filing_frequency": "quarterly",
            "vat_files_count": 8,
            "vat_signature_valid": True,
            "fs_signature_valid": True,
            "has_collateral": False,
            "site_photos_count": 5,
            "cic_debt_group": 1,
            "dscr": 1.92,
        },
        "proposed_products": [
            {
                "code": "INVOICE_LOAN",
                "core_product_code": "SME-TRADE",
                "name": "Tài trợ Hoá đơn đầu ra — Vay hoá đơn",
                "requires_collateral": False,
                "match_score": 94,
                "proposed_limit": 5_000_000_000,
                "term_months": 9,
                "commitments_checked": True,
            },
            {
                "code": "FAST_CARD",
                "core_product_code": "SME-WC",
                "name": "Thẻ tín dụng Doanh nghiệp — Fast Card",
                "requires_collateral": False,
                "match_score": 91,
                "proposed_limit": 1_500_000_000,
                "term_months": 12,
                "commitments_checked": True,
            },
        ],
        "documents": [
            {"name": "01_DKKD_SaoViet_CTCP.pdf", "type": "dkkd", "issued_date": "2024-03-10",
             "meta": {"tax_id": "0109412800", "company_name": "CÔNG TY CỔ PHẦN GIẢI PHÁP SỐ SAO VIỆT", "legal_rep": "Đỗ Hoàng Long"}},
            {"name": "02_Dieu_le_va_So_co_dong.pdf", "type": "shareholder_register", "issued_date": "2025-05-12", "meta": {"tax_id": "0109412800"}},
            {"name": "03_BCTC_2024_2025_SaoViet.pdf", "type": "bctc_2_ky", "issued_date": "2026-03-20",
             "meta": {"tax_id": "0109412800", "periods": "2024,2025", "digital_signature": True}},
            {"name": "04_To_khai_VAT_8_Quy_SaoViet.pdf", "type": "to_khai_thue", "issued_date": "2026-01-25",
             "meta": {"tax_id": "0109412800", "filing_type": "quarterly", "periods_count": 8, "digital_signature": True}},
            {"name": "05_Bo_03_HD_PhanMem_DauRa_VAT.pdf", "type": "output_contracts", "issued_date": "2026-10-02",
             "meta": {"customer_role": "seller", "contracts_count": 3, "counterparty_tax_id": "0100109106", "invoice_matched": True}},
        ],
        "entities": {
            "leaders": [{"name": "Đỗ Hoàng Long", "role": "Tổng Giám đốc / ĐDPL", "id_no": "001088029104", "experience_years": 10}],
            "shareholders": [
                {"name": "Đỗ Hoàng Long", "id_no": "001088029104", "capital_vnd": 7_200_000_000, "ownership_pct": 60.0, "source_match": "Khớp Sổ cổ đông"},
                {"name": "Vũ Minh Châu", "id_no": "001190012841", "capital_vnd": 4_800_000_000, "ownership_pct": 40.0, "source_match": "Khớp Sổ cổ đông"},
            ],
            "related_parties": [],
            "buyers": [{"name": "Tập đoàn Viễn thông & CNTT Miền Bắc", "tax_id": "0100109106", "annual_turnover_vnd": 18_500_000_000, "payment_terms": "Chuyển khoản 30 ngày"}],
            "suppliers": [{"name": "Công ty TNHH Hạ tầng Cloud Việt Nam", "tax_id": "0107119201", "annual_purchase_vnd": 8_200_000_000, "payment_terms": "Thanh toán hàng tháng"}],
            "invoices": [{"invoice_no": "0000812", "date": "2026-10-02", "direction": "Đầu ra (Bán)", "counterparty": "Viễn thông CNTT MB", "counterparty_mst": "0100109106", "amount_vnd": 3_850_000_000, "status": "Khớp HĐ & Thuế"}],
            "guarantors": [],
            "collaterals": [],
        },
        "extractions": {
            "01_customer.dkkd_no": {"value": "0109412800", "confidence_tier": "trusted", "readonly": True,
                                    "source": {"doc_id": "D1", "doc_name": "01_DKKD_SaoViet_CTCP.pdf", "page": 1, "bbox": [0.16, 0.21, 0.52, 0.26], "snippet": "Ma so DN: 0109412800"}},
            "01_customer.cif": {"value": "11204918", "confidence_tier": "trusted", "readonly": True,
                                "source": {"doc_id": "D1", "doc_name": "Core CIF Lookup", "page": 1, "bbox": [0.56, 0.21, 0.86, 0.26], "snippet": "Core CIF: 11204918"}},
            "01_customer.company_name": {"value": "CÔNG TY CỔ PHẦN GIẢI PHÁP SỐ SAO VIỆT", "confidence_tier": "trusted",
                                         "source": {"doc_id": "D1", "doc_name": "01_DKKD_SaoViet_CTCP.pdf", "page": 1, "bbox": [0.14, 0.29, 0.88, 0.35], "snippet": "CONG TY CO PHAN GIAI PHAP SO SAO VIET"}},
            "01_customer.legal_form": {"value": "Công ty cổ phần", "confidence_tier": "trusted",
                                       "source": {"doc_id": "D1", "doc_name": "01_DKKD_SaoViet_CTCP.pdf", "page": 1, "bbox": [0.14, 0.36, 0.58, 0.40], "snippet": "Cong ty co phan"}},
            "01_customer.established_date": {"value": "2020-07-08", "confidence_tier": "trusted",
                                             "source": {"doc_id": "D1", "doc_name": "01_DKKD_SaoViet_CTCP.pdf", "page": 1, "bbox": [0.14, 0.41, 0.55, 0.45], "snippet": "Ngay thanh lap: 08/07/2020"}},
            "01_customer.charter_capital": {"value": 12_000_000_000, "confidence_tier": "trusted",
                                            "source": {"doc_id": "D1", "doc_name": "01_DKKD_SaoViet_CTCP.pdf", "page": 1, "bbox": [0.14, 0.56, 0.66, 0.61], "snippet": "Von dieu le: 12.000.000.000 VND"}},
            "01_customer.legal_rep_name": {"value": "Đỗ Hoàng Long", "confidence_tier": "trusted",
                                           "source": {"doc_id": "D1", "doc_name": "01_DKKD_SaoViet_CTCP.pdf", "page": 1, "bbox": [0.14, 0.70, 0.60, 0.75], "snippet": "DDPL: DO HOANG LONG"}},
            "02_other.industry_code": {"value": "6201", "confidence_tier": "trusted",
                                       "source": {"doc_id": "D1", "doc_name": "01_DKKD_SaoViet_CTCP.pdf", "page": 1, "bbox": [0.14, 0.78, 0.42, 0.83], "snippet": "Ma nganh: 6201"}},
            "04_financial.revenue_n_1": {"value": 38_500_000_000, "confidence_tier": "trusted",
                                         "source": {"doc_id": "D3", "doc_name": "03_BCTC_2024_2025_SaoViet.pdf", "page": 1, "bbox": [0.15, 0.30, 0.82, 0.36], "snippet": "Doanh thu 2025: 38.500.000.000 VND"}},
        },
        "detail_status": "PENDING_NEGOTIATION",
        "list_status": "INITIATING",
    }
