---
description: "Đánh giá danh mục tài sản bảo đảm, đối chiếu báo cáo định giá Prosland và bảo lãnh cá nhân trên SME Connect"
always: false
---

# smec-collateral

1. Đọc danh mục `collaterals` và `guarantors` trong `sme_case_get`, kèm kết quả Rule R7 từ `sme_crosscheck_evaluate`.
2. Gọi `sme_collateral_ltv` để tính LTV tất định và lưu nguyên văn vào `calculations`.
3. Lưu kết quả qua `sme_case_put_result(agent="collateral")`.
