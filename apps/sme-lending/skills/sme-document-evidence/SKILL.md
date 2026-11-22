---
description: "Quy trình Document & Evidence: kiểm tra Master Checklist 2 lớp (A-I), OCR, chuẩn hóa, 7 rule đối chiếu chéo R1-R7 và lập Evidence Map"
always: false
---

# sme-document-evidence

## Đầu vào
Hồ sơ (`sme_case_get`), gói chứng từ một lần gọi (`sme_document_pack`: OCR EDA của mọi file + checklist + R1-R7), Master Checklist hai lớp (`sme_checklist_evaluate`) và 7 rule đối chiếu chéo (`sme_crosscheck_evaluate`).

## Các bước
1. Gọi `sme_case_get` để đọc thông tin định danh, `facts`, chứng từ hiện có và ghi chú bàn giao từ ĐVKD (`sales_handover`, kể cả các mục xin miễn `waivers`).
2. Gọi **một lần** `sme_document_pack(case_id)` để lấy OCR của mọi file cùng kết quả checklist và R1-R7 (không gọi `sme_ocr_extract` từng file; chỉ gọi lại khi cần đọc lại một file). Với từng file trong gói: Nếu `status: "sample"`, mọi bằng chứng liên quan phải ghi rõ `"DỮ LIỆU MẪU"` trong `source` và nêu ở `summary`. Nếu `not_configured`, gọi `sme_review_add` reason `system_error`. Trường trọng yếu độ tin cậy thấp -> `low_confidence`.
3. Đăng ký các dữ kiện dùng làm căn cứ bằng **một** lần gọi `sme_evidence_add` cho cả danh sách (nguồn = file + trang/ô/meta, giá trị, ngày) và lưu lại các mã `E###`.
4. Dùng `checklist` trong gói (hoặc `sme_checklist_evaluate`, mặc định bản gọn) để xác định trạng thái Master Checklist A → I (`PASS`, `MISSING_REQUIRED`, `FAIL`, `SKIPPED`, `UNDETERMINED_CONDITION` và kết quả tổng thể `COMPLETE`/`INCOMPLETE`). Mục thiếu -> `missing_information` và `sme_review_add(missing_document)`. Mục chưa đủ dữ liệu xác định điều kiện -> nêu rõ ở `open_issues`.
5. Dùng `crosschecks` trong gói (hoặc `sme_crosscheck_evaluate`) cho **7 rule đối chiếu chéo**:
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

## Báo tiến độ
Gọi `sme_progress(case_id, agent, step, detail)` ở mỗi bước chính (bắt đầu đọc dữ liệu, sau mỗi tool nặng, trước khi lưu kết quả), mỗi lần một câu ngắn tiếng Việt, tối đa khoảng 8 lần. Không đưa quyết định tín dụng vào đó. Việc lưu kết quả thành công được hệ thống tự ghi là bước hoàn tất.
