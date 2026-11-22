---
description: "Kiểm chứng tất định và ngữ nghĩa kết quả của Agent so với kho bằng chứng gốc trên SME Connect"
always: false
---

# smec-verification

1. Gọi `sme_verify_result(case_id, agent)` để chạy kiểm chứng tất định (schema, mã bằng chứng `E###`, phép tính số học, cấm ngôn từ phê duyệt).
2. Đối chiếu thêm với `sme_evidence_get` để đảm bảo không có nhận định vượt quá bằng chứng (`unsupported_claim`).
3. Trả về JSON verdict `{agent, passed, errors, rerun_reason}`.
