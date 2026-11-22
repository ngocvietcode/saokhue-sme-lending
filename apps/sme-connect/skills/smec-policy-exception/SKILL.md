---
description: "Đối chiếu chính sách tín dụng, ngoại lệ và cấp thẩm quyền phê duyệt trên SME Connect"
always: false
---

# smec-policy-exception

1. Đọc `facts`, `request` và gói sản phẩm từ `sme_case_get`.
2. Bắt buộc gọi `sme_policy_check` và ghi lại kết quả vào `calculations` nếu sử dụng phép kiểm tra chuẩn.
3. Chỉ rõ các điều kiện phê duyệt bổ sung (ví dụ cam kết dòng tiền qua VPBank, bổ sung chứng từ trước giải ngân) và ghi nhận ngoại lệ qua `sme_review_add(reason_code="exception_needed")` nếu có.
4. Lưu kết quả qua `sme_case_put_result(agent="policy-exception")`.
