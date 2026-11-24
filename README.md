# Sao Khuê: Tín dụng SME

App Sao Khuê `apps/sme-lending` (**Tín dụng SME**) hiện thực thiết kế "AI Lending SME" trong một app duy nhất, cho
cả hai bước của hồ sơ vay. Agent là trợ lý; hệ thống trung tâm (LOS) vẫn giữ trạng thái gốc của hồ sơ. Tích hợp với
LOS (Playwright trên hồ sơ được giao) làm sau.

| Tab trên trang | Cho ai | Việc chính |
|---|---|---|
| **Hoàn thiện hồ sơ** | Sale/RM | Rà bộ hồ sơ của khách, biết còn thiếu gì, soạn thư xin bổ sung, bàn giao khi đủ |
| **Thẩm định** | Cán bộ thẩm định | Chạy 3 agent chuyên môn có kiểm chứng tất định, xem tiến độ, xử lý hàng đợi rà soát |

**4 agent:**

| Agent | Việc | Phần kết quả lưu |
|---|---|---|
| `sme-assistant` | Trợ lý chat chung: dựng hồ sơ, đọc chứng từ, soạn thư, chạy và giải thích thẩm định | (không) |
| `document-product` | Chứng từ & sản phẩm | `document-evidence`, `product-match` |
| `credit-analysis` | Thẩm định chuyên môn | `financial-analysis`, `risk-compliance`, `collateral`, `industry` (luồng B), `policy-exception` |
| `consolidation` | Tổng hợp tờ trình, tự kiểm trước khi lưu | `consolidation` |

Mỗi "phần kết quả" giữ skill, schema và kiểm chứng riêng như thiết kế gốc; chỉ số phiên agent giảm, nên ít tốn RAM và
thời gian khởi động hơn.

Dữ liệu: hồ sơ của Sale ở `data/sales/`, bản thẩm định ở `data/` (bàn giao chép hồ sơ từ bản đầu sang bản sau, cùng mã
`SME-...`). Đổi chỗ bằng `$SME_SALES_DATA` / `$SME_LENDING_DATA`.

## Cấu trúc repo

```
core/sme_core/     lõi tất định dùng chung: store, phép tính, chính sách, verify, gap analysis, appserver
core/knowledge/    knowledge pack dùng chung (DỮ LIỆU MẪU)
core/ui/           style, component, định dạng và mở chat dùng chung cho UI (alias @sme-ui)
apps/sme-lending/  app.json, agents, skills, server/server.py (MCP), backend/, ui/ (ui/src/sales: tab Hoàn thiện hồ sơ)
tools/sync_core.py chép core/sme_core và core/knowledge vào app
tests/             test lõi, test từng app, test đồng bộ core
```

Sao Khuê cài app bằng cách chép riêng thư mục của app, nên app mang một bản
sao của core (`server/sme_core`, `knowledge`, có file `GENERATED.txt`). **Chỉ sửa trong
`core/`**, rồi chạy `python tools/sync_core.py`. Test `CoreSyncTest` báo lỗi nếu bản sao lệch.

## Hoàn thiện hồ sơ (Sale)

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

Agent `sme-assistant` đọc chứng từ, phân loại, điền thông tin chứng từ ghi rõ, giải thích chỗ thiếu
và soạn thư. Nó **không** được bỏ qua mục, gửi thư hay đánh dấu đã nộp: các việc đó chỉ đi qua backend,
với request gateway ký là `owner-session`. `sme_draft_save` từ chối thư hứa hẹn kết quả.

## Thẩm định

| Thiết kế | Trong app |
|---|---|
| Credit Orchestrator | `workflows/sme_credit_assessment.py`: 3 bước nối tiếp, chạy lại có giới hạn cho các phần còn thiếu |
| 8 phần chuyên môn | 3 agent ở trên, mỗi phần một `skills/sme-<phần>/SKILL.md` |
| Verification & Guardrail | kiểm tra tất định ngay khi `sme_case_put_result` (schema, mã bằng chứng, tính lại phép tính, chặn câu chữ mang tính quyết định); agent Tổng hợp tự kiểm và gọi `sme_verify_result` |
| OCR EDA, NCLOS, CIC | `core/sme_core/integrations.py` (chưa nối; có chế độ dữ liệu mẫu) |
| Tab Thẩm định | kết quả từng agent, bằng chứng, hàng đợi rà soát (cán bộ quyết định), audit |

**Tiến độ thẩm định**: mỗi agent báo bước đang làm qua `sme_progress` (ghi `progress.jsonl` của hồ sơ; lưu kết quả
thành công được tự ghi là hoàn tất). Tab Tổng quan hiện các bước này, tự cập nhật trong lúc chạy. Đây là tiến độ agent tự
báo, không phải đo. Agent Chứng từ đọc mọi file một lần qua `sme_document_pack`; `sme_checklist_evaluate` mặc định trả bản
gọn (chỉ mục chưa đạt), `detail="full"` cho bản đầy đủ.

Trợ lý `sme-assistant` chạy workflow; nếu thư viện chưa có `sme-credit-assessment` thì nó lấy source qua
`sme_workflow_source` và chạy trực tiếp.

## Cài đặt

```bash
kirocrew app install D:/Projects/saokhue-sme-lending/apps/sme-lending
kirocrew app enable sme-lending
```

- App có backend Python, nên cần cấp quyền tin cậy cho app (App Store, hoặc `agent.apps_trusted`).
- Gỡ hoặc cập nhật app khi gateway đang chạy có thể thất bại vì backend giữ file log: đóng Sao Khuê trước.
- Dữ liệu hồ sơ: `$SME_SALES_DATA` (mặc định `<app>/data/sales`) / `$SME_LENDING_DATA` (mặc định `<app>/data`).
- Bản cũ có hai app `sme-sales` và `sme-lending`: chép `apps/sme-sales/data/cases` sang `apps/sme-lending/data/sales/cases`, rồi gỡ `sme-sales`.

## Phát triển

```bash
python tools/sync_core.py
python -m unittest discover -s tests
cd apps/sme-lending/ui && npm install && npm run build
```

Test chỉ dùng thư viện chuẩn. MCP server cần `mcp` (xem `requirements.txt` của app); gateway tự cài.

### Hồ sơ mẫu đi đủ các bước

```bash
python tools/seed_demo.py            # tạo hồ sơ trong app đã cài
python tools/seed_demo.py --submit   # tạo và bàn giao luôn sang Thẩm định
```

Tạo "Công ty TNHH Thương mại Sao Mai Demo" (hư cấu, mọi file ghi "DU LIEU MAU"): 16 chứng từ PDF kèm
meta và dữ liệu OCR mẫu, master checklist **đầy đủ**, cả 7 đối chiếu R1–R7 **khớp**, điều kiện chính
sách đạt, một thư xin bổ sung đã gửi (tờ khai VAT, hợp đồng đầu ra) rồi chứng từ về. Việc còn lại duy nhất
là bàn giao. Sau `--submit`, mở hồ sơ ở tab Thẩm định và bấm **Chạy thẩm định**. Mặc định ghi vào
`$KIROCREW_HOME/apps/sme-lending/data/sales` (home mặc định `~/.vpbank/saokhue`); `--sales-data` / `--lending-data` để chọn nơi
khác. `tests/test_seed_demo.py` giữ cho hồ sơ này luôn đi trọn các bước.

## Việc còn lại

- Tích hợp LOS bằng Playwright trên hồ sơ được giao (nộp hồ sơ, kéo hồ sơ về Thẩm định, ghi trường "đề xuất AI").
- Nối OCR EDA, NCLOS, CIC; thay `core/knowledge/*.json` bằng quy định có hiệu lực.
- Chốt backend LLM được phép dùng với dữ liệu khách hàng.
- Danh tính `agent` trong một số tool do agent tự khai; nếu kiểm toán cần danh tính đã xác thực, dùng `x-kirocrew-session-label`.
