---
description: "Quy trình Consolidation: hợp nhất kết quả đã kiểm chứng thành gói đánh giá và dữ liệu Genform"
always: false
---

# sme-consolidation

## Các bước
1. `sme_results_get`, `sme_checklist_evaluate` và `sme_crosscheck_evaluate` lấy kết quả mới nhất của mọi agent, trạng thái Master Checklist A-I (`COMPLETE/INCOMPLETE`) và 7 rule đối chiếu chéo (`R1-R7`).
2. Chỉ đưa vào phần "đã xác minh" các kết quả có `verification.passed = true`. Kết quả chưa đạt hoặc mục ĐVKD xin miễn (`sales_handover.waivers`) nêu rõ ở `open_issues`.
3. Kiểm tra trùng và mâu thuẫn giữa các agent. Mâu thuẫn thì `data_conflict`, không tự chọn bên đúng.
4. Hợp nhất theo chủ đề: khách hàng, Master Checklist & Đối chiếu chéo, nhu cầu và sản phẩm, tài chính, chính sách và ngoại lệ (bao gồm Nhóm H/I), rủi ro, TSBĐ (Prosland), ngành.
5. `sme_review_list` để liệt kê toàn bộ hàng đợi rà soát vào `open_issues`.
6. Đặt dữ liệu Genform trong `calculations` với `kind` = `genform`, `inputs` = {}, `outputs` = các trường tờ trình.

## Đầu ra bắt buộc
Consolidated Credit Assessment Report, Open Issues & Exception Summary, Genform-ready Data, bản nháp cho cán bộ. KHÔNG có câu đề xuất phê duyệt hay từ chối.

## Schema kết quả chung (gửi qua `sme_case_put_result`)

```json
{
  "agent": "<tên agent>",
  "case_id": "<mã hồ sơ>",
  "summary": "Tóm tắt 2-4 câu",
  "findings": [
    {"id": "F1", "topic": "...", "statement": "...",
     "severity": "info|low|medium|high", "evidence_refs": ["E001"]}
  ],
  "missing_information": ["..."],
  "open_issues": ["..."],
  "calculations": [
    {"kind": "fin_ratios|repayment_capacity|collateral_ltv|policy_check|genform",
     "inputs": {}, "outputs": {}}
  ],
  "confidence": "low|medium|high"
}
```

- `calculations` chép nguyên `inputs` đã gửi. `outputs` có thể chỉ trích các trường bạn dùng, nhưng mỗi giá trị phải đúng như tool trả về, không thêm trường tool không có, và list (vd. `matrix`) phải giữ đủ số dòng. Verification tính lại và so sánh từng giá trị bạn báo.
- `sme_case_put_result` từ chối kết quả sai schema hoặc finding không có bằng chứng: sửa rồi gửi lại, không lách.

## Mã lý do khi gọi `sme_review_add`

`missing_document`, `data_conflict`, `rule_fail`, `low_confidence`, `exception_needed`, `expert_review`, `system_error`.

## Báo tiến độ
Gọi `sme_progress(case_id, agent, step, detail)` ở mỗi bước chính (bắt đầu đọc dữ liệu, sau mỗi tool nặng, trước khi lưu kết quả), mỗi lần một câu ngắn tiếng Việt, tối đa khoảng 8 lần. Không đưa quyết định tín dụng vào đó. Việc lưu kết quả thành công được hệ thống tự ghi là bước hoàn tất.
