---
description: "Đánh giá độ phù hợp và điều kiện áp dụng của gói đa sản phẩm đề xuất trên SME Connect"
always: false
---

# smec-product-match

1. Đọc `proposed_products` trong `sme_case_get` và kho bằng chứng `sme_evidence_get`.
2. Đánh giá tính sẵn sàng của từng sản phẩm (`Growth Online`, `Fast Card`, `Vay hoá đơn`, `Đầu tư TSCĐ`) so với mục đích sử dụng vốn, thời gian hoạt động và tài sản bảo đảm.
3. Mỗi nhận định bắt buộc gắn `evidence_refs` hợp lệ; lưu kết quả qua `sme_case_put_result(agent="product-match")`.
