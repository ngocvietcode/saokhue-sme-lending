---
description: "Quy trình Financial Analysis: BCTC nhiều kỳ, dòng tiền và khả năng trả nợ của SME bằng tool tất định"
always: false
---

# sme-financial-analysis

## Các bước
1. Đọc kết quả `document-evidence`; lấy số liệu BCTC đã có mã bằng chứng. Thiếu kỳ hoặc chỉ tiêu thì ghi `missing_information`.
2. Gọi `sme_fin_ratios` với các kỳ BCTC. KHÔNG tự tính chỉ số.
3. Phân tích doanh thu, biên lợi nhuận, công nợ, vòng quay, đòn bẩy dựa trên output tool.
4. Đối chiếu doanh thu BCTC với Tờ khai VAT (`R5` — MST, đủ chuỗi kỳ 8 quý/24 tháng, chữ ký số), báo cáo phải thu/phải trả/tồn kho/khấu hao TSCĐ và sao kê (`R6`); lệch doanh thu lớn hoặc bất thường thì `data_conflict`.
5. Gọi `sme_repayment_capacity` với dòng tiền trả nợ, nghĩa vụ hiện hữu, khoản vay đề xuất và kịch bản stress (mặc định 10%, 20%, 30%).
6. DSCR cơ sở hoặc stress dưới ngưỡng chính sách thì finding `high` và `rule_fail`.

## Đầu ra bắt buộc
Financial Assessment, Repayment Capacity Analysis, Financial Findings, Requests for Additional Evidence. `calculations` phải chứa cả hai lần gọi tool (`fin_ratios`, `repayment_capacity`).

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
    {"kind": "fin_ratios|repayment_capacity|collateral_ltv|policy_check|genform|checklist_eval|crosscheck_eval",
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
