# sme-lending: Thẩm định tín dụng SME trên Sao Khuê

App Sao Khuê hiện thực thiết kế "AI Lending SME - 10 AI Agent": một hệ thống thẩm định
có điều phối, không phải 10 chatbot. App được phát hành từ repo riêng này, không nằm
trong core Sao Khuê.

## Mỗi thành phần nằm ở đâu

| Thiết kế | Trong app |
|---|---|
| Credit Orchestrator | `workflows/sme_credit_assessment.py`: phase, chạy song song, retry có giới hạn, audit qua event journal |
| Product Match, Document & Evidence, Financial, Policy & Exception, Risk & Compliance, Collateral, Industry, Consolidation | `agents/<tên>.json` + `skills/sme-<tên>/SKILL.md` |
| Verification & Guardrail | `sme_verify_result` (tất định: schema, mã bằng chứng, tính lại phép tính, chặn câu chữ mang tính quyết định) + agent `verifier` |
| Trạng thái hồ sơ, Evidence Map, Human Review Queue, Audit Trail | `server/sme_core/store.py`, mỗi hồ sơ một thư mục |
| Phép tính, rule | `server/sme_core/finance.py`, `collateral.py`, `knowledge.py` (không dùng LLM) |
| OCR EDA, NCLOS, CIC | `server/sme_core/integrations.py` (chưa nối, trả `not_configured`) |
| Knowledge pack | `knowledge/*.json` (DỮ LIỆU MẪU) |
| Mặt tiền cho cán bộ | agent `sme-assistant` (chat), và trang **Thẩm định SME** trên sidebar |
| Trang Thẩm định SME | `ui/src/App.tsx` (build ra `ui/dist/index.mjs`) gọi `backend/server.py` qua `/apps/sme-lending/api` |

## Trang Thẩm định SME

Danh sách hồ sơ, và mỗi hồ sơ có 4 tab: **Kết quả** (từng agent, trạng thái kiểm chứng,
lý do bị chặn), **Bằng chứng** (bấm mã `E###` trong finding để nhảy tới), **Rà soát**
(cán bộ xác nhận hoặc yêu cầu bổ sung, bắt buộc ghi chú) và **Audit**.

Quyết định rà soát chỉ đi qua backend, và backend chỉ nhận request được gateway ký là
`owner-session` (`backend.signedPrincipal`). Agent, MCP tool và cron được ký là
`agent-tool`, nên không agent nào tự đóng được mục rà soát. Không có MCP tool nào làm việc này.

Build UI sau mỗi lần sửa `ui/src`:

```bash
cd ui && npm install && npm run build
```

## Luồng chạy

1. Cán bộ trò chuyện với Bot dựng từ `sme-lending--sme-assistant`, Bot tạo hồ sơ bằng `sme_case_create`.
2. Bot gọi `workflow_run(workflow="sme-credit-assessment", args={"case_id": ..., "flow": "A"})`.
3. Workflow chạy Documents, Product, Specialists (song song; Industry chỉ ở luồng B), Policy, Consolidate.
   Sau mỗi agent, `verifier` kiểm tra; nếu lỗi sửa được thì agent chạy lại (mặc định 1 lần, tối đa 2).
4. Kết quả không đạt bị chặn. Thiếu dữ liệu, mâu thuẫn, rule không đạt hoặc cần ngoại lệ thì vào hàng đợi rà soát.
5. Cán bộ quyết định. Agent không bao giờ phê duyệt, và `put_result` từ chối kết quả có câu chữ mang tính quyết định.

## Cài đặt

```bash
kirocrew app install D:/Projects/saokhue-sme-lending
kirocrew app enable sme-lending
```

Sau đó:

- Lưu `workflows/sme_credit_assessment.py` trong tab Workflows với slug `sme-credit-assessment`.
  Thư viện workflow chỉ nhận bản lưu do người dùng thực hiện.
- Tạo Bot mới trên trang Crew Members, mục Built from chọn `sme-lending--sme-assistant`.
- Dữ liệu hồ sơ nằm ở `$SME_LENDING_DATA`, mặc định là `<app>/data`. Nên đặt biến này ra ngoài thư mục app để bản cập nhật không xoá dữ liệu.

## Phát triển

```bash
python -m unittest discover -s tests
```

Test chỉ dùng thư viện chuẩn. MCP server cần `mcp` (xem `requirements.txt`); gateway tự cài khi đăng ký app.

## Việc còn lại trước khi dùng dữ liệu thật

- Nối `integrations.py` với OCR EDA, NCLOS, CIC (timeout, retry, idempotency, map lỗi).
- Thay `knowledge/*.json` bằng chính sách và danh mục có hiệu lực, có owner và version.
- Chốt ACP backend và nơi chạy model cho dữ liệu CIC/BCTC; siết profile governance (chỉ cho đọc, không có tool ghi ra hệ thống lõi).
- Danh tính `agent` trong `sme_evidence_add` và `sme_review_add` hiện do agent tự khai. Nếu kiểm toán cần danh tính đã xác thực, chuyển sang `x-kirocrew-session-label`.
- Thêm UI page cho hàng đợi rà soát và Evidence Map.
- Dựng UAT pack (positive, negative, boundary, missing-data, conflicting-data, access-control) theo mục 5.2 của tài liệu thiết kế.
