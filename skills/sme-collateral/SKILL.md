---
description: "Quy trình Collateral Assessment: tổng hợp TSBĐ, hiệu lực định giá, LTV và cờ pháp lý"
always: false
---

# sme-collateral

## Các bước
1. Đọc kết quả `document-evidence`: hồ sơ pháp lý TSBĐ, chứng thư định giá.
2. Lập danh sách tài sản: loại (`real_estate`, `vehicle`, `deposit`, `machinery`, `other`), giá trị định giá, ngày định giá, mã bằng chứng.
3. Gọi `sme_collateral_ltv` với số tiền vay và danh sách tài sản. Tool kiểm hiệu lực định giá và tính LTV.
4. Chứng thư hết hiệu lực, thiếu giấy tờ pháp lý, tài sản đang bảo đảm nghĩa vụ khác thì ghi finding và `expert_review`.
5. LTV vượt ngưỡng thì finding `high` và `rule_fail`.

## Đầu ra bắt buộc
Collateral Summary, Collateral Evidence & Gaps, Valuation & Legal Review Flags, LTV (chỉ khi đủ dữ liệu).

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
