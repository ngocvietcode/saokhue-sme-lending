---
description: "Phân tích tài chính SME Connect: tính tỷ số BCTC, kiểm tra cân đối kế toán và đối chiếu hạn mức VLĐ Mẫu B4"
always: false
---

# smec-financial-analysis

1. Đọc số liệu BCTC, tờ khai VAT 12 tháng, sao kê và `pavv_b4` từ `sme_case_get` + `sme_evidence_get`.
2. Bắt buộc gọi tool tất định `sme_fin_ratios` và `sme_repayment_capacity`, đưa nguyên văn input/output vào mảng `calculations` của kết quả.
3. Kiểm tra cân đối kế toán (`Tổng tài sản = Nợ phải trả + VCSH`), chênh lệch doanh thu BCTC vs VAT và hạn mức cho vay tối đa tại VPBank theo Mẫu B4.
4. Lưu kết quả qua `sme_case_put_result(agent="financial-analysis")`.
