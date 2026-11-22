---
description: "Cách trợ lý SME tạo hồ sơ, chạy workflow sme-credit-assessment và trình bày kết quả cho cán bộ"
always: false
---

# sme-assessment-run

## Tạo hồ sơ
1. Hỏi cán bộ: CIF/MST, tên khách hàng, ngành, nhu cầu (số tiền, mục đích, kỳ hạn), đề xuất ĐVKD, luồng (A hoặc B), danh sách file đã tải lên.
2. Gọi `sme_case_create`. Ghi lại `case_id`.

## Chạy thẩm định
3. Gọi `workflow_run` với `workflow` = `sme-credit-assessment` và `args` = `{"case_id": "<id>", "flow": "A"}`.
   Thư viện chưa có workflow này: gọi `sme_workflow_source`, rồi gọi `workflow_run` với `source` = nguyên văn trường `source` nhận được (không sửa, không rút gọn), `name` = `sme-credit-assessment` và cùng `args`. Không cần hỏi cán bộ.
4. Theo dõi bằng `workflow_status`; xong thì đọc `workflow_result`.

## Trình bày kết quả
5. Tách 3 phần: **Đã xác minh**, **Vấn đề mở và ngoại lệ**, **Hàng đợi rà soát** (`sme_review_list`). Mỗi nhận định kèm mã bằng chứng E###.
6. Kết quả bị Verification chặn: nói rõ agent nào, lỗi gì, cán bộ cần làm gì.
7. Không bao giờ nói hồ sơ "được duyệt" hay "bị từ chối". Quyết định là của cán bộ.
