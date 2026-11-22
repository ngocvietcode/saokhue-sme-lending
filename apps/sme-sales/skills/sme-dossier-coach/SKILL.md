---
description: "Quy trình rà soát và hoàn thiện bộ hồ sơ vay SME cho Sale: đọc chứng từ, điền thông tin, giải thích chỗ thiếu, lập kế hoạch bổ sung"
always: false
---

# sme-dossier-coach

## Khi Sale nhờ rà một hồ sơ
1. `sme_case_get` để xem thông tin và chứng từ đã có.
2. Với chứng từ chưa có loại hoặc ngày lập: gọi `sme_ocr_extract`, xác định loại theo `sme_documents_catalog` và gọi `sme_document_classify`. Kết quả OCR `status: "sample"` là dữ liệu mẫu: vẫn dùng được nhưng nói rõ với Sale.
3. Thông tin hồ sơ còn trống mà chứng từ đã ghi rõ (tên, MST, ngày thành lập, số tiền, kỳ hạn, mục đích): điền bằng `sme_case_update` và nói lấy từ chứng từ nào.
   - `years_in_operation` = số năm tròn từ ngày thành lập trên ĐKKD tới hôm nay.
4. Gọi `sme_dossier_gaps` để lấy danh sách còn thiếu và điểm hoàn thiện.

## Trình bày cho Sale
- Mở đầu: điểm hoàn thiện, giai đoạn, và câu kết luận "đã đủ để nộp" hoặc "còn N mục chặn nộp".
- **Việc cần làm ngay** (mục `blocking`), nhóm theo: Pháp lý, Nhu cầu vay, Tài chính, Tài sản bảo đảm, Ngành. Mỗi mục một dòng: việc cần làm, lý do ngắn, và chứng từ thay thế nếu có.
- **Nên bổ sung** (mục không chặn): ví dụ thiếu ngày lập chứng từ.
- **Cảnh báo sơ bộ** (`policy_precheck` không đạt): nói thẳng là đề xuất hiện tại có thể không đạt điều kiện nào, gợi ý Sale cân nhắc cơ cấu lại (số tiền, kỳ hạn, sản phẩm) hoặc trao đổi với Thẩm định. Không kết luận thay Thẩm định.
- Mục đang `requested` (đã xin khách): ghi "đang chờ khách" và ngày xin.
- Kết thúc bằng một câu hỏi: có muốn soạn thư xin khách các mục chặn không.

## Khi hồ sơ đã đủ
Nói rõ không còn mục chặn và Sale có thể đánh dấu nộp trên trang Hoàn thiện hồ sơ. Liệt kê các mục đã bỏ qua (waived) kèm lý do để Sale kiểm tra lại giải trình trước khi nộp.

## Không làm
- Không đánh giá DSCR, LTV, CIC hay rủi ro tín dụng: đó là phần Thẩm định.
- Không thêm mục thiếu ngoài `sme_dossier_gaps`. Thấy điều đáng lưu ý khác thì ghi là "ghi chú cho Sale", không coi là mục thiếu.
