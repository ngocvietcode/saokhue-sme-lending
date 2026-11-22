"""Two-layer deterministic SME Master Checklist Engine (Luồng A & Luồng B).

Layer 1 (`condition`): evaluates whether an item applies to this dossier
using 3-valued Kleene logic -> True (applies), False (`SKIPPED`), or None
(`UNDETERMINED_CONDITION` with `missing_condition_fields`).

Layer 2 (`rule`): only evaluated when Layer 1 is True -> checks uploaded
documents, counts/sets, validity dates, anchor tax_id consistency, Flow A VAT
chains (8 quarterly / 24 monthly + digital signature), Flow B >= 3 contracts
with seller/buyer role & VAT invoice mapping, 12m bank statements, >= 5 site
photos, and substitute approval rules -> `PASS`, `MISSING_REQUIRED`, or `FAIL`.

Overall logic: if ANY group has `MISSING_REQUIRED`, `FAIL`, or
`UNDETERMINED_CONDITION`, `overall_status` is `"INCOMPLETE"`; else `"COMPLETE"`.
"""

from __future__ import annotations

from datetime import date
from typing import Any

from .collateral import _months_between

RULE_STATUSES = ("PASS", "MISSING_REQUIRED", "FAIL", "SKIPPED", "UNDETERMINED_CONDITION")

# Customer-friendly Vietnamese labels for missing condition triggers.
CONDITION_FIELD_LABELS = {
    "customer.legal_type_effective": "Loại hình doanh nghiệp (LLC_1/LLC_2/JSC/PRIVATE/PARTNERSHIP/COOP)",
    "customer.signer_is_legal_rep": "Người ký hồ sơ có phải ĐDPL không",
    "customer.borrower_is_branch": "Bên vay có phải Chi nhánh/VPĐD không",
    "customer.is_fdi": "Doanh nghiệp có vốn đầu tư nước ngoài (FDI) không",
    "customer.is_conditional_industry_effective": "Ngành nghề kinh doanh có điều kiện hay không",
    "customer.is_construction_effective": "Doanh nghiệp thuộc nhóm thi công/xây dựng hay không",
    "request.case_type": "Loại hồ sơ (NEW/RENEWAL/AMEND_CONDITION)",
    "request.product_code": "Sản phẩm tín dụng đề xuất",
    "request.purpose": "Mục đích cấp tín dụng",
    "request.purpose_is_fixed_asset": "Mục đích có phải đầu tư TSCĐ/mở rộng không",
    "request.sub_purpose": "Mục đích đầu tư chi tiết (mmtb/ptvt/xay_dung/mua_bds/du_an)",
    "request.amount_num": "Số tiền đề nghị cấp tín dụng",
    "facts.total_exposure_effective": "Tổng mức cấp tín dụng/dư nợ",
    "facts.has_fixed_assets_effective": "Doanh nghiệp có phát sinh TSCĐ hay không",
    "facts.has_other_bank_tx": "Khách hàng có giao dịch tại TCTD khác không",
    "facts.requires_bank_statement_flow_a": "Yêu cầu sao kê tài khoản TCTD (Luồng A)",
    "facts.has_collateral_effective": "Hồ sơ có tài sản bảo đảm (TSBĐ) hay không",
    "facts.collateral_types_set": "Loại tài sản bảo đảm (real_estate/vehicle/machinery/deposit)",
    "facts.collateral_needs_valuation": "TSBĐ có thuộc diện cần định giá Prosland không",
    "facts.has_deposit_paid": "Khách hàng đã đặt cọc/thanh toán MMTB chưa",
    "facts.is_imported": "MMTB/hàng hóa có nhập khẩu không",
    "facts.vehicle_registered": "PTVT đã đăng ký hoặc dùng làm TSBĐ chưa",
}

_CONSTRUCTION_PREFIXES = ("41", "42", "43")
_CONDITIONAL_INDUSTRY_PREFIXES = ("41", "42", "43", "461", "463", "464", "472", "49", "50", "55", "56", "85", "86")


def _present(val: Any) -> bool:
    if isinstance(val, bool):
        return True
    if isinstance(val, (set, list, tuple)):
        return len(val) > 0
    return val is not None and val != ""


def _parse_bool(val: Any) -> bool | None:
    if isinstance(val, bool):
        return val
    if isinstance(val, str):
        low = val.strip().lower()
        if low in ("true", "1", "yes", "co", "có"):
            return True
        if low in ("false", "0", "no", "khong", "không"):
            return False
    return None


def _parse_float(val: Any) -> float | None:
    if val is None or isinstance(val, bool):
        return None
    try:
        return float(val)
    except (ValueError, TypeError):
        return None


def _parse_csv_set(val: Any) -> set[str]:
    if isinstance(val, (set, list, tuple)):
        return {str(x).strip().lower() for x in val if str(x).strip()}
    if isinstance(val, str):
        return {x.strip().lower() for x in val.split(",") if x.strip()}
    return set()


def _has_doc(case: dict[str, Any], *doc_types: str) -> bool:
    wanted = set(doc_types)
    return any(d.get("type") in wanted for d in (case.get("documents") or []))


def _infer_legal_type(customer: dict[str, Any]) -> str | None:
    raw = customer.get("legal_type")
    if isinstance(raw, str) and raw.strip():
        return raw.strip().upper()
    name = str(customer.get("name") or "").lower()
    if not name:
        return None
    if any(tok in name for tok in ("mtv", "một thành viên", "1 thành viên", "1tv")):
        return "LLC_1"
    if any(tok in name for tok in ("2tv", "hai thành viên", "2 thành viên")):
        return "LLC_2"
    if "cổ phần" in name or "ctcp" in name or "jsc" in name:
        return "JSC"
    if "doanh nghiệp tư nhân" in name or "dntn" in name:
        return "PRIVATE"
    if "hợp danh" in name:
        return "PARTNERSHIP"
    if "hợp tác xã" in name or "htx" in name:
        return "COOP"
    # "TNHH" without specifying 1TV vs 2+TV stays None for bb_hop_vay clarity,
    # unless explicitly provided in customer.legal_type.
    return None


def normalize_context(case: dict[str, Any], products_meta: dict[str, Any] | None = None) -> dict[str, Any]:
    """Build normalized flat lookup dict over case attributes for Layer 1 conditions."""
    customer = dict(case.get("customer") or {})
    request = dict(case.get("request") or {})
    facts = dict(case.get("facts") or {})
    flow = (case.get("flow") or "A").upper()

    prod_list = (products_meta or {}).get("products", [])
    prod_map = {p["code"]: p for p in prod_list}
    pcode = request.get("product_code")
    product_obj = prod_map.get(str(pcode)) if _present(pcode) else None

    case_type = str(request.get("case_type") or "NEW").strip().upper()
    legal_type_eff = _infer_legal_type(customer)
    # Name "TNHH" without 1TV/2+TV still implies non-PRIVATE corporate form for charter/member list
    name_low = str(customer.get("name") or "").lower()
    is_tnhh_generic = legal_type_eff is None and ("tnhh" in name_low or "trách nhiệm hữu hạn" in name_low)

    ind_code = str(customer.get("industry_code") or "").strip()
    constr_prefixes = tuple((products_meta or {}).get("construction_industry_prefixes", _CONSTRUCTION_PREFIXES))
    cond_prefixes = tuple((products_meta or {}).get("conditional_industry_prefixes", _CONDITIONAL_INDUSTRY_PREFIXES))

    is_construction = _parse_bool(customer.get("is_construction"))
    if is_construction is None and ind_code:
        is_construction = ind_code.startswith(constr_prefixes)
    elif is_construction is None:
        is_construction = False

    is_cond_ind = _parse_bool(customer.get("is_conditional_industry"))
    if is_cond_ind is None and ind_code:
        is_cond_ind = ind_code.startswith(cond_prefixes)
    elif is_cond_ind is None:
        is_cond_ind = False

    # Collateral inference: explicit facts.has_collateral, OR collateral doc uploaded, OR product requires_collateral
    has_collateral = _parse_bool(facts.get("has_collateral"))
    if has_collateral is None:
        if _has_doc(case, "gcn_qsdd", "ho_so_tsbd", "dk_dang_kiem_ptvt", "bc_dinh_gia_prosland", "chung_thu_dinh_gia"):
            has_collateral = True
        elif product_obj is not None and product_obj.get("requires_collateral") is False and not _present(facts.get("collateral_types")):
            # Unsecured product like SME-WC -> False unless user states collateral
            has_collateral = False

    coll_types = _parse_csv_set(facts.get("collateral_types"))
    if not coll_types:
        if _has_doc(case, "gcn_qsdd", "ho_so_tsbd"):
            coll_types.add("real_estate")
        if _has_doc(case, "dk_dang_kiem_ptvt"):
            coll_types.add("vehicle")
    coll_types_eff: set[str] | None = coll_types if coll_types else None
    if has_collateral is False:
        coll_types_eff = set()

    coll_needs_val: bool | None
    if has_collateral is False:
        coll_needs_val = False
    elif coll_types_eff is None:
        coll_needs_val = None if has_collateral is None else True
    else:
        coll_needs_val = any(t != "deposit" for t in coll_types_eff)

    amount_num = _parse_float(request.get("amount"))
    existing_exp = _parse_float(facts.get("existing_exposure")) or 0.0
    total_exp = _parse_float(facts.get("total_exposure"))
    if total_exp is None and amount_num is not None:
        total_exp = amount_num + existing_exp

    purpose = str(request.get("purpose") or "").strip().lower() or None
    purpose_is_fa: bool | None = None
    if purpose is not None:
        purpose_is_fa = purpose in ("fixed_asset", "expansion")
    elif _present(pcode) and product_obj is not None:
        purposes = product_obj.get("purposes", [])
        if purposes == ["working_capital"]:
            purpose_is_fa = False

    sub_purpose = str(request.get("sub_purpose") or "").strip().lower() or None

    # Effective fixed assets flag: Flow B checks explicitly or infers undetermined if missing;
    # Flow A skips unless explicitly True or doc uploaded.
    has_fa = _parse_bool(facts.get("has_fixed_assets"))
    if has_fa is None:
        if _has_doc(case, "bc_khau_hao_tscd"):
            has_fa = True
        elif flow == "A":
            has_fa = False

    # Flow A conditional bank statement triggers if explicitly flagged OR uploaded.
    req_bs_flow_a = _parse_bool(facts.get("requires_bank_statement"))
    if req_bs_flow_a is None:
        req_bs_flow_a = _has_doc(case, "sao_ke_tk", "sao_ke_ngan_hang")

    signer_is_rep = _parse_bool(customer.get("signer_is_legal_rep"))
    if signer_is_rep is None:
        signer_is_rep = False if _has_doc(case, "uy_quyen_ky") else True

    borrower_is_branch = _parse_bool(customer.get("borrower_is_branch"))
    if borrower_is_branch is None:
        borrower_is_branch = _has_doc(case, "dkkd_chi_nhanh", "uy_quyen_chi_nhanh")

    is_fdi = _parse_bool(customer.get("is_fdi"))
    if is_fdi is None:
        is_fdi = _has_doc(case, "gcn_dau_tu")

    has_other_bank = _parse_bool(facts.get("has_other_bank_tx"))
    if has_other_bank is None and _has_doc(case, "sao_ke_tk", "sao_ke_ngan_hang"):
        has_other_bank = True

    def _opt_bool(src: dict[str, Any], key: str, *trigger_docs: str) -> bool:
        b = _parse_bool(src.get(key))
        if b is not None:
            return b
        return bool(trigger_docs and _has_doc(case, *trigger_docs))

    ctx: dict[str, Any] = {
        "flow": flow,
        "customer.legal_type": legal_type_eff,
        "customer.legal_type_effective": legal_type_eff or ("TNHH_UNKNOWN" if is_tnhh_generic else None),
        "customer.signer_is_legal_rep": signer_is_rep,
        "customer.borrower_is_branch": borrower_is_branch,
        "customer.is_fdi": is_fdi,
        "customer.is_conditional_industry_effective": is_cond_ind or _has_doc(case, "giay_phep_con"),
        "customer.is_construction_effective": is_construction,
        "request.case_type": case_type,
        "request.product_code": str(pcode) if _present(pcode) else None,
        "request.purpose": purpose,
        "request.purpose_is_fixed_asset": purpose_is_fa,
        "request.sub_purpose": sub_purpose,
        "request.amount_num": amount_num,
        "facts.total_exposure_effective": total_exp,
        "facts.is_renewal": _opt_bool(facts, "is_renewal", "nghi_quyet_lan_dau"),
        "facts.acp_applicable": _opt_bool(facts, "acp_applicable", "acp_plan"),
        "facts.requires_copy_attestation": _opt_bool(facts, "requires_copy_attestation", "cam_ket_doi_chieu"),
        "facts.needs_tax_cert": _opt_bool(facts, "needs_tax_cert", "gcn_mst"),
        "facts.requires_board_resolution": _opt_bool(facts, "requires_board_resolution", "bb_hop_vay"),
        "facts.requires_appointment_decision": _opt_bool(facts, "requires_appointment_decision", "qd_bo_nhiem"),
        "facts.requires_experience_profile": _opt_bool(facts, "requires_experience_profile", "ho_so_kinh_nghiem"),
        "facts.requires_investment_cert": _opt_bool(facts, "requires_investment_cert"),
        "facts.requires_marriage_cert": _opt_bool(facts, "requires_marriage_cert", "dk_ket_hon_dntn"),
        "facts.has_related_parties": _opt_bool(facts, "has_related_parties", "khai_bao_khlq"),
        "facts.mtxh_applicable": _opt_bool(facts, "mtxh_applicable", "phieu_thu_thap_mtxh", "phan_loai_mtxh"),
        "facts.requires_quarterly_fs": _opt_bool(facts, "requires_quarterly_fs", "bctc_quy"),
        "facts.requires_inventory_report": _opt_bool(facts, "requires_inventory_report", "bc_ton_kho"),
        "facts.requires_ar_report": _opt_bool(facts, "requires_ar_report", "bc_phai_thu"),
        "facts.requires_ap_report": _opt_bool(facts, "requires_ap_report", "bc_phai_tra"),
        "facts.has_fixed_assets_effective": has_fa,
        "facts.has_other_bank_tx": has_other_bank,
        "facts.requires_bank_statement_flow_a": req_bs_flow_a,
        "facts.requires_site_photos": _opt_bool(facts, "requires_site_photos", "anh_thuc_dia"),
        "facts.has_deposit_paid": _opt_bool(facts, "has_deposit_paid", "chung_tu_tt_mmtb"),
        "facts.is_imported": _opt_bool(facts, "is_imported", "bo_chung_tu_nk"),
        "facts.vehicle_registered": _opt_bool(facts, "vehicle_registered", "dang_ky_xe_muc_dich"),
        "facts.requires_construction_permit": (
            _parse_bool(facts.get("requires_construction_permit"))
            if "requires_construction_permit" in facts
            else True
        ),
        "facts.has_collateral_effective": has_collateral,
        "facts.collateral_types_set": coll_types_eff,
        "facts.collateral_needs_valuation": coll_needs_val,
        "facts.allow_tp_kd_substitute": _opt_bool(facts, "allow_tp_kd_substitute"),
        "facts.requires_tp_kd_approval": _opt_bool(facts, "requires_tp_kd_approval", "pd_tp_kd_sme"),
        "facts.vat_filing_cycle": (facts.get("vat_filing_cycle") or "").strip().lower() or None,
        "facts.cic_checked": _parse_bool(facts.get("cic_checked")),
    }
    return ctx


def eval_condition(cond: dict[str, Any], ctx: dict[str, Any]) -> tuple[bool | None, list[str]]:
    """Evaluate Layer 1 condition with 3-valued Kleene logic.

    Returns `(applicable, missing_fields)`:
    - `(True, [])`  -> item applies; Layer 2 must run.
    - `(False, [])` -> `SKIPPED` (does not apply).
    - `(None, [...])` -> `UNDETERMINED_CONDITION` (missing condition data).
    """
    op = cond.get("op", "always")
    if op == "always":
        return True, []

    if op == "all":
        missing: list[str] = []
        has_none = False
        for sub in cond.get("args", []):
            res, m = eval_condition(sub, ctx)
            if res is False:
                return False, []
            if res is None:
                has_none = True
                for f in m:
                    if f not in missing:
                        missing.append(f)
        return (None, missing) if has_none else (True, [])

    if op == "any":
        missing = []
        has_none = False
        for sub in cond.get("args", []):
            res, m = eval_condition(sub, ctx)
            if res is True:
                return True, []
            if res is None:
                has_none = True
                for f in m:
                    if f not in missing:
                        missing.append(f)
        return (None, missing) if has_none else (False, [])

    if op == "not":
        res, m = eval_condition(cond["arg"], ctx)
        if res is None:
            return None, m
        return (not res), []

    field = cond["field"]
    val = ctx.get(field)

    # Special handling for generic TNHH name on corporate form items:
    # A generic TNHH is definitely either LLC_1 or LLC_2 (never JSC or PRIVATE).
    if val == "TNHH_UNKNOWN":
        possible = {"LLC_1", "LLC_2"}
        if op == "in":
            vals = set(cond.get("values", []))
            if possible <= vals:
                return True, []
            if not (possible & vals):
                return False, []
            return None, [field]
        if op == "eq":
            return (None, [field]) if cond.get("value") in possible else (False, [])
        if op == "not_eq":
            return (None, [field]) if cond.get("value") in possible else (True, [])
        return None, [field]

    if val is None:
        return None, [field]

    if op == "eq":
        return (val == cond["value"]), []
    if op == "not_eq":
        return (val != cond["value"]), []
    if op == "in":
        return (val in cond.get("values", [])), []
    if op == "contains":
        if isinstance(val, (set, list, tuple)):
            return (cond["value"] in val), []
        return (str(cond["value"]) in str(val)), []
    if op == "gte":
        fval = _parse_float(val)
        if fval is None:
            return None, [field]
        return (fval >= float(cond["value"])), []

    raise ValueError(f"unsupported condition op: {op!r}")


def _anchor_tax_id(case: dict[str, Any]) -> str:
    cust_tid = str((case.get("customer") or {}).get("tax_id") or "").strip()
    if cust_tid:
        return cust_tid
    for d in case.get("documents") or []:
        if d.get("type") == "dkkd":
            mtid = str((d.get("meta") or {}).get("tax_id") or (d.get("sample_extract") or {}).get("tax_id") or "").strip()
            if mtid:
                return mtid
    return ""


def evaluate_item_rule(
    item: dict[str, Any],
    case: dict[str, Any],
    docs_catalog: dict[str, Any],
    ctx: dict[str, Any],
    as_of: date,
) -> tuple[str, list[str], list[str]]:
    """Evaluate Layer 2 document & rule requirements for an applicable item.

    Returns `(rule_status, document_refs, fail_reasons)`.
    `rule_status` is one of `"PASS"`, `"MISSING_REQUIRED"`, or `"FAIL"`.
    """
    code = item["code"]
    docs = case.get("documents") or []
    rule = item.get("rule") or {}
    flow = ctx["flow"]

    accepted_types = list(item.get("doc_types") or [code])
    sub_flag = rule.get("allow_substitute_when_flag")
    using_substitute = False
    if sub_flag and ctx.get(f"facts.{sub_flag}") is True:
        accepted_types.extend(item.get("substitute_doc_types") or [])
        using_substitute = True

    accepted_set = set(accepted_types)
    matching = [d for d in docs if d.get("type") in accepted_set]
    refs = [d["id"] for d in matching]

    # Check non-file data satisfaction (e.g., CIC report already loaded via integration)
    if not matching:
        if rule.get("allow_cic_data") and (
            ctx.get("facts.cic_checked") is True or (case.get("customer") or {}).get("sample_cic") is not None
        ):
            return "PASS", [], []
        return "MISSING_REQUIRED", [], []

    fail_reasons: list[str] = []
    catalog_types = docs_catalog.get("types", {})

    # 1. Validity period check (when rule enables check_validity or catalog defines validity_months)
    if rule.get("check_validity"):
        validity_months_vals = [
            catalog_types.get(d.get("type") or "", {}).get("validity_months")
            for d in matching
        ]
        months = next((m for m in validity_months_vals if isinstance(m, int) and m > 0), None)
        if months:
            dated: list[tuple[dict[str, Any], date]] = []
            for d in matching:
                if d.get("issued_date"):
                    try:
                        dated.append((d, date.fromisoformat(str(d["issued_date"])[:10])))
                    except ValueError:
                        continue
            if dated:
                _, newest_day = max(dated, key=lambda pair: pair[1])
                age = _months_between(newest_day, as_of)
                if age > months:
                    fail_reasons.append(f"Chứng từ đã hết hiệu lực ({age} tháng > {months} tháng)")

    # 2. Anchor MST check against customer / DKKD tax_id
    if rule.get("match_anchor_tax_id"):
        anchor_tid = _anchor_tax_id(case)
        if anchor_tid:
            for d in matching:
                dtid = str((d.get("meta") or {}).get("tax_id") or "").strip()
                if dtid and dtid != anchor_tid:
                    fail_reasons.append(f"{d['id']} có MST {dtid} không khớp MST doanh nghiệp ({anchor_tid})")

    # 3. Flow A VAT chain rule: >= 8 quarterly or >= 24 monthly + digital signature/chain
    if flow == "A" and rule.get("flow_a_vat_chain"):
        chain_cfg = rule["flow_a_vat_chain"]
        cycle = ctx.get("facts.vat_filing_cycle")
        if not cycle:
            for d in matching:
                c = str((d.get("meta") or {}).get("filing_cycle") or "").strip().lower()
                if c in ("quarterly", "monthly"):
                    cycle = c
                    break
        min_periods = int(chain_cfg["monthly"] if cycle == "monthly" else chain_cfg["quarterly"])
        period_total = sum(int((d.get("meta") or {}).get("periods_count", 1)) for d in matching)
        if period_total < min_periods:
            cycle_txt = "tháng" if cycle == "monthly" else "quý"
            fail_reasons.append(
                f"Luồng A yêu cầu tối thiểu {min_periods} kỳ tờ khai VAT (khai {cycle_txt}), hiện có {period_total} kỳ"
            )
        if any((d.get("meta") or {}).get("continuous_chain") is False for d in matching):
            fail_reasons.append("Chuỗi kỳ tờ khai VAT bị gián đoạn (không liên tục)")
        if rule.get("flow_a_require_signature") and any(
            (d.get("meta") or {}).get("signature_valid") is False for d in matching
        ):
            fail_reasons.append("Tờ khai VAT chưa có chữ ký số / dấu xác nhận hợp lệ")

    # 4. Contract party role & VAT invoice mapping (hop_dong_dau_ra / hop_dong_dau_vao)
    req_role = rule.get("required_customer_role")
    if req_role:
        role_vi = "bên bán" if req_role == "seller" else "bên mua"
        for d in matching:
            actual_role = str((d.get("meta") or {}).get("customer_role") or "").strip().lower()
            if actual_role and actual_role != req_role:
                fail_reasons.append(f"{d['id']}: vai trò khách hàng phải là {role_vi} (đang ghi {actual_role})")

        # Gather counterparty MSTs covered by standalone hoa_don_vat documents
        vat_invoice_msts = {
            str((d.get("meta") or {}).get("counterparty_tax_id") or "").strip()
            for d in docs
            if d.get("type") == "hoa_don_vat" and str((d.get("meta") or {}).get("counterparty_tax_id") or "").strip()
        }

        min_sets = int(rule.get("flow_b_min_sets", 3) if flow == "B" else rule.get("flow_a_min_sets", 1))
        total_sets = 0
        matched_sets = 0
        for d in matching:
            meta = d.get("meta") or {}
            cnt = int(meta.get("contract_count", 1))
            total_sets += cnt
            cp_mst = str(meta.get("counterparty_tax_id") or "").strip()
            has_vat = meta.get("vat_invoice_matched")
            if has_vat is True or (cp_mst and cp_mst in vat_invoice_msts):
                matched_sets += cnt
            elif has_vat is False:
                fail_reasons.append(f"{d['id']}: hợp đồng chưa có hóa đơn VAT mapping hợp lệ theo MST đối tác")
        if total_sets < min_sets:
            fail_reasons.append(f"Cần tối thiểu {min_sets} bộ hợp đồng (hiện có {total_sets})")
        elif flow == "B" and matched_sets < min_sets and any("vat_invoice_matched" in (d.get("meta") or {}) for d in matching):
            fail_reasons.append(f"Chỉ có {matched_sets}/{min_sets} hợp đồng đủ hóa đơn VAT đối chiếu theo MST đối tác")

    # 5. Bank statement 12-month rule in Flow A
    if flow == "A" and rule.get("flow_a_min_months"):
        req_m = int(rule["flow_a_min_months"])
        explicit_months = [
            _parse_float((d.get("meta") or {}).get("months_covered"))
            for d in matching
            if (d.get("meta") or {}).get("months_covered") is not None
        ]
        if explicit_months and max(explicit_months) < req_m:
            fail_reasons.append(f"Sao kê tài khoản Luồng A yêu cầu tối thiểu {req_m} tháng (hiện có {int(max(explicit_months))} tháng)")

    # 6. Flow A site photos >= 5
    if flow == "A" and rule.get("flow_a_min_photos"):
        req_p = int(rule["flow_a_min_photos"])
        photo_total = sum(int((d.get("meta") or {}).get("photo_count", 1)) for d in matching)
        if photo_total < req_p:
            fail_reasons.append(f"Luồng A yêu cầu tối thiểu {req_p} ảnh thực địa (hiện có {photo_total} ảnh)")

    if fail_reasons:
        return "FAIL", refs, fail_reasons
    if using_substitute and any(d.get("type") in (item.get("substitute_doc_types") or []) for d in matching):
        # Substitute approved by configuration passes deterministically
        return "PASS", refs, []
    return "PASS", refs, []


def evaluate_checklist(
    case: dict[str, Any],
    master_spec: dict[str, Any],
    docs_catalog: dict[str, Any],
    as_of: str = "",
    products_meta: dict[str, Any] | None = None,
) -> dict[str, Any]:
    """Run the full 9-group two-layer Master Checklist on a dossier/case."""
    day_str = as_of or date.today().isoformat()
    day = date.fromisoformat(day_str[:10])
    ctx = normalize_context(case, products_meta)
    catalog_types = docs_catalog.get("types", {})

    evaluated_items: list[dict[str, Any]] = []
    counts = {st: 0 for st in RULE_STATUSES}
    group_defs = master_spec.get("groups", [])
    group_map: dict[str, dict[str, Any]] = {
        g["code"]: {
            "group": g["code"],
            "label": g["label"],
            "status": "SKIPPED",
            "counts": {st: 0 for st in RULE_STATUSES},
            "total_applicable": 0,
        }
        for g in group_defs
    }

    for item in master_spec.get("items", []):
        code = item["code"]
        grp = item["group"]
        app, missing_fields = eval_condition(item.get("condition") or {"op": "always"}, ctx)
        cat_meta = catalog_types.get(code, {})
        ask = cat_meta.get("ask", "") if item["owner_role"] == "CUSTOMER" else ""
        alternatives = cat_meta.get("alternatives", []) if item["owner_role"] == "CUSTOMER" else []

        if app is False:
            rule_status = "SKIPPED"
            refs: list[str] = []
            fail_reasons: list[str] = []
        elif app is None:
            rule_status = "UNDETERMINED_CONDITION"
            refs = [
                d["id"]
                for d in (case.get("documents") or [])
                if d.get("type") in set(item.get("doc_types") or [code])
            ]
            missing_labels = [CONDITION_FIELD_LABELS.get(f, f) for f in missing_fields]
            fail_reasons = [f"Chưa đủ dữ liệu xác định điều kiện áp dụng: {', '.join(missing_labels)}"]
        else:
            rule_status, refs, fail_reasons = evaluate_item_rule(item, case, docs_catalog, ctx, day)

        counts[rule_status] += 1
        g_entry = group_map.setdefault(
            grp,
            {"group": grp, "label": grp, "status": "SKIPPED", "counts": {st: 0 for st in RULE_STATUSES}, "total_applicable": 0},
        )
        g_entry["counts"][rule_status] += 1
        if rule_status != "SKIPPED":
            g_entry["total_applicable"] += 1

        evaluated_items.append({
            "code": code,
            "key": f"doc:{code}",
            "group": grp,
            "title": item["title"],
            "owner_role": item["owner_role"],
            "doc_types": item.get("doc_types") or [code],
            "condition_label": item.get("condition_label", ""),
            "rule_label": item.get("rule_label", ""),
            "applicable": rule_status != "SKIPPED",
            "rule_status": rule_status,
            "document_refs": refs,
            "fail_reasons": fail_reasons,
            "missing_condition_fields": missing_fields,
            "crosscheck_refs": item.get("crosscheck_refs") or [],
            "ask": ask,
            "alternatives": alternatives,
        })

    for g_entry in group_map.values():
        gc = g_entry["counts"]
        if gc["MISSING_REQUIRED"] or gc["FAIL"] or gc["UNDETERMINED_CONDITION"]:
            g_entry["status"] = "INCOMPLETE"
        elif g_entry["total_applicable"] == 0:
            g_entry["status"] = "SKIPPED"
        else:
            g_entry["status"] = "COMPLETE"

    has_incomplete_group = any(g["status"] == "INCOMPLETE" for g in group_map.values())
    overall_status = "INCOMPLETE" if has_incomplete_group else "COMPLETE"

    return {
        "version": master_spec.get("version", "master-1.0"),
        "as_of": day_str[:10],
        "flow": ctx["flow"],
        "overall_status": overall_status,
        "counts": counts,
        "groups": list(group_map.values()),
        "items": evaluated_items,
    }
