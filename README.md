# Sao Khuê SME Lending: hai app cho Sale và Thẩm định

Các app Sao Khuê hiện thực thiết kế "AI Lending SME - 10 AI Agent". Agent là trợ lý;
hệ thống trung tâm (LOS) vẫn giữ trạng thái gốc của hồ sơ. Tích hợp với LOS
(Playwright trên hồ sơ được giao) làm sau.

| App | Cho ai | Việc chính |
|---|---|---|
| `apps/sme-sales` · **Hoàn thiện hồ sơ** | Sale/RM | Rà bộ hồ sơ của khách, biết còn thiếu gì, soạn thư xin bổ sung, kiểm tra đủ để nộp chưa |
| `apps/sme-lending` · **Thẩm định SME** | Cán bộ thẩm định | Workflow 9 agent chuyên môn, kiểm chứng tất định, hàng đợi rà soát |

## Cấu trúc repo

```
core/sme_core/     lõi tất định dùng chung: store, phép tính, chính sách, verify, gap analysis, appserver
core/knowledge/    knowledge pack dùng chung (DỮ LIỆU MẪU)
core/ui/           style, component, định dạng và mở chat dùng chung cho UI (alias @sme-ui)
apps/<app>/        app.json, agents, skills, server/server.py (MCP), backend/, ui/
tools/sync_core.py chép core/sme_core và core/knowledge vào từng app
tests/             test lõi, test từng app, test đồng bộ core
```

Sao Khuê cài một app bằng cách chép riêng thư mục của app đó, nên mỗi app mang một bản
sao của core (`server/sme_core`, `knowledge`, có file `GENERATED.txt`). **Chỉ sửa trong
`core/`**, rồi chạy `python tools/sync_core.py`. Test `CoreSyncTest` báo lỗi nếu bản sao lệch.

## App Hoàn thiện hồ sơ (Sale)

**Danh sách còn thiếu** do `core/sme_core/gaps.py` tính bằng quy tắc, không dùng model:

- thông tin bắt buộc của hồ sơ (`documents.json` › `fields`);
- chứng từ theo checklist sản phẩm và luồng (`checklists.json`);
- hiệu lực chứng từ theo ngày lập (`documents.json` › `validity_months`);
- dữ kiện chính sách mà Sale cung cấp được (`sales_facts`), và kiểm tra sơ bộ các điều kiện đã có
  dữ kiện (cảnh báo, không chặn nộp). DSCR, LTV và CIC là phần của Thẩm định.

Mỗi mục có `key` cố định, mức **chặn nộp** hoặc **nên có**, câu **xin khách** đã duyệt và chứng từ
**thay thế** được chấp nhận. Điểm hoàn thiện tính theo trọng số (mục chặn nộp = 2). Hồ sơ **sẵn sàng
nộp** khi không còn mục chặn nộp; mục **bỏ qua** phải có lý do và đi kèm hồ sơ.

Trang có 5 tab: **Còn thiếu** (nhóm theo pháp lý, nhu cầu, tài chính, TSBĐ, ngành; chọn mục để soạn
thư; đánh dấu đã xin khách; bỏ qua có lý do), **Chứng từ** (tải lên, phân loại, ngày lập), **Thông tin**,
**Thư khách hàng** (bản nháp, sao chép, đánh dấu đã gửi), **Nhật ký**.

Agent `dossier-coach` đọc chứng từ, phân loại, điền thông tin chứng từ ghi rõ, giải thích chỗ thiếu
và soạn thư. Nó **không** được bỏ qua mục, gửi thư hay đánh dấu đã nộp: các việc đó chỉ đi qua backend,
với request gateway ký là `owner-session`. `sme_draft_save` từ chối thư hứa hẹn kết quả.

## App Thẩm định SME

| Thiết kế | Trong app |
|---|---|
| Credit Orchestrator | `workflows/sme_credit_assessment.py`: phase, chạy song song, retry có giới hạn |
| 8 agent chuyên môn | `agents/<tên>.json` + `skills/sme-<tên>/SKILL.md` |
| Verification & Guardrail | kiểm tra tất định ngay khi `sme_case_put_result` (schema, mã bằng chứng, tính lại phép tính, chặn câu chữ mang tính quyết định) + một lượt `verifier` ở bước tổng hợp |
| OCR EDA, NCLOS, CIC | `core/sme_core/integrations.py` (chưa nối; có chế độ dữ liệu mẫu) |
| Trang Thẩm định SME | kết quả từng agent, bằng chứng, hàng đợi rà soát (cán bộ quyết định), audit |

Agent `sme-assistant` chạy workflow; nếu thư viện chưa có `sme-credit-assessment` thì nó lấy source qua
`sme_workflow_source` và chạy trực tiếp.

## Cài đặt

```bash
kirocrew app install D:/Projects/saokhue-sme-lending/apps/sme-sales
kirocrew app enable sme-sales
kirocrew app install D:/Projects/saokhue-sme-lending/apps/sme-lending
kirocrew app enable sme-lending
```

- App có backend Python, nên cần cấp quyền tin cậy cho từng app (App Store, hoặc `agent.apps_trusted`).
- Gỡ hoặc cập nhật app khi gateway đang chạy có thể thất bại vì backend giữ file log: đóng Sao Khuê trước.
- Dữ liệu hồ sơ: `$SME_SALES_DATA` / `$SME_LENDING_DATA`, mặc định `<app>/data`.

## Phát triển

```bash
python tools/sync_core.py
python -m unittest discover -s tests
cd apps/sme-sales/ui && npm install && npm run build
cd apps/sme-lending/ui && npm install && npm run build
```

Test chỉ dùng thư viện chuẩn. MCP server cần `mcp` (xem `requirements.txt` của app); gateway tự cài.

## Việc còn lại

- Tích hợp LOS bằng Playwright trên hồ sơ được giao (nộp hồ sơ, kéo hồ sơ về Thẩm định, ghi trường "đề xuất AI").
- Nối OCR EDA, NCLOS, CIC; thay `core/knowledge/*.json` bằng quy định có hiệu lực.
- Chốt backend LLM được phép dùng với dữ liệu khách hàng.
- Danh tính `agent` trong một số tool do agent tự khai; nếu kiểm toán cần danh tính đã xác thực, dùng `x-kirocrew-session-label`.
