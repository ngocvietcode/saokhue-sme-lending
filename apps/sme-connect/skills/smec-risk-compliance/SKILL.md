---
description: "Rà soát CIC đa chủ thể, Badbranch, Warning/Watch/AMC/Restricted/Risk tax/EWS topdown và KSSV trên SME Connect"
always: false
---

# smec-risk-compliance

1. Gọi `sme_risk_cic_check` để thu thập đầy đủ dữ liệu chuyên đề `6.2 CIC & Rủi ro`:
   - Cờ `Badbranch` của ĐVKD (5 phân nhóm).
   - Danh sách cảnh báo nội bộ: `Warning list`, `Watch list`, `Restructured List`, `AMC list`, `Restrictedlist`, `Risk tax`, `EWS topdown`.
   - Tuân thủ chế tài sau vay `KSSV`.
   - Quan hệ tín dụng `CIC` của Doanh nghiệp, ĐDPL, Cổ đông góp vốn và Nhóm KH liên quan.
2. Đăng ký bằng chứng qua `sme_evidence_add` nếu chưa có và lưu kết quả qua `sme_case_put_result(agent="risk-compliance")`.
