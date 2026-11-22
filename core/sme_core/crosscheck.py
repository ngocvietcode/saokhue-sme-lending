"""Deterministic 7 Cross-Check Rules Engine for SME Credit Dossiers.

Shared by Sales pre-checks and Underwriting verification:
  R1: DKKD gốc -> tên DN, MST, ĐDPL, vốn điều lệ trên toàn bộ hồ sơ
  R2: Điều lệ + Cổ đông/HĐTV + CCCD + Biên bản họp/Ủy quyền -> sở hữu & thẩm quyền
  R3: Hợp đồng đầu ra (KH là bên bán), hợp đồng đầu vào (KH là bên mua)
  R4: Mỗi hợp đồng dùng để pass checklist phải có hóa đơn VAT mapping theo MST đối tác
  R5: BCTC / Tờ khai VAT -> đúng MST, đúng kỳ, đủ chuỗi kỳ, chữ ký số/XML & khớp doanh thu
  R6: Sao kê đối chiếu KHLQ, phải thu/phải trả, hợp đồng và dòng tiền thực tế
  R7: TSBĐ đối chiếu thông tin sở hữu/tài sản với Báo cáo định giá Prosland
"""

from __future__ import annotations

import unicodedata
from datetime import date
from typing import Any

from .checklist_engine import normalize_context
from .collateral import _months_between

RULE_STATUS_VALUES = ("PASS", "FAIL", "MISSING_DATA", "SKIPPED")


def _norm_str(val: Any) -> str:
    if val is None:
        return ""
    s = unicodedata.normalize("NFC", str(val)).strip().lower()
    return " ".join(s.split())


def _norm_float(val: Any) -> float | None:
    if val is None or isinstance(val, bool):
        return None
    try:
        return float(val)
    except (ValueError, TypeError):
        return None


def _docs_of(case: dict[str, Any], *doc_types: str) -> list[dict[str, Any]]:
    wanted = set(doc_types)
    return [d for d in (case.get("documents") or []) if d.get("type") in wanted]


def _meta_val(doc: dict[str, Any], *keys: str) -> Any:
    meta = doc.get("meta") or {}
    samp = doc.get("sample_extract") or {}
    for k in keys:
        if k in meta and meta[k] not in (None, ""):
            return meta[k]
        if k in samp and samp[k] not in (None, ""):
            return samp[k]
    return None


def _evidence_refs_for(evidence: dict[str, Any] | None, doc_ids: list[str]) -> list[str]:
    if not evidence or not doc_ids:
        return []
    refs: list[str] = []
    id_set = set(doc_ids)
    for eid, ev in evidence.items():
        if ev.get("document_id") in id_set:
            refs.append(eid)
        else:
            src = str(ev.get("source") or "")
            if any(did in src for did in doc_ids):
                refs.append(eid)
    return refs


def _make_rule(
    rule_id: str,
    code: str,
    title: str,
    status: str,
    detail: str,
    doc_refs: list[str],
    evidence: dict[str, Any] | None,
) -> dict[str, Any]:
    dedup_docs = list(dict.fromkeys(doc_refs))
    return {
        "id": rule_id,
        "code": code,
        "title": title,
        "status": status,
        "detail": detail,
        "document_refs": dedup_docs,
        "evidence_refs": _evidence_refs_for(evidence, dedup_docs),
    }


def _check_r1_dkkd_anchor(case: dict[str, Any], evidence: dict[str, Any] | None) -> dict[str, Any]:
    dkkds = _docs_of(case, "dkkd")
    cust = case.get("customer") or {}
    if not dkkds:
        return _make_rule(
            "R1", "dkkd_anchor",
            "ĐKKD gốc đối chiếu tên DN, MST, ĐDPL và vốn điều lệ",
            "MISSING_DATA",
            "Chưa có Giấy chứng nhận đăng ký doanh nghiệp (ĐKKD) làm nguồn định danh gốc.",
            [], evidence,
        )

    anchor = dkkds[-1]
    anchor_tid = str(_meta_val(anchor, "tax_id") or cust.get("tax_id") or "").strip()
    anchor_name = _norm_str(_meta_val(anchor, "customer_name", "company_name") or cust.get("name"))
    anchor_rep = _norm_str(_meta_val(anchor, "legal_rep") or cust.get("legal_rep"))
    anchor_cap = _norm_float(_meta_val(anchor, "charter_capital") or cust.get("charter_capital"))

    conflicts: list[str] = []
    doc_refs = [d["id"] for d in dkkds]

    # Compare DKKD meta vs customer profile first
    if _meta_val(anchor, "tax_id") and cust.get("tax_id"):
        if str(_meta_val(anchor, "tax_id")).strip() != str(cust.get("tax_id")).strip():
            conflicts.append(f"MST trên ĐKKD {anchor['id']} khác MST hồ sơ")
    if _meta_val(anchor, "customer_name", "company_name") and cust.get("name"):
        if _norm_str(_meta_val(anchor, "customer_name", "company_name")) != _norm_str(cust.get("name")):
            conflicts.append(f"Tên DN trên ĐKKD {anchor['id']} khác tên khách hàng hồ sơ")
    if _meta_val(anchor, "legal_rep") and cust.get("legal_rep"):
        if _norm_str(_meta_val(anchor, "legal_rep")) != _norm_str(cust.get("legal_rep")):
            conflicts.append(f"ĐDPL trên ĐKKD {anchor['id']} khác ĐDPL hồ sơ")
    if _meta_val(anchor, "charter_capital") is not None and cust.get("charter_capital") is not None:
        dcap = _norm_float(_meta_val(anchor, "charter_capital"))
        ccap = _norm_float(cust.get("charter_capital"))
        if dcap is not None and ccap is not None and abs(dcap - ccap) > max(1.0, abs(ccap)) * 1e-4:
            conflicts.append(f"Vốn điều lệ trên ĐKKD {anchor['id']} khác hồ sơ")

    # Compare across every uploaded document that carries entity metadata
    for d in case.get("documents") or []:
        if d["id"] == anchor["id"]:
            continue
        dtid = str(_meta_val(d, "tax_id") or "").strip()
        dname = _norm_str(_meta_val(d, "customer_name", "company_name"))
        drep = _norm_str(_meta_val(d, "legal_rep"))
        dcap = _norm_float(_meta_val(d, "charter_capital"))
        matched_any = False
        if dtid and anchor_tid:
            matched_any = True
            if dtid != anchor_tid:
                conflicts.append(f"{d['id']} ({d.get('name')}): MST {dtid} ≠ MST gốc {anchor_tid}")
        if dname and anchor_name:
            matched_any = True
            if dname != anchor_name:
                conflicts.append(f"{d['id']} ({d.get('name')}): tên DN không khớp ĐKKD")
        if drep and anchor_rep:
            matched_any = True
            if drep != anchor_rep:
                conflicts.append(f"{d['id']} ({d.get('name')}): ĐDPL không khớp ĐKKD")
        if dcap is not None and anchor_cap is not None:
            matched_any = True
            if abs(dcap - anchor_cap) > max(1.0, abs(anchor_cap)) * 1e-4:
                conflicts.append(f"{d['id']} ({d.get('name')}): vốn điều lệ không khớp ĐKKD")
        if matched_any:
            doc_refs.append(d["id"])

    if conflicts:
        return _make_rule(
            "R1", "dkkd_anchor",
            "ĐKKD gốc đối chiếu tên DN, MST, ĐDPL và vốn điều lệ",
            "FAIL", "; ".join(conflicts), doc_refs, evidence,
        )
    if not anchor_tid:
        return _make_rule(
            "R1", "dkkd_anchor",
            "ĐKKD gốc đối chiếu tên DN, MST, ĐDPL và vốn điều lệ",
            "MISSING_DATA",
            "Có ĐKKD nhưng chưa ghi nhận Mã số thuế doanh nghiệp để đối chiếu chéo.",
            doc_refs, evidence,
        )
    return _make_rule(
        "R1", "dkkd_anchor",
        "ĐKKD gốc đối chiếu tên DN, MST, ĐDPL và vốn điều lệ",
        "PASS",
        f"Định danh gốc ĐKKD khớp MST {anchor_tid} trên {len(set(doc_refs))} chứng từ liên quan.",
        doc_refs, evidence,
    )


def _check_r2_ownership_authority(
    case: dict[str, Any], ctx: dict[str, Any], evidence: dict[str, Any] | None
) -> dict[str, Any]:
    ltype = ctx.get("customer.legal_type_effective")
    cccds = _docs_of(case, "cccd_chu_chot")
    charters = _docs_of(case, "dieu_le")
    shares = _docs_of(case, "so_co_dong")
    members = _docs_of(case, "ds_thanh_vien")
    minutes = _docs_of(case, "bb_hop_vay")
    auths = _docs_of(case, "uy_quyen_ky")
    br_auths = _docs_of(case, "uy_quyen_chi_nhanh")
    all_docs = charters + shares + members + cccds + minutes + auths + br_auths
    doc_refs = [d["id"] for d in all_docs]

    missing_parts: list[str] = []
    if not cccds:
        missing_parts.append("CCCD/hộ chiếu ĐDPL & cổ đông/thành viên chính")
    if ltype is None or ltype == "TNHH_UNKNOWN":
        missing_parts.append("Loại hình doanh nghiệp rõ ràng (LLC_1/LLC_2/JSC/PRIVATE...)")
    if ltype != "PRIVATE":
        if ltype is not None and not charters:
            missing_parts.append("Điều lệ doanh nghiệp")
        if ltype == "JSC" and not shares:
            missing_parts.append("Sổ cổ đông")
        elif ltype in ("LLC_1", "LLC_2", "PARTNERSHIP", "COOP", "TNHH_UNKNOWN") and not members:
            missing_parts.append("Danh sách HĐTV/thành viên góp vốn")
        if ltype in ("LLC_2", "JSC", "PARTNERSHIP", "COOP") and not minutes:
            missing_parts.append("Biên bản họp/Nghị quyết vay vốn")
    if ctx.get("customer.signer_is_legal_rep") is False and not auths:
        missing_parts.append("Văn bản ủy quyền cho người ký")
    if ctx.get("customer.borrower_is_branch") is True and not br_auths:
        missing_parts.append("Ủy quyền cho Chi nhánh vay vốn")

    conflicts: list[str] = []
    for d in all_docs:
        meta = d.get("meta") or {}
        if meta.get("ownership_consistent") is False:
            conflicts.append(f"{d['id']}: cơ cấu sở hữu/tỷ lệ vốn góp không khớp Điều lệ/ĐKKD")
        if meta.get("authority_valid") is False:
            conflicts.append(f"{d['id']}: thẩm quyền ký/biểu quyết không phù hợp Điều lệ")
        if meta.get("id_numbers_valid") is False:
            conflicts.append(f"{d['id']}: CCCD/hộ chiếu không hợp lệ hoặc hết hạn")
        pct_sum = _norm_float(meta.get("ownership_pct_sum"))
        if pct_sum is not None and abs(pct_sum - 100.0) > 0.01:
            conflicts.append(f"{d['id']}: tổng tỷ lệ sở hữu là {pct_sum:g}% (≠ 100%)")

    if conflicts:
        return _make_rule(
            "R2", "ownership_authority",
            "Điều lệ + Cổ đông/HĐTV + CCCD + Thẩm quyền ký vay",
            "FAIL", "; ".join(conflicts), doc_refs, evidence,
        )
    if missing_parts:
        return _make_rule(
            "R2", "ownership_authority",
            "Điều lệ + Cổ đông/HĐTV + CCCD + Thẩm quyền ký vay",
            "MISSING_DATA",
            "Thiếu căn cứ kiểm tra sở hữu & thẩm quyền: " + ", ".join(missing_parts) + ".",
            doc_refs, evidence,
        )
    return _make_rule(
        "R2", "ownership_authority",
        "Điều lệ + Cổ đông/HĐTV + CCCD + Thẩm quyền ký vay",
        "PASS",
        "Hồ sơ sở hữu, tỷ lệ vốn góp và thẩm quyền ký/vay khớp giữa Điều lệ, danh sách sở hữu và CCCD.",
        doc_refs, evidence,
    )


def _check_r3_contract_roles(
    case: dict[str, Any], ctx: dict[str, Any], evidence: dict[str, Any] | None
) -> dict[str, Any]:
    out_docs = _docs_of(case, "hop_dong_dau_ra")
    in_docs = _docs_of(case, "hop_dong_dau_vao")
    flow = ctx["flow"]
    pcode = ctx.get("request.product_code")

    out_required = flow == "B" or pcode in ("SME-WC", "SME-LC")
    in_required = flow == "B"

    if not out_required and not in_required and not out_docs and not in_docs:
        return _make_rule(
            "R3", "contract_roles",
            "Vai trò trên hợp đồng (Đầu ra: bên bán / Đầu vào: bên mua)",
            "SKIPPED",
            "Hồ sơ không yêu cầu kiểm tra hợp đồng đầu ra/đầu vào.",
            [], evidence,
        )

    doc_refs = [d["id"] for d in out_docs + in_docs]
    conflicts: list[str] = []
    for d in out_docs:
        role = str((d.get("meta") or {}).get("customer_role") or "").strip().lower()
        if role and role != "seller":
            conflicts.append(f"{d['id']} (hợp đồng đầu ra): vai trò KH đang là {role}, yêu cầu seller (bên bán)")
    for d in in_docs:
        role = str((d.get("meta") or {}).get("customer_role") or "").strip().lower()
        if role and role != "buyer":
            conflicts.append(f"{d['id']} (hợp đồng đầu vào): vai trò KH đang là {role}, yêu cầu buyer (bên mua)")

    if conflicts:
        return _make_rule(
            "R3", "contract_roles",
            "Vai trò trên hợp đồng (Đầu ra: bên bán / Đầu vào: bên mua)",
            "FAIL", "; ".join(conflicts), doc_refs, evidence,
        )

    missing: list[str] = []
    if out_required and not out_docs:
        missing.append("hợp đồng đầu ra")
    if in_required and not in_docs:
        missing.append("hợp đồng đầu vào")
    if missing:
        return _make_rule(
            "R3", "contract_roles",
            "Vai trò trên hợp đồng (Đầu ra: bên bán / Đầu vào: bên mua)",
            "MISSING_DATA", "Chưa đủ " + " và ".join(missing) + " để xác minh vai trò ký kết.", doc_refs, evidence,
        )

    return _make_rule(
        "R3", "contract_roles",
        "Vai trò trên hợp đồng (Đầu ra: bên bán / Đầu vào: bên mua)",
        "PASS", "Vai trò khách hàng trên hợp đồng đầu ra (bên bán) và đầu vào (bên mua) hợp lệ.", doc_refs, evidence,
    )


def _check_r4_contract_vat_mapping(
    case: dict[str, Any], ctx: dict[str, Any], evidence: dict[str, Any] | None
) -> dict[str, Any]:
    out_docs = _docs_of(case, "hop_dong_dau_ra")
    in_docs = _docs_of(case, "hop_dong_dau_vao")
    vat_docs = _docs_of(case, "hoa_don_vat")
    flow = ctx["flow"]
    pcode = ctx.get("request.product_code")

    out_required = flow == "B" or pcode in ("SME-WC", "SME-LC")
    in_required = flow == "B"
    if not out_required and not in_required and not out_docs and not in_docs:
        return _make_rule(
            "R4", "contract_vat_mapping",
            "Mapping hợp đồng với hóa đơn VAT theo MST đối tác",
            "SKIPPED",
            "Hồ sơ không yêu cầu bộ hợp đồng kèm hóa đơn VAT.",
            [], evidence,
        )

    cust_tid = str((case.get("customer") or {}).get("tax_id") or "").strip()
    inv_msts = {
        str((d.get("meta") or {}).get("counterparty_tax_id") or "").strip()
        for d in vat_docs
        if str((d.get("meta") or {}).get("counterparty_tax_id") or "").strip()
    }

    doc_refs = [d["id"] for d in out_docs + in_docs + vat_docs]
    failures: list[str] = []

    def _eval_group(docs: list[dict[str, Any]], label: str, min_req: int) -> int:
        valid_sets = 0
        for d in docs:
            meta = d.get("meta") or {}
            cnt = int(meta.get("contract_count", 1))
            cp = str(meta.get("counterparty_tax_id") or "").strip()
            if cp and cust_tid and cp == cust_tid:
                failures.append(f"{d['id']} ({label}): MST đối tác trùng MST khách hàng ({cp})")
                continue
            matched = meta.get("vat_invoice_matched")
            if matched is True or (cp and cp in inv_msts):
                valid_sets += cnt
            elif matched is False:
                failures.append(f"{d['id']} ({label}): thiếu hóa đơn VAT mapping hợp lệ theo MST đối tác")
        return valid_sets

    out_min = 3 if flow == "B" else 1
    in_min = 3 if flow == "B" else 0
    out_matched = _eval_group(out_docs, "đầu ra", out_min) if (out_docs or out_required) else 0
    in_matched = _eval_group(in_docs, "đầu vào", in_min) if (in_docs or in_required) else 0

    if flow == "B":
        if out_docs and out_matched < out_min and any("vat_invoice_matched" in (d.get("meta") or {}) for d in out_docs):
            failures.append(f"Hợp đồng đầu ra đạt mapping VAT: {out_matched}/{out_min}")
        if in_docs and in_matched < in_min and any("vat_invoice_matched" in (d.get("meta") or {}) for d in in_docs):
            failures.append(f"Hợp đồng đầu vào đạt mapping VAT: {in_matched}/{in_min}")

    if failures:
        return _make_rule(
            "R4", "contract_vat_mapping",
            "Mapping hợp đồng với hóa đơn VAT theo MST đối tác",
            "FAIL", "; ".join(failures), doc_refs, evidence,
        )

    missing: list[str] = []
    if out_required and sum(int((d.get("meta") or {}).get("contract_count", 1)) for d in out_docs) < out_min:
        missing.append(f"tối thiểu {out_min:02d} hợp đồng đầu ra kèm hóa đơn VAT")
    if in_required and sum(int((d.get("meta") or {}).get("contract_count", 1)) for d in in_docs) < in_min:
        missing.append(f"tối thiểu {in_min:02d} hợp đồng đầu vào kèm hóa đơn VAT")
    if missing:
        return _make_rule(
            "R4", "contract_vat_mapping",
            "Mapping hợp đồng với hóa đơn VAT theo MST đối tác",
            "MISSING_DATA", "Chưa đủ " + ", ".join(missing) + ".", doc_refs, evidence,
        )

    return _make_rule(
        "R4", "contract_vat_mapping",
        "Mapping hợp đồng với hóa đơn VAT theo MST đối tác",
        "PASS", "Các hợp đồng đủ điều kiện đều có hóa đơn VAT đối chiếu theo MST đối tác.", doc_refs, evidence,
    )


def _check_r5_fin_vat_continuity(
    case: dict[str, Any], ctx: dict[str, Any], evidence: dict[str, Any] | None
) -> dict[str, Any]:
    flow = ctx["flow"]
    fs_docs = _docs_of(case, "bctc_2_ky", "bctc")
    q_docs = _docs_of(case, "bctc_quy")
    vat_docs = _docs_of(case, "to_khai_vat")
    doc_refs = [d["id"] for d in fs_docs + q_docs + vat_docs]
    cust_tid = str((case.get("customer") or {}).get("tax_id") or "").strip()

    failures: list[str] = []
    for d in fs_docs + q_docs + vat_docs:
        dtid = str(_meta_val(d, "tax_id") or "").strip()
        if cust_tid and dtid and dtid != cust_tid:
            failures.append(f"{d['id']}: MST {dtid} khác MST khách hàng {cust_tid}")

    if flow == "A" and vat_docs:
        cycle = ctx.get("facts.vat_filing_cycle")
        if not cycle:
            for d in vat_docs:
                c = str((d.get("meta") or {}).get("filing_cycle") or "").strip().lower()
                if c in ("quarterly", "monthly"):
                    cycle = c
                    break
        min_periods = 24 if cycle == "monthly" else 8
        total_p = sum(int((d.get("meta") or {}).get("periods_count", 1)) for d in vat_docs)
        if total_p < min_periods:
            failures.append(f"Tờ khai VAT Luồng A mới có {total_p}/{min_periods} kỳ")
        if any((d.get("meta") or {}).get("continuous_chain") is False for d in vat_docs):
            failures.append("Chuỗi kỳ kê khai VAT không liên tục")
        if any((d.get("meta") or {}).get("signature_valid") is False for d in vat_docs):
            failures.append("Tờ khai VAT thiếu chữ ký số/XML hợp lệ")

    # Revenue cross-check between BCTC and VAT
    facts = case.get("facts") or {}
    fs_rev = _norm_float(facts.get("revenue_last_year"))
    if fs_rev is None:
        for d in fs_docs:
            v = _norm_float(_meta_val(d, "reported_revenue"))
            if v is not None:
                fs_rev = v
                break
            samp_periods = (d.get("sample_extract") or {}).get("periods") or []
            if samp_periods:
                fs_rev = _norm_float(samp_periods[-1].get("revenue"))
                if fs_rev is not None:
                    break
    vat_rev = _norm_float(facts.get("vat_revenue_12m"))
    if vat_rev is None:
        vals = [_norm_float(_meta_val(d, "reported_revenue", "taxable_revenue")) for d in vat_docs]
        nums = [v for v in vals if v is not None]
        if nums:
            vat_rev = sum(nums) if len(nums) > 1 else nums[0]

    rev_note = ""
    if fs_rev is not None and vat_rev is not None and max(fs_rev, vat_rev) > 0:
        diff_pct = abs(fs_rev - vat_rev) / max(fs_rev, vat_rev) * 100.0
        if diff_pct > 15.0:
            failures.append(
                f"Doanh thu BCTC và doanh thu kê khai VAT chênh lệch {diff_pct:.1f}% (> 15%)"
            )
        else:
            rev_note = f" (chênh lệch doanh thu BCTC-VAT {diff_pct:.1f}% trong ngưỡng cho phép)"

    if failures:
        return _make_rule(
            "R5", "fin_vat_continuity",
            "BCTC / Tờ khai VAT: MST, chuỗi kỳ, chữ ký số và đối chiếu doanh thu",
            "FAIL", "; ".join(failures), doc_refs, evidence,
        )

    missing: list[str] = []
    if not vat_docs:
        missing.append("Tờ khai VAT")
    if (flow == "B" or ctx.get("request.product_code") in ("SME-WC", "SME-INV", "SME-GUAR", "SME-PROJ", "SME-FA")) and not fs_docs:
        missing.append("BCTC năm N-1/N-2")
    if flow == "B" and not q_docs:
        missing.append("BCTC quý gần nhất")
    if missing:
        return _make_rule(
            "R5", "fin_vat_continuity",
            "BCTC / Tờ khai VAT: MST, chuỗi kỳ, chữ ký số và đối chiếu doanh thu",
            "MISSING_DATA", "Thiếu " + ", ".join(missing) + " để hoàn tất đối chiếu.", doc_refs, evidence,
        )

    return _make_rule(
        "R5", "fin_vat_continuity",
        "BCTC / Tờ khai VAT: MST, chuỗi kỳ, chữ ký số và đối chiếu doanh thu",
        "PASS",
        f"BCTC và Tờ khai VAT khớp MST, đủ kỳ và chữ ký số hợp lệ{rev_note}.",
        doc_refs, evidence,
    )


def _check_r6_bank_statement_reconcile(
    case: dict[str, Any], ctx: dict[str, Any], evidence: dict[str, Any] | None
) -> dict[str, Any]:
    flow = ctx["flow"]
    bs_docs = _docs_of(case, "sao_ke_tk", "sao_ke_ngan_hang")
    khlq_docs = _docs_of(case, "khai_bao_khlq")
    ar_docs = _docs_of(case, "bc_phai_thu")
    ap_docs = _docs_of(case, "bc_phai_tra")
    doc_refs = [d["id"] for d in bs_docs + khlq_docs + ar_docs + ap_docs]

    applies = (
        bool(bs_docs)
        or (flow == "A" and ctx.get("facts.requires_bank_statement_flow_a") is True)
        or (flow == "B" and ctx.get("facts.has_other_bank_tx") is True)
    )
    if not applies:
        return _make_rule(
            "R6", "bank_statement_reconcile",
            "Sao kê đối chiếu KHLQ, phải thu/phải trả, hợp đồng và dòng tiền",
            "SKIPPED",
            "Hồ sơ không phát sinh yêu cầu đối chiếu sao kê tài khoản TCTD khác.",
            doc_refs, evidence,
        )

    failures: list[str] = []
    if flow == "A" and bs_docs:
        months = [_norm_float((d.get("meta") or {}).get("months_covered")) for d in bs_docs]
        explicit = [m for m in months if m is not None]
        if explicit and max(explicit) < 12:
            failures.append(f"Sao kê Luồng A mới có {int(max(explicit))}/12 tháng")

    declared_khlq: set[str] = set()
    raw_khlq = (case.get("facts") or {}).get("related_party_tax_ids")
    if isinstance(raw_khlq, str):
        declared_khlq |= {x.strip() for x in raw_khlq.split(",") if x.strip()}
    for kd in khlq_docs:
        raw_m = (kd.get("meta") or {}).get("related_party_tax_ids")
        if isinstance(raw_m, str):
            declared_khlq |= {x.strip() for x in raw_m.split(",") if x.strip()}

    for d in bs_docs:
        meta = d.get("meta") or {}
        if meta.get("undeclared_related_party_tx") is True:
            failures.append(f"{d['id']}: phát hiện giao dịch với KHLQ chưa khai báo trên bản KHLQ")
        cp_ids = str(meta.get("counterparty_tax_ids") or "")
        # If statement flags KHLQ MSTs not declared when KHLQ list exists, flag for review
        suspect_khlq = str(meta.get("related_party_tx_tax_ids") or "")
        if suspect_khlq and declared_khlq:
            missing_rel = [x.strip() for x in suspect_khlq.split(",") if x.strip() and x.strip() not in declared_khlq]
            if missing_rel:
                failures.append(f"{d['id']}: giao dịch với MST liên quan ({', '.join(missing_rel)}) chưa có trong khai báo KHLQ")
        _ = cp_ids

    if failures:
        return _make_rule(
            "R6", "bank_statement_reconcile",
            "Sao kê đối chiếu KHLQ, phải thu/phải trả, hợp đồng và dòng tiền",
            "FAIL", "; ".join(failures), doc_refs, evidence,
        )

    if not bs_docs:
        return _make_rule(
            "R6", "bank_statement_reconcile",
            "Sao kê đối chiếu KHLQ, phải thu/phải trả, hợp đồng và dòng tiền",
            "MISSING_DATA", "Chưa có sao kê tài khoản TCTD để đối chiếu.", doc_refs, evidence,
        )
    if flow == "B" and (not khlq_docs or not ar_docs or not ap_docs):
        return _make_rule(
            "R6", "bank_statement_reconcile",
            "Sao kê đối chiếu KHLQ, phải thu/phải trả, hợp đồng và dòng tiền",
            "MISSING_DATA", "Thiếu khai báo KHLQ hoặc báo cáo phải thu/phải trả để đối chiếu với sao kê.", doc_refs, evidence,
        )

    return _make_rule(
        "R6", "bank_statement_reconcile",
        "Sao kê đối chiếu KHLQ, phải thu/phải trả, hợp đồng và dòng tiền",
        "PASS", "Dòng tiền trên sao kê phù hợp khai báo KHLQ, công nợ và hợp đồng.", doc_refs, evidence,
    )


def _check_r7_collateral_prosland(
    case: dict[str, Any], ctx: dict[str, Any], evidence: dict[str, Any] | None, as_of: date
) -> dict[str, Any]:
    if ctx.get("facts.has_collateral_effective") is False:
        return _make_rule(
            "R7", "collateral_prosland",
            "Đối chiếu sở hữu/tài sản TSBĐ với Báo cáo định giá Prosland",
            "SKIPPED", "Hồ sơ không sử dụng tài sản bảo đảm.", [], evidence,
        )

    title_docs = _docs_of(case, "gcn_qsdd", "ho_so_tsbd", "dk_dang_kiem_ptvt", "dang_ky_xe_muc_dich")
    val_docs = _docs_of(case, "bc_dinh_gia_prosland", "chung_thu_dinh_gia")
    doc_refs = [d["id"] for d in title_docs + val_docs]

    if ctx.get("facts.has_collateral_effective") is None or ctx.get("facts.collateral_needs_valuation") is False:
        if ctx.get("facts.collateral_needs_valuation") is False:
            return _make_rule(
                "R7", "collateral_prosland",
                "Đối chiếu sở hữu/tài sản TSBĐ với Báo cáo định giá Prosland",
                "SKIPPED", "TSBĐ là tiền gửi/số dư không cần định giá Prosland.", doc_refs, evidence,
            )
        return _make_rule(
            "R7", "collateral_prosland",
            "Đối chiếu sở hữu/tài sản TSBĐ với Báo cáo định giá Prosland",
            "MISSING_DATA", "Chưa xác định thông tin TSBĐ của hồ sơ.", doc_refs, evidence,
        )

    if not title_docs or not val_docs:
        missing = []
        if not title_docs:
            missing.append("Hồ sơ pháp lý TSBĐ (GCN QSDĐ / Đăng ký xe)")
        if not val_docs:
            missing.append("Báo cáo định giá Prosland")
        return _make_rule(
            "R7", "collateral_prosland",
            "Đối chiếu sở hữu/tài sản TSBĐ với Báo cáo định giá Prosland",
            "MISSING_DATA", "Thiếu " + " và ".join(missing) + " để đối chiếu chéo.", doc_refs, evidence,
        )

    failures: list[str] = []
    # Check valuation recency (<= 12 months)
    for vd in val_docs:
        vdate_str = str(_meta_val(vd, "valuation_date") or vd.get("issued_date") or "").strip()
        if vdate_str:
            try:
                vdate = date.fromisoformat(vdate_str[:10])
                if _months_between(vdate, as_of) > 12:
                    failures.append(f"{vd['id']}: Báo cáo định giá Prosland đã quá hạn 12 tháng")
            except ValueError:
                pass

    title_owners = {_norm_str(_meta_val(d, "owner_name")) for d in title_docs if _meta_val(d, "owner_name")}
    val_owners = {_norm_str(_meta_val(d, "owner_name")) for d in val_docs if _meta_val(d, "owner_name")}
    if title_owners and val_owners and not (title_owners & val_owners):
        failures.append("Chủ sở hữu trên GCN/Đăng ký TSBĐ không khớp Báo cáo định giá Prosland")

    title_codes = {_norm_str(_meta_val(d, "asset_code", "plate_no")) for d in title_docs if _meta_val(d, "asset_code", "plate_no")}
    val_codes = {_norm_str(_meta_val(d, "asset_code", "plate_no")) for d in val_docs if _meta_val(d, "asset_code", "plate_no")}
    if title_codes and val_codes and not (title_codes & val_codes):
        failures.append("Mã thửa đất / số khung / biển số trên TSBĐ không khớp Báo cáo định giá Prosland")

    if failures:
        return _make_rule(
            "R7", "collateral_prosland",
            "Đối chiếu sở hữu/tài sản TSBĐ với Báo cáo định giá Prosland",
            "FAIL", "; ".join(failures), doc_refs, evidence,
        )

    return _make_rule(
        "R7", "collateral_prosland",
        "Đối chiếu sở hữu/tài sản TSBĐ với Báo cáo định giá Prosland",
        "PASS", "Thông tin chủ sở hữu, mã tài sản và hiệu lực định giá Prosland khớp hồ sơ TSBĐ.", doc_refs, evidence,
    )


def evaluate_crosschecks(
    case: dict[str, Any],
    evidence: dict[str, Any] | None = None,
    as_of: str = "",
    products_meta: dict[str, Any] | None = None,
) -> dict[str, Any]:
    """Run all 7 core cross-check rules on a case."""
    day_str = as_of or date.today().isoformat()
    day = date.fromisoformat(day_str[:10])
    ctx = normalize_context(case, products_meta)

    rules = [
        _check_r1_dkkd_anchor(case, evidence),
        _check_r2_ownership_authority(case, ctx, evidence),
        _check_r3_contract_roles(case, ctx, evidence),
        _check_r4_contract_vat_mapping(case, ctx, evidence),
        _check_r5_fin_vat_continuity(case, ctx, evidence),
        _check_r6_bank_statement_reconcile(case, ctx, evidence),
        _check_r7_collateral_prosland(case, ctx, evidence, day),
    ]

    counts = {st: 0 for st in RULE_STATUS_VALUES}
    for r in rules:
        counts[r["status"]] += 1

    if counts["FAIL"] > 0:
        overall = "FAIL"
    elif counts["MISSING_DATA"] > 0:
        overall = "INCOMPLETE"
    else:
        overall = "PASS"

    return {
        "as_of": day_str[:10],
        "overall_status": overall,
        "counts": counts,
        "rules": rules,
    }
