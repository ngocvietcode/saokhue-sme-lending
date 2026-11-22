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

Trang chính gồm 3 góc nhìn (Bảng tiến độ Kanban, Danh sách chi tiết, Tất cả việc cần làm) và bộ lọc "Hôm nay" (Sẵn sàng nộp, Quá hạn / Cần nhắc, Cần Sale xử lý, Đang chờ khách). Trong từng hồ sơ, cột chính có 3 tab **Checklist** (chọn nhiều mục để soạn Email/Zalo/Kịch bản gọi hoặc đánh dấu đã xin kèm hạn hẹn), **Chứng từ** (xem/tải file, kiểm tra hiệu lực, gỡ file nhầm) và **Thư khách hàng**; cột phải hiển thị điều kiện chính sách sơ bộ, thông tin hồ sơ và nhật ký hoạt động. Sau khi nộp, hồ sơ chuyển sang chế độ chỉ đọc và có thể mở lại khi có lý do.

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

**Tiến độ thẩm định**: mỗi agent báo bước đang làm qua `sme_progress` (ghi `progress.jsonl` của hồ sơ; lưu kết quả
thành công được tự ghi là hoàn tất). Tab Tổng quan hiện các bước này, tự cập nhật trong lúc chạy. Đây là tiến độ agent tự
báo, không phải đo. Agent Chứng từ đọc mọi file một lần qua `sme_document_pack`; `sme_checklist_evaluate` mặc định trả bản
gọn (chỉ mục chưa đạt), `detail="full"` cho bản đầy đủ.

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

### Hồ sơ mẫu đi đủ các bước

```bash
python tools/seed_demo.py            # tạo hồ sơ trong app sme-sales đã cài
python tools/seed_demo.py --submit   # tạo và bàn giao luôn sang sme-lending
```

Tạo "Công ty TNHH Thương mại Sao Mai Demo" (hư cấu, mọi file ghi "DU LIEU MAU"): 16 chứng từ PDF kèm
meta và dữ liệu OCR mẫu, master checklist **đầy đủ**, cả 7 đối chiếu R1–R7 **khớp**, điều kiện chính
sách đạt, một thư xin bổ sung đã gửi (tờ khai VAT, hợp đồng đầu ra) rồi chứng từ về. Việc còn lại duy nhất
là bàn giao. Sau `--submit`, mở hồ sơ trong Thẩm định SME và bấm **Chạy thẩm định**. Mặc định ghi vào
`$KIROCREW_HOME/apps/sme-sales/data` (hoặc `~/.vpbank/saokhue`); `--sales-data` / `--lending-data` để chọn nơi
khác. `tests/test_seed_demo.py` giữ cho hồ sơ này luôn đi trọn các bước.

## Việc còn lại

- Tích hợp LOS bằng Playwright trên hồ sơ được giao (nộp hồ sơ, kéo hồ sơ về Thẩm định, ghi trường "đề xuất AI").
- Nối OCR EDA, NCLOS, CIC; thay `core/knowledge/*.json` bằng quy định có hiệu lực.
- Chốt backend LLM được phép dùng với dữ liệu khách hàng.
- Danh tính `agent` trong một số tool do agent tự khai; nếu kiểm toán cần danh tính đã xác thực, dùng `x-kirocrew-session-label`.
