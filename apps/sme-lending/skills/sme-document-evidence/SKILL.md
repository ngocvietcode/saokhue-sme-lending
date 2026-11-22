---
description: "Quy trình Document & Evidence: kiểm tra Master Checklist 2 lớp (A-I), OCR, chuẩn hóa, 7 rule đối chiếu chéo R1-R7 và lập Evidence Map"
always: false
---

# sme-document-evidence

## Đầu vào
Hồ sơ (`sme_case_get`), OCR EDA (`sme_ocr_extract`), Master Checklist hai lớp (`sme_checklist_evaluate`) và 7 rule đối chiếu chéo (`sme_crosscheck_evaluate`).

## Các bước
1. Gọi `sme_case_get` để đọc thông tin định danh, `facts`, chứng từ hiện có và ghi chú bàn giao từ ĐVKD (`sales_handover`, kể cả các mục xin miễn `waivers`).
2. Với từng file: gọi `sme_ocr_extract`. Nếu `status: "sample"`, mọi bằng chứng liên quan phải ghi rõ `"DỮ LIỆU MẪU"` trong `source` và nêu ở `summary`. Nếu `not_configured`, gọi `sme_review_add` reason `system_error`. Trường trọng yếu độ tin cậy thấp -> `low_confidence`.
3. Đăng ký các dữ kiện dùng làm căn cứ bằng `sme_evidence_add` (nguồn = file + trang/ô/meta, giá trị, ngày) và lưu lại các mã `E###`.
4. Gọi `sme_checklist_evaluate(case_id)` để xác định trạng thái Master Checklist A → I (`PASS`, `MISSING_REQUIRED`, `FAIL`, `SKIPPED`, `UNDETERMINED_CONDITION` và kết quả tổng thể `COMPLETE`/`INCOMPLETE`). Mục thiếu -> `missing_information` và `sme_review_add(missing_document)`. Mục chưa đủ dữ liệu xác định điều kiện -> nêu rõ ở `open_issues`.
5. Gọi `sme_crosscheck_evaluate(case_id)` kiểm tra **7 rule đối chiếu chéo**:
   - `R1`: ĐKKD gốc (tên DN, MST, ĐDPL, vốn điều lệ).
   - `R2`: Điều lệ + Sổ cổ đông/HĐTV + CCCD + Biên bản họp/Ủy quyền.
   - `R3`: Hợp đồng đầu ra (bên bán) / đầu vào (bên mua).
   - `R4`: Hợp đồng đối chiếu hóa đơn VAT theo MST đối tác.
   - `R5`: BCTC & VAT (MST, chuỗi kỳ 8 quý/24 tháng, chữ ký số/XML, doanh thu).
   - `R6`: Sao kê đối chiếu KHLQ, công nợ và dòng tiền.
   - `R7`: TSBĐ đối chiếu Prosland.
   Rule ở trạng thái `FAIL` -> finding mức `high` + `sme_review_add(data_conflict` hoặc `rule_fail)`.
6. Lưu kết quả qua `sme_case_put_result`, đính kèm trong `calculations` cả `{"kind": "checklist_eval", "inputs": {"case_id": case_id}, "outputs": ...}` và `{"kind": "crosscheck_eval", "inputs": {"case_id": case_id}, "outputs": ...}` (chỉ trích các trường tool trả về; giữ nguyên độ dài list `groups`/`rules`).

## Đầu ra bắt buộc
Document Inventory, Evidence Map (`E###`), Master Checklist Summary (`COMPLETE/INCOMPLETE`), Cross-Check Summary (`R1-R7`), Missing Documents & Data Conflicts.

## Mã lý do khi gọi `sme_review_add`
`missing_document`, `data_conflict`, `rule_fail`, `low_confidence`, `exception_needed`, `expert_review`, `system_error`.
