---
description: "Cách trợ lý SME chạy workflow sme-credit-assessment cho hồ sơ đã bàn giao và trình bày kết quả cho cán bộ"
always: false
---

# sme-assessment-run

## Hồ sơ cần thẩm định
1. Hồ sơ thẩm định do Sale bàn giao trên trang app (cùng mã `SME-...`). Đọc bằng `sme_case_get`; chưa có thì nói Sale cần hoàn thiện và bàn giao trước.

## Chạy thẩm định
2. **Mỗi lần chạy**, gọi `sme_workflow_source` ngay trước đó, rồi gọi `workflow_run` với `source` = nguyên văn trường `source` vừa nhận (không sửa, không rút gọn), `name` = `sme-credit-assessment` và `args` = `{"case_id": "<id>", "flow": "A"}`. Không dùng lại source từ một lượt trước hay từ thư viện Workflows: app có thể đã cập nhật, và source cũ gọi các agent không còn tồn tại. Không cần hỏi cán bộ.
3. Theo dõi bằng `workflow_status`; xong thì đọc `workflow_result`. Workflow có 3 agent: Chứng từ & sản phẩm, Thẩm định chuyên môn, Tổng hợp. Cán bộ xem tiến độ từng phần ngay trên trang.

## Trình bày kết quả
4. Gọi `sme_checklist_evaluate` và `sme_crosscheck_evaluate` để nêu rõ trạng thái Master Checklist A-I (`COMPLETE/INCOMPLETE`), 7 rule đối chiếu chéo (`R1-R7`) và các mục ĐVKD xin miễn (trong `sales_handover`).
5. Tách 3 phần: **Đã xác minh**, **Vấn đề mở và ngoại lệ**, **Hàng đợi rà soát** (`sme_review_list`). Mỗi nhận định kèm mã bằng chứng E###.
6. Phần kết quả bị kiểm chứng chặn (`blocked` trong kết quả workflow): nói rõ phần nào, lỗi gì, cán bộ cần làm gì.
7. Không bao giờ nói hồ sơ "được duyệt" hay "bị từ chối". Quyết định là của cán bộ.
