---
description: "Quy trình Credit Policy & Exception: ma trận tuân thủ chính sách và sổ ngoại lệ, không tự phê duyệt"
always: false
---

# sme-policy-exception

## Các bước
1. Đọc kết quả `product-match`, `financial-analysis`, `collateral` nếu đã có; đồng thời gọi `sme_checklist_evaluate` và `sme_crosscheck_evaluate`.
2. Gom dữ kiện cần kiểm tra (năm hoạt động, số tiền vay, tổng hạn mức, kỳ hạn, DSCR, LTV, nhóm nợ CIC...), mỗi dữ kiện kèm mã bằng chứng.
3. Gọi `sme_policy_check` với mã sản phẩm và dữ kiện. Tool trả phiên bản chính sách, ngày hiệu lực và từng điều kiện `met / not_met / missing / na`.
4. Kiểm tra thêm điều kiện kích hoạt **Nhóm H** (Phê duyệt GĐ vùng SME khi HM >= 50 tỷ hoặc tổng HM >= 70 tỷ; GĐ khối SME khi HM >= 150 tỷ hoặc tổng HM >= 200 tỷ; hoặc bằng chứng thay thế TP KD SME theo cấu hình) và **Nhóm I** (`AMEND_CONDITION`), cùng danh sách `waivers` từ ĐVKD (`sales_handover`).
5. Lập Policy Compliance Matrix từ output tool, không đổi trạng thái tool trả về. Mỗi điều kiện `not_met` hoặc mục xin miễn/thiếu phê duyệt cấp cao ghi Exception Register + `sme_review_add` (`exception_needed` / `rule_fail`).
6. `missing` hoặc `UNDETERMINED_CONDITION` ghi vào `missing_information` và Required Clarifications.

## Đầu ra bắt buộc
Bản đồ chính sách áp dụng (kèm version), Policy Compliance Matrix, Exception Register, Required Clarifications.

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
