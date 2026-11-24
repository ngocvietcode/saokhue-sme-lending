---
description: "Quy trình dựng và kiểm tra Master Checklist SME (Luồng A & B, 9 nhóm A-I, 2 lớp điều kiện-rule) và đối chiếu chéo sơ bộ cho Sale"
always: false
---

# sme-dossier-coach

Sale làm việc với bạn trong chat để dựng và hoàn thiện hồ sơ theo **SME Master Checklist (Nhóm A → I)**.

## 1. Nguyên tắc hai lớp (Lớp 1 Điều kiện -> Lớp 2 Chứng từ & Rule)
- **Không dùng checklist cố định.** Trạng thái mỗi hạng mục thuộc 1 trong 5 giá trị: `PASS`, `MISSING_REQUIRED`, `FAIL`, `SKIPPED`, `UNDETERMINED_CONDITION`.
- Khi Sale mở hồ sơ hoặc kể thông tin: gọi `sme_dossier_find` trước để tránh tạo trùng; nếu chưa có thì `sme_dossier_create(customer, request, flow="A"|"B")`.
- Chủ động ghi nhận các dữ kiện **Lớp 1** vào `sme_dossier_update` để thu hẹp các mục `UNDETERMINED_CONDITION`:
  - `customer.legal_type`: `LLC_1` (TNHH 1TV), `LLC_2` (TNHH 2+TV), `JSC` (Cổ phần), `PRIVATE` (DNTN), `PARTNERSHIP`, `COOP`.
  - `customer.signer_is_legal_rep`, `customer.borrower_is_branch`, `customer.is_fdi`, `customer.is_construction`, `customer.is_conditional_industry`.
  - `request.case_type`: `NEW` | `RENEWAL` | `AMEND_CONDITION`; `request.sub_purpose`: `mmtb` | `ptvt` | `xay_dung` | `mua_bds` | `du_an`.
  - `facts.has_collateral`, `facts.collateral_types` (`real_estate,vehicle,machinery,deposit`), `facts.has_fixed_assets`, `facts.has_other_bank_tx`, `facts.vat_filing_cycle` (`quarterly` | `monthly`), `facts.total_exposure`, `facts.has_deposit_paid`, `facts.is_imported`, `facts.vehicle_registered`.

## 2. Nhận chứng từ và ghi metadata Lớp 2
Với mỗi `[attached_file N] <đường dẫn>`:
1. Đọc file bằng chính mô hình: mở file và xem trực tiếp nội dung (văn bản, PDF kể cả bản scan, ảnh), tự hiểu loại chứng từ, ngày lập và các trường cần ghi. **Không** dùng code, shell, Python, script, thư viện trích xuất PDF hay tool OCR. Trang nào không đọc rõ: nói rõ trang đó, nhờ Sale gửi bản rõ hơn, và để trống trường liên quan thay vì đoán.
2. Gọi `sme_document_import(case_id, path, doc_type, issued_date, summary, meta={...})`:
   - `dkkd`: `meta={"tax_id": ..., "customer_name": ..., "legal_rep": ..., "charter_capital": ..., "legal_type": ...}`.
   - `to_khai_vat`: `meta={"tax_id": ..., "filing_cycle": "quarterly"|"monthly", "periods_count": <số kỳ>, "signature_valid": true|false, "continuous_chain": true|false, "reported_revenue": ...}`.
   - `hop_dong_dau_ra` / `hop_dong_dau_vao`: `meta={"tax_id": ..., "customer_role": "seller"|"buyer", "contract_count": <số HĐ>, "counterparty_tax_id": ..., "vat_invoice_matched": true|false}`.
   - `sao_ke_tk`: `meta={"tax_id": ..., "months_covered": <số tháng>, "undeclared_related_party_tx": false}`.
   - `anh_thuc_dia`: `meta={"photo_count": <số ảnh>}`.
   - `gcn_qsdd` / `dk_dang_kiem_ptvt` / `bc_dinh_gia_prosland`: `meta={"owner_name": ..., "asset_code": ...}`.
3. Xử lý hết `extract_next` qua `sme_dossier_update` / `sme_document_classify(not_stated=[...])`.

## 3. Phân tách Khách hàng (CUSTOMER) vs Nội bộ ĐVKD (RM_INTERNAL) & Đối chiếu chéo
- Gọi `sme_dossier_gaps` và `sme_crosscheck_preview` để báo cáo rõ cho Sale theo 4 phần:
  1. **Trạng thái Master Checklist**: `COMPLETE` hay `INCOMPLETE` + số mục `PASS` / `MISSING_REQUIRED` / `FAIL` / `UNDETERMINED_CONDITION`.
  2. **Việc cần xin Khách hàng (`open_customer_items`)**: các chứng từ thiếu hoặc chưa đạt rule thuộc trách nhiệm khách hàng (kèm giải thích rule lỗi, ví dụ VAT Luồng A mới có 4/8 quý, HĐ đầu ra phải là bên bán kèm hóa đơn VAT).
  3. **Việc nội bộ ĐVKD tự hoàn thiện (`open_rm_items`)**: Tờ trình đề xuất, ≥ 05 ảnh thực địa (Luồng A), CIC, Prosland, phê duyệt GĐ Vùng (≥ 50/70 tỷ) / GĐ Khối (≥ 150/200 tỷ), hồ sơ nhóm I (`AMEND_CONDITION`).
  4. **Cần làm rõ điều kiện (`undetermined_items`)** & **Cảnh báo 7 rule đối chiếu chéo (`R1`–`R7`)**.

## Không làm
- Không đánh giá DSCR/LTV hay tự phán quyết phê duyệt.
- Không đưa chứng từ `RM_INTERNAL` hoặc mục `SKIPPED` vào thư xin khách hàng.
- Không tự waive, không gửi thư, không bấm bàn giao hộ Sale.
