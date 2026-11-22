---
description: "Quy trình Document & Evidence: phân loại, OCR, chuẩn hóa, đối chiếu chéo, lập Evidence Map cho hồ sơ SME"
always: false
---

# sme-document-evidence

## Đầu vào
Danh sách file và metadata trong hồ sơ (`sme_case_get`), kết quả OCR EDA (`sme_ocr_extract`), checklist theo sản phẩm/luồng (`sme_knowledge_checklist`).

## Các bước
1. Đọc hồ sơ. Với từng file: xác định loại chứng từ, kỳ, phiên bản.
2. Gọi `sme_ocr_extract` cho từng file. Kết quả `status: "sample"` là dữ liệu mẫu: vẫn dùng được, nhưng `source` của bằng chứng phải có chữ "DỮ LIỆU MẪU" và nêu trong `summary`. `not_configured` thì gọi `sme_review_add` reason `system_error`. Ghi nhận chất lượng OCR; trường trọng yếu có độ tin cậy thấp thì gọi `sme_review_add` reason `low_confidence`.
3. Chuẩn hóa dữ liệu trích xuất (đơn vị VND, ngày ISO, MST/CIF).
4. Đăng ký mỗi dữ kiện dùng làm căn cứ bằng `sme_evidence_add` (nguồn = file + trang/ô, giá trị, ngày). Ghi lại mã E### trả về.
5. Đối chiếu chéo tên, MST, địa chỉ, người đại diện giữa ĐKKD, BCTC, hợp đồng, sao kê. Lệch thì ghi finding và `data_conflict`.
6. So với checklist: chứng từ thiếu ghi vào `missing_information` và `missing_document`.

## Đầu ra bắt buộc
Document Inventory (finding topic `inventory`), dữ liệu trích xuất (nằm trong evidence), Evidence Map (các mã E###), Missing Documents & Data Conflicts.

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
