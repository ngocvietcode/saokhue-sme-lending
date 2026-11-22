"""Canonical constants, product definitions, status lifecycle and OCR schema metadata for SME Connect."""

from __future__ import annotations

from typing import Any

# 1. Dual Status Lifecycle (matching Figma `List all trạng thái hồ sơ` 434:14889)
LIST_STATUSES: dict[str, dict[str, str]] = {
    "DRAFT": {"label": "Lưu nháp", "tone": "muted"},
    "INITIATING": {"label": "Đang khởi tạo", "tone": "info"},
    "APPROVED": {"label": "Đã phê duyệt", "tone": "ok"},
    "REJECTED": {"label": "Bị từ chối", "tone": "danger"},
}

DETAIL_STATUSES: dict[str, dict[str, str]] = {
    "PROCESSING": {"label": "Đang xử lý", "tone": "warn", "list_status": "DRAFT"},
    "PENDING_APPROVAL": {"label": "Chờ phê duyệt", "tone": "warn", "list_status": "INITIATING"},
    "PENDING_NEGOTIATION": {"label": "Chờ thương lượng", "tone": "warn", "list_status": "INITIATING"},
    "COMPLETED": {"label": "Đã hoàn tất", "tone": "ok", "list_status": "APPROVED"},
    "CANCELLED_BY_SALE": {"label": "Sale Huỷ hồ sơ", "tone": "danger", "list_status": "REJECTED"},
    "REJECTED": {"label": "Hồ sơ bị từ chối", "tone": "danger", "list_status": "REJECTED"},
    "EXPIRED": {"label": "Hết hiệu lực", "tone": "danger", "list_status": "REJECTED"},
    "CANCELLED_BY_NGLOS": {"label": "Hủy hồ sơ NGLOS", "tone": "danger", "list_status": "REJECTED"},
    "TRANSFERRED_OFFLINE": {"label": "Đã chuyển luồng offline", "tone": "info", "list_status": "INITIATING"},
}

# 2. Nine Lifecycle Actions on SME Connect Detail Header
LIFECYCLE_ACTIONS = (
    "generate_proposal",
    "save_draft",
    "update_case",
    "submit_approval",
    "submit_los",
    "send_b2b_confirm",
    "mark_b2b_done",
    "switch_offline",
    "cancel_case",
)

# 3. Selectable CBBH Support Agent Groups (Left Sidebar on OCR & Evaluation screens)
CBBH_AGENT_GROUPS: list[dict[str, Any]] = [
    {
        "id": "fin",
        "label": "Phân tích tài chính",
        "description": "Chấm điểm sức khỏe BCTC, cân đối kế toán, chu kỳ vốn & SWOT ngành",
        "agents": ["financial-analysis", "industry"],
    },
    {
        "id": "col",
        "label": "Đánh giá tài sản bảo đảm",
        "description": "Đối chiếu định giá Prosland, tính LTV từng TSBĐ & bảo lãnh cá nhân",
        "agents": ["collateral"],
    },
    {
        "id": "risk",
        "label": "Rủi ro tín dụng & Tuân thủ",
        "description": "Kiểm tra Badbranch, Warning/AMC/EWS topdown, KSSV & CIC đa chủ thể",
        "agents": ["risk-compliance"],
    },
    {
        "id": "pol",
        "label": "Chính sách tín dụng & Ngoại lệ",
        "description": "Đối chiếu điều kiện sản phẩm, ngoại lệ chính sách & thẩm quyền phê duyệt",
        "agents": ["policy-exception"],
    },
]

# 4. SME Connect Multi-Product Catalogue (maps to core/knowledge product codes for Master Checklist)
SMEC_PRODUCTS: list[dict[str, Any]] = [
    {
        "code": "GROWTH_ONLINE",
        "core_product_code": "SME-WC",
        "name": "Hạn mức bổ sung VLĐ — Growth Online",
        "short_name": "Growth Online",
        "purpose": "working_capital",
        "requires_collateral": True,
        "max_limit_vnd": 30_000_000_000,
        "default_term_months": 12,
        "highlights": "Cấp hạn mức quay vòng bổ sung vốn lưu động theo mẫu B4 và dòng tiền thực tế.",
        "commitments": [
            "CBBH đã khảo sát trực tiếp trụ sở và địa điểm kinh doanh thực tế của khách hàng.",
            "Khách hàng cam kết luân chuyển doanh thu qua tài khoản thanh toán tại VPBank theo quy định sản phẩm.",
        ],
    },
    {
        "code": "FAST_CARD",
        "core_product_code": "SME-WC",
        "name": "Thẻ tín dụng Doanh nghiệp — Fast Card",
        "short_name": "Fast Card",
        "purpose": "working_capital",
        "requires_collateral": False,
        "max_limit_vnd": 3_000_000_000,
        "default_term_months": 12,
        "highlights": "Hạn mức thẻ tín chấp doanh nghiệp phục vụ chi phí vận hành, quảng cáo, công tác.",
        "commitments": [
            "Doanh nghiệp hoạt động liên tục tối thiểu 12 tháng, không có nợ xấu CIC trong 24 tháng gần nhất.",
            "ĐDPL cam kết sử dụng hạn mức thẻ đúng mục đích chi tiêu hoạt động kinh doanh.",
        ],
    },
    {
        "code": "INVOICE_LOAN",
        "core_product_code": "SME-TRADE",
        "name": "Tài trợ Hoá đơn đầu ra — Vay hoá đơn",
        "short_name": "Vay hoá đơn",
        "purpose": "trade_finance",
        "requires_collateral": False,
        "max_limit_vnd": 10_000_000_000,
        "default_term_months": 9,
        "highlights": "Tài trợ ngắn hạn dựa trên bộ hợp đồng & hóa đơn VAT đầu ra hợp lệ (tín chấp hoặc bổ sung TSBĐ).",
        "commitments": [
            "Đã đối chiếu tối thiểu 03 hợp đồng đầu ra kèm hóa đơn điện tử hợp lệ trên hệ thống thuế.",
            "Bên mua thuộc danh sách đối tác thanh toán qua ngân hàng, không phát sinh tranh chấp thương mại.",
        ],
    },
    {
        "code": "SME_INVEST",
        "core_product_code": "SME-CAPEX",
        "name": "Vay trung dài hạn đầu tư TSCĐ / BĐS SXKD",
        "short_name": "Đầu tư TSCĐ",
        "purpose": "capex",
        "requires_collateral": True,
        "max_limit_vnd": 50_000_000_000,
        "default_term_months": 60,
        "highlights": "Tài trợ đầu tư máy móc thiết bị, phương tiện vận tải hoặc nhà xưởng sản xuất.",
        "commitments": [
            "Đã kiểm tra chứng từ chứng minh mục đích đầu tư và tỷ lệ vốn tự có tham gia tối thiểu 20%.",
            "Tài sản hình thành từ vốn vay hoặc TSBĐ hiện hữu đủ điều kiện định giá Prosland.",
        ],
    },
]

# 5. Six Credit-Centric OCR Categories (Figma URL 1 `BẢN MỚI`)
OCR_CATEGORIES: list[dict[str, Any]] = [
    {
        "id": "01_customer",
        "code": "01",
        "title": "01 · Thông tin khách hàng",
        "subtitle": "Định danh ĐKKD, CIF, địa chỉ, Ban lãnh đạo, Cổ đông & Nhóm KH liên quan",
        "requires_collateral": False,
    },
    {
        "id": "02_other",
        "code": "02",
        "title": "02 · Thông tin khác",
        "subtitle": "Lịch sử thay đổi ĐKKD, giấy phép kinh doanh có điều kiện, nhân sự & MTXH",
        "requires_collateral": False,
    },
    {
        "id": "03_business",
        "code": "03",
        "title": "03 · Hoạt động kinh doanh",
        "subtitle": "Mô hình SXKD, cơ sở kho xưởng, bảng Đối tác đầu ra/đầu vào & Hóa đơn VAT",
        "requires_collateral": False,
    },
    {
        "id": "04_financial",
        "code": "04",
        "title": "04 · Tình hình tài chính",
        "subtitle": "BCTC 2 năm & quý gần nhất, doanh thu tờ khai VAT 12T, sao kê & tồn kho/công nợ",
        "requires_collateral": False,
    },
    {
        "id": "05_pavv",
        "code": "05",
        "title": "05 · Phương án & đề xuất cấp TD (PAVV)",
        "subtitle": "Đọc tất định từ file Excel Mẫu B4 (không dùng OCR, không sửa tay trực tiếp)",
        "requires_collateral": False,
    },
    {
        "id": "06_blcn",
        "code": "06",
        "title": "06 · Bảo lãnh cá nhân (BLCN) & TSBĐ",
        "subtitle": "Thông tin người bảo lãnh cá nhân và danh mục tài sản bảo đảm (Tiền gửi, BĐS, PTVT)",
        "requires_collateral": True,
    },
]

HARD_READONLY_FIELDS = frozenset({
    "01_customer.dkkd_no",
    "01_customer.cif",
})

CONFIDENCE_TIERS = ("trusted", "needs_confirm", "missing")
