---
description: "Cách soạn thư/tin nhắn xin khách hàng SME bổ sung chứng từ: chỉ đưa mục CUSTOMER còn thiếu/lỗi, lịch sự, không hứa kết quả"
always: false
---

# sme-customer-request

## Chuẩn bị
1. Gọi `sme_dossier_gaps` để lấy `open_customer_items` (`owner_role == "CUSTOMER"`). Tuyệt đối KHÔNG đưa các mục nội bộ ĐVKD (`RM_INTERNAL`: Tờ trình, Ảnh thực địa, CIC, Prosland, phê duyệt cấp trên) hoặc mục `SKIPPED` vào thư.
2. Chỉ đưa vào thư những mục Sale chọn; nếu Sale không chọn, lấy các mục trong `open_customer_items` có `ask`. Nếu mục ở trạng thái `FAIL` (ví dụ Tờ khai VAT chưa đủ 8 quý/24 tháng hoặc hợp đồng thiếu hóa đơn VAT đi kèm), nêu rõ lý do cần bổ sung lại.
3. Mỗi mục dùng đúng câu `ask` trong catalog; có `alternatives` thì ghi thêm dòng "Nếu chưa có, Quý khách có thể gửi: ...".

## Theo kênh
- **email**: có tiêu đề; mở "Kính gửi Quý khách/Anh/Chị [tên người liên hệ nếu có], đại diện [tên công ty]"; danh sách đánh số; hạn gửi nếu Sale nêu; ký tên "[Tên Sale] – [Chi nhánh]".
- **zalo**: ngắn gọn, tối đa khoảng 8 dòng, danh sách gạch đầu dòng, không tiêu đề.
- **phone_script**: kịch bản gọi điện, câu mở, các ý cần xin, cách trả lời khi khách hỏi lý do cần.

## Giọng văn & An toàn
- Lịch sự, rõ ràng, không dùng mã rule nội bộ (như R1..R7, UNDETERMINED_CONDITION, DSCR, LTV, NCLOS).
- Nếu mục đang `requested` hoặc quá hạn: nhắc nhẹ, lịch sự, hỏi khách có vướng mắc hoặc cần gửi chứng từ thay thế không.
- KHÔNG hứa hay ngụ ý kết quả ("chắc chắn duyệt", "sẽ giải ngân"...). `sme_draft_save` từ chối mọi câu hứa hẹn hoặc key thuộc `RM_INTERNAL`.

## Lưu và trao cho Sale
Gọi `sme_draft_save` với `requirement_keys` là đúng các key `open_customer_items` đã chọn. Hiển thị nguyên văn thư cho Sale để Sale rà soát, chọn hạn gửi và bấm "Tôi đã gửi" trên trang Hoàn thiện hồ sơ.
