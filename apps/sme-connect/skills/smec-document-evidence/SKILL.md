---
description: "Kiểm tra danh mục chứng từ Master Checklist A-I, 7 rule đối chiếu chéo R1-R7 và đăng ký bằng chứng E### cho SME Connect"
always: false
---

# smec-document-evidence

1. Gọi `sme_case_get`, `sme_checklist_evaluate` và `sme_crosscheck_evaluate`.
2. Đăng ký các trường thông tin đã xác nhận từ 6 danh mục OCR và file Excel Mẫu B4 thành bằng chứng qua `sme_evidence_add` (`document_id`, `page`, `field`, `value`).
3. Với mỗi mục `MISSING_REQUIRED`, `FAIL` hoặc xung đột check chéo (`R1`–`R7`), gọi `sme_review_add` (`missing_document` hoặc `data_conflict`).
4. Lưu kết quả đúng JSON schema bằng `sme_case_put_result(agent="document-evidence")`.
