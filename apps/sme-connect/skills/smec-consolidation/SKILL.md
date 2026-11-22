---
description: "Tổng hợp báo cáo đánh giá từ các Agent chuyên môn phục vụ khởi tạo Tờ trình MB02.PL03 trên SME Connect"
always: false
---

# smec-consolidation

1. Gọi `sme_results_get`, `sme_evidence_get` và `sme_review_list`.
2. Chỉ sử dụng các kết quả chuyên môn có `verification.passed == true`.
3. Tổng hợp rõ điểm mạnh, rủi ro trọng yếu, điều kiện đề xuất cho Tờ trình `MB02.PL03.HDM-TD-CV.NA/05` kèm mã bằng chứng `E###`. Tuyệt đối không kết luận "phê duyệt" hay "từ chối".
4. Lưu kết quả qua `sme_case_put_result(agent="consolidation")`.
