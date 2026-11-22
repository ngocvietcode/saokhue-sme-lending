"""Deterministic dossier gap analysis powered by the two-layer Master Checklist Engine.

Combines:
1. Essential intake fields (`customer.*`, `request.*`).
2. The unified 9-group Master Checklist (A -> I) with separate Layer 1 applicability
   conditions and Layer 2 document/rule verification, producing the 5 canonical statuses:
   `PASS`, `MISSING_REQUIRED`, `FAIL`, `SKIPPED`, `UNDETERMINED_CONDITION`.
3. Advisory missing-date alerts and preliminary policy checks.

`SKIPPED` items carry `applicable=False` and `ok=True`; they are excluded from
score denominators and active blockers, and are hidden by default on the UI.
"""

from __future__ import annotations

from datetime import date
from typing import Any

from .checklist_engine import evaluate_checklist
from .collateral import _months_between

BLOCKING_WEIGHT = 2
ADVISORY_WEIGHT = 1

FACT_LABELS = {
    "loan_amount": "Số tiền vay",
    "term_months": "Kỳ hạn vay",
    "years_in_operation": "Số năm hoạt động",
    "equity_contribution_pct": "Tỷ lệ vốn tự có",
}


def _fmt_fact(fact: str, val: Any) -> str:
    if val is None or isinstance(val, bool):
        return "—"
    try:
        n = float(val)
    except (ValueError, TypeError):
        return str(val)
    if fact == "loan_amount":
        if abs(n) >= 1e9:
            return f"{n / 1e9:g} tỷ"
        if abs(n) >= 1e6:
            return f"{n / 1e6:g} triệu"
        return f"{int(round(n)):,} đ".replace(",", ".")
    num_str = str(int(n)) if n.is_integer() else f"{n:g}"
    if fact == "term_months":
        return f"{num_str} tháng"
    if fact == "years_in_operation":
        return f"{num_str} năm"
    if fact == "equity_contribution_pct":
        return f"{num_str}%"
    return num_str


def _get(case: dict[str, Any], dotted: str) -> Any:
    head, _, tail = dotted.partition(".")
    return (case.get(head) or {}).get(tail)


def _present(value: Any) -> bool:
    return value is not None and value != "" and value != []


def _check(
    key: str,
    kind: str,
    group: str,
    title: str,
    *,
    ok: bool,
    blocking: bool,
    owner_role: str = "CUSTOMER",
    applicable: bool = True,
    rule_status: str = "PASS",
    is_master_item: bool = False,
    reason: str = "",
    ask: str = "",
    alternatives: list[str] | None = None,
    refs: list[str] | None = None,
    condition_label: str = "",
    rule_label: str = "",
    fail_reasons: list[str] | None = None,
    missing_condition_fields: list[str] | None = None,
    crosscheck_refs: list[str] | None = None,
) -> dict[str, Any]:
    return {
        "key": key,
        "kind": kind,
        "group": group,
        "title": title,
        "owner_role": owner_role,
        "applicable": applicable,
        "rule_status": rule_status,
        "is_master_item": is_master_item,
        "ok": ok,
        "blocking": blocking,
        "reason": reason,
        "ask": ask,
        "alternatives": alternatives or [],
        "document_refs": refs or [],
        "condition_label": condition_label,
        "rule_label": rule_label,
        "fail_reasons": fail_reasons or [],
        "missing_condition_fields": missing_condition_fields or [],
        "crosscheck_refs": crosscheck_refs or [],
    }


def _field_checks(case: dict[str, Any], catalog: dict[str, Any]) -> list[dict[str, Any]]:
    out = []
    for path, meta in catalog.get("fields", {}).items():
        ok = _present(_get(case, path))
        out.append(_check(
            f"field:{path}",
            "field",
            meta["group"],
            f"Nhập {meta['label'].lower()}",
            ok=ok,
            blocking=True,
            owner_role="RM_INTERNAL",
            rule_status="PASS" if ok else "MISSING_REQUIRED",
            reason="Thông tin định danh / đề xuất bắt buộc của hồ sơ",
        ))
    return out


def _master_checks(
    case: dict[str, Any],
    master_eval: dict[str, Any],
    catalog: dict[str, Any],
) -> list[dict[str, Any]]:
    types = catalog.get("types", {})
    docs = case.get("documents") or []
    out: list[dict[str, Any]] = []
    seen_date_types: set[str] = set()

    for m in master_eval.get("items", []):
        rst = m["rule_status"]
        ok = rst in ("PASS", "SKIPPED")
        blocking = rst in ("MISSING_REQUIRED", "FAIL", "UNDETERMINED_CONDITION")
        if rst == "SKIPPED":
            reason = f"Không áp dụng: {m['condition_label']}"
        elif rst in ("FAIL", "UNDETERMINED_CONDITION") and m["fail_reasons"]:
            reason = "; ".join(m["fail_reasons"])
        elif rst == "MISSING_REQUIRED":
            reason = m["condition_label"]
        else:
            reason = ""

        out.append(_check(
            m["key"],
            "document",
            m["group"],
            m["title"],
            ok=ok,
            blocking=blocking,
            owner_role=m["owner_role"],
            applicable=m["applicable"],
            rule_status=rst,
            is_master_item=True,
            reason=reason,
            ask=m["ask"],
            alternatives=m["alternatives"],
            refs=m["document_refs"],
            condition_label=m["condition_label"],
            rule_label=m["rule_label"],
            fail_reasons=m["fail_reasons"],
            missing_condition_fields=m["missing_condition_fields"],
            crosscheck_refs=m["crosscheck_refs"],
        ))

        # Advisory missing issued_date reminder when an uploaded applicable document type requires validity check
        if rst in ("PASS", "FAIL"):
            for dt in m.get("doc_types", []):
                if dt in seen_date_types:
                    continue
                months = types.get(dt, {}).get("validity_months")
                if not months:
                    continue
                mine = [d for d in docs if d.get("type") == dt]
                if mine and not any(d.get("issued_date") for d in mine):
                    seen_date_types.add(dt)
                    label = types[dt].get("label", dt)
                    out.append(_check(
                        f"date:{dt}",
                        "document_date",
                        m["group"],
                        f"Ghi ngày lập của {label}",
                        ok=False,
                        blocking=False,
                        owner_role="RM_INTERNAL",
                        rule_status="MISSING_REQUIRED",
                        refs=[d["id"] for d in mine],
                        reason=f"Cần ngày lập (YYYY-MM-DD) để kiểm tra hiệu lực {months} tháng",
                    ))
    return out


def known_facts(case: dict[str, Any], as_of: date) -> dict[str, Any]:
    facts = dict(case.get("facts") or {})
    request = case.get("request") or {}
    customer = case.get("customer") or {}
    if _present(request.get("amount")):
        facts.setdefault("loan_amount", request["amount"])
    if _present(request.get("term_months")):
        facts.setdefault("term_months", request["term_months"])
    if not _present(facts.get("years_in_operation")):
        if _present(customer.get("years_in_operation")):
            facts["years_in_operation"] = customer["years_in_operation"]
        elif _present(customer.get("established")):
            try:
                est = date.fromisoformat(str(customer["established"])[:10])
                facts["years_in_operation"] = max(0, _months_between(est, as_of) // 12)
            except ValueError:
                pass
    return facts


def _policy_checks(
    case: dict[str, Any],
    catalog: dict[str, Any],
    policy: dict[str, Any] | None,
    precheck: dict[str, Any] | None,
    as_of: date,
) -> list[dict[str, Any]]:
    """Facts Sales can supply, and a pre-check of the conditions they already decide."""
    if not policy:
        return []
    sales_facts = catalog.get("sales_facts", {})
    facts = known_facts(case, as_of)
    out = []
    wanted = {c["fact"] for c in policy.get("conditions", [])} & set(sales_facts)
    for fact in sorted(wanted):
        meta = sales_facts[fact]
        ok = _present(facts.get(fact))
        out.append(_check(
            f"fact:{fact}",
            "fact",
            meta["group"],
            f"Xác định {meta['label'].lower()}",
            ok=ok,
            blocking=True,
            owner_role="RM_INTERNAL",
            rule_status="PASS" if ok else "MISSING_REQUIRED",
            reason=f"Chính sách {policy.get('product_code')} {policy.get('version')} cần dữ kiện này",
        ))
    for row in (precheck or {}).get("matrix", []):
        if row["status"] not in ("met", "not_met"):
            continue
        clause = row.get("clause") or row["id"]
        label = FACT_LABELS.get(row["fact"], row["fact"])
        req_txt = f"{row['op']} {_fmt_fact(row['fact'], row['threshold'])}"
        act_txt = _fmt_fact(row["fact"], row.get("actual"))
        out.append(_check(
            f"policy:{row['id']}",
            "policy_precheck",
            "A",
            f"{label} {req_txt}",
            ok=row["status"] == "met",
            blocking=False,
            owner_role="RM_INTERNAL",
            rule_status="PASS" if row["status"] == "met" else "FAIL",
            reason=f"Sơ bộ: thực tế {act_txt}, yêu cầu {req_txt} ({clause}). "
                   "Không đạt thì cần cơ cấu lại đề xuất hoặc xin ngoại lệ qua Thẩm định.",
        ))
    return out


def analyse(
    case: dict[str, Any],
    *,
    master_spec: dict[str, Any],
    catalog: dict[str, Any],
    policy: dict[str, Any] | None,
    precheck: dict[str, Any] | None,
    as_of: str,
    products: dict[str, Any] | None = None,
    master_eval: dict[str, Any] | None = None,
) -> tuple[list[dict[str, Any]], dict[str, Any]]:
    """Evaluate all checks (fields, two-layer Master Checklist A-I, dates, policy precheck)."""
    day = date.fromisoformat(as_of[:10])
    if master_eval is None:
        master_eval = evaluate_checklist(case, master_spec, catalog, as_of=as_of, products_meta=products)

    checks = _field_checks(case, catalog)
    req = case.get("request") or {}
    pcode = req.get("product_code")
    if products and _present(pcode):
        prod_map = {p["code"]: p for p in products.get("products", [])}
        if str(pcode) not in prod_map:
            checks.append(_check(
                "field:request.product_code_valid",
                "field",
                "A",
                f"Chọn đúng mã sản phẩm (đang ghi: {pcode})",
                ok=False,
                blocking=True,
                owner_role="RM_INTERNAL",
                rule_status="FAIL",
                reason="Mã sản phẩm không khớp danh mục nên chưa xác định đầy đủ rule sản phẩm",
            ))
        elif _present(req.get("purpose")) and str(req["purpose"]) not in prod_map[str(pcode)].get("purposes", []):
            allowed = ", ".join(prod_map[str(pcode)].get("purposes", []))
            checks.append(_check(
                "policy:purpose",
                "policy_precheck",
                "A",
                "Mục đích vay chưa khớp sản phẩm đề xuất",
                ok=False,
                blocking=False,
                owner_role="RM_INTERNAL",
                rule_status="FAIL",
                reason=f"Sản phẩm {pcode} áp dụng cho {allowed}; hồ sơ đang ghi {req['purpose']}.",
            ))

    checks += _master_checks(case, master_eval, catalog)
    checks += _policy_checks(case, catalog, policy, precheck, day)
    return checks, master_eval


def readiness(checks: list[dict[str, Any]], statuses: dict[str, str]) -> dict[str, Any]:
    """Score and submit-readiness over APPLICABLE checks (`SKIPPED` excluded)."""
    total = done = 0
    blocking_open, waived = [], []
    for c in checks:
        if not c.get("applicable", True) or c.get("rule_status") == "SKIPPED":
            continue
        w = BLOCKING_WEIGHT if c["blocking"] else ADVISORY_WEIGHT
        total += w
        st = statuses.get(c["key"])
        if c["ok"] or st == "waived":
            done += w
            if not c["ok"]:
                waived.append(c["key"])
        elif c["blocking"]:
            blocking_open.append(c["key"])
    return {
        "score": round(100 * done / total) if total else 100,
        "ready": not blocking_open,
        "blocking_open": blocking_open,
        "waived": waived,
    }
