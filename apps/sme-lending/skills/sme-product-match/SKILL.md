---
description: "Quy trình Product Match: phân rã nhu cầu tín dụng SME và đối chiếu danh mục sản phẩm"
always: false
---

# sme-product-match

## Phạm vi
Chỉ nhận diện sản phẩm/cấu trúc. KHÔNG đánh giá chính sách, ngoại lệ, rủi ro, hạn mức, TSBĐ.

## Các bước
1. Đọc hồ sơ và kết quả `document-evidence` (`sme_results_get`).
2. Chuẩn hóa nhu cầu: số tiền, mục đích, kỳ hạn, phương thức cấp tín dụng.
3. Phân rã nhu cầu nếu có nhiều mục đích (vd. vốn lưu động và đầu tư TSCĐ).
4. Gọi `sme_knowledge_products`, chọn sản phẩm khớp theo mục đích, đối tượng, kỳ hạn tối đa.
5. So với đề xuất ĐVKD: khác biệt ghi finding severity `medium`, không tự sửa đề xuất.
6. Đề xuất tác vụ thẩm định tiếp theo trong `open_issues`.

## Đầu ra bắt buộc
Nhu cầu chuẩn hóa, sản phẩm liên quan kèm mã sản phẩm (finding topic `product`, mã đặt ở đầu `statement`), căn cứ nhận diện, thông tin còn thiếu.

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
