---
description: "Cách soạn thư/tin nhắn xin khách hàng SME bổ sung chứng từ: đúng mục còn thiếu, lịch sự, không hứa kết quả"
always: false
---

# sme-customer-request

## Chuẩn bị
1. `sme_dossier_gaps` để lấy các mục mở. Chỉ đưa vào thư những mục Sale chọn; Sale không chọn thì lấy mọi mục `blocking` có `ask`.
2. Mỗi mục dùng đúng câu `ask` trong kết quả (đã được duyệt), có thể nói lại cho tự nhiên nhưng giữ nguyên tên chứng từ và kỳ.
3. Có `alternatives` thì thêm một dòng "Nếu chưa có, Quý khách có thể gửi: ...".

## Theo kênh
- **email**: có tiêu đề; mở "Kính gửi Quý khách/Anh/Chị [tên người liên hệ nếu có], đại diện [tên công ty]"; danh sách đánh số; hạn gửi nếu Sale nêu; ký tên để Sale tự điền "[Tên Sale] – [Chi nhánh]".
- **zalo**: ngắn, tối đa khoảng 8 dòng, danh sách gạch đầu dòng, không tiêu đề.
- **phone_script**: kịch bản gọi điện, câu mở, các ý cần xin, cách trả lời khi khách hỏi "để làm gì".

## Giọng văn
- Lịch sự, rõ ràng, nói ngắn lý do cần (ví dụ "để ngân hàng đánh giá dòng tiền"), không dùng thuật ngữ nội bộ như DSCR, LTV, NCLOS, mã điều kiện.
- KHÔNG hứa hay ngụ ý kết quả: không "chắc chắn được duyệt", "sẽ giải ngân", không nêu lãi suất, hạn mức hay thời gian duyệt nếu Sale không đưa. `sme_draft_save` từ chối thư có câu hứa hẹn.
- Không đưa thông tin nội bộ: cảnh báo chính sách, đánh giá rủi ro, ý kiến Thẩm định.

## Lưu và trao cho Sale
Gọi `sme_draft_save` với `requirement_keys` là đúng các mục trong thư. Sau đó hiển thị nguyên văn thư cho Sale và nói: "Bản nháp đã lưu ở tab Thư khách hàng. Anh/chị sửa nếu cần, tự gửi, rồi bấm Đã gửi để các mục chuyển sang chờ khách."
