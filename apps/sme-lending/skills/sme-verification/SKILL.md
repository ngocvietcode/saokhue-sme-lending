---
description: "Quy trình Verification & Guardrail: kiểm tra schema, bằng chứng, phép tính trước khi kết quả đi tiếp"
always: false
---

# sme-verification

## Các bước
1. Gọi `sme_verify_result` với `case_id` và `agent` cần kiểm. Tool kiểm tất định: schema, mã bằng chứng tồn tại, tính lại `calculations`, cụm từ bị cấm. Tool tự ghi trạng thái verification vào kết quả.
2. Đọc thêm kết quả và bằng chứng nếu cần để xét kết luận có vượt bằng chứng không.
3. Tool trả lỗi thì `passed = false`. Không được ghi đè lỗi tool thành passed.
4. Kết luận vượt bằng chứng mà tool không bắt được: thêm vào `errors`, `passed = false`.
5. Lỗi sửa được bằng chạy lại agent: `rerun_reason` là `schema_error`, `missing_evidence_ref`, `calc_mismatch` hoặc `unsupported_claim`. Lỗi do thiếu dữ liệu: `rerun_reason` = `none` và gọi `sme_review_add`.

## Verdict trả về (đúng JSON này)

```json
{"agent": "<agent được kiểm>", "passed": true, "errors": [], "rerun_reason": "none"}
```

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
