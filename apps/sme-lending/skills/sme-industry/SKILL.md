---
description: "Quy trình Industry & Competitor: phân tích ngành, vị thế cạnh tranh và giả định PAVV (luồng B)"
always: false
---

# sme-industry

## Các bước
1. Xác định mã ngành và tiểu phân khúc từ hồ sơ.
2. Ưu tiên báo cáo am hiểu ngành đã được duyệt (có trong hồ sơ dưới dạng bằng chứng). Thiếu thì ghi `missing_information`.
3. Đối chiếu giả định PAVV (tăng trưởng doanh thu, biên lợi nhuận, vòng quay) với dữ liệu ngành.
4. Giả định vượt xa mặt bằng ngành thì finding `medium` hoặc `high` và câu hỏi cho ĐVKD.

## Đầu ra bắt buộc
Industry Assessment, Business Assumption Review, Industry Risks & Questions, Source References (evidence_refs).

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
