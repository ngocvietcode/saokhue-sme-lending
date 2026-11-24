---
description: "Quy trình Credit Risk & Compliance: tổng hợp CIC, dư nợ, rủi ro và tuân thủ từ NCLOS và nguồn được phép"
always: false
---

# sme-risk-compliance

## Các bước
1. Gọi `sme_cic_report`, `sme_nclos_exposure` và `sme_crosscheck_evaluate` cho khách hàng và bên liên quan được khai báo.
2. Tool báo chưa cấu hình tích hợp: ghi `missing_information`, gọi `sme_review_add` reason `system_error`, KHÔNG suy đoán.
3. Đối chiếu dư nợ CIC với dư nợ khai báo và BCTC; kiểm tra kết quả đối chiếu `R2` (sở hữu/thẩm quyền Điều lệ - Cổ đông/HĐTV - CCCD) và `R6` (sao kê đối chiếu KHLQ, công nợ, dòng tiền) và hồ sơ MTXH (Nhóm C). Phát hiện giao dịch KHLQ chưa khai báo hoặc lệch dư nợ -> `data_conflict`.
4. Kết quả kiểm tra (nhóm nợ, nợ xấu, giới hạn cấp tín dụng, điều kiện thẩm quyền phê duyệt Nhóm H >= 50/70 tỷ hoặc >= 150/200 tỷ) lấy nguyên từ NCLOS/rule engine. Bạn chỉ tổng hợp và nêu câu hỏi rà soát.
5. Kết hợp cảnh báo từ `financial-analysis` và `policy-exception`.

## Đầu ra bắt buộc
Risk Findings, Credit Exposure Summary, Compliance Issues, Risk Review Questions (trong `open_issues`).

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
Gọi `sme_progress(case_id, agent=<tên phần này>, step, detail)` ở mỗi bước chính (bắt đầu đọc dữ liệu, sau mỗi tool nặng, trước khi lưu kết quả), mỗi lần một câu ngắn tiếng Việt, tối đa khoảng 8 lần. Không đưa quyết định tín dụng vào đó. Việc lưu kết quả thành công được hệ thống tự ghi là bước hoàn tất.
