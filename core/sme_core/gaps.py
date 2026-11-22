"""Deterministic dossier gap analysis: what a case still lacks before submission.

Pure functions over a case and the knowledge pack, no model involved, so Sales
and Underwriting see exactly the same list for the same dossier. Every check is
reported, satisfied or not, so the readiness score has a fixed denominator.

A check's `key` is stable across runs (`doc:bctc_2_ky`, `field:request.amount`,
`fact:years_in_operation`, `policy:C1`), which is what lets the requirement
store keep a human's status (requested, waived) on the same item between runs.
"""

from __future__ import annotations

from datetime import date
from typing import Any

from .collateral import _months_between

BLOCKING_WEIGHT = 2
ADVISORY_WEIGHT = 1


def _get(case: dict[str, Any], dotted: str) -> Any:
    head, _, tail = dotted.partition(".")
    return (case.get(head) or {}).get(tail)


def _present(value: Any) -> bool:
    return value is not None and value != "" and value != []


def _check(key: str, kind: str, group: str, title: str, *, ok: bool, blocking: bool,
           reason: str = "", ask: str = "", alternatives: list[str] | None = None,
           refs: list[str] | None = None) -> dict[str, Any]:
    return {"key": key, "kind": kind, "group": group, "title": title, "ok": ok, "blocking": blocking,
            "reason": reason, "ask": ask, "alternatives": alternatives or [], "document_refs": refs or []}


def _field_checks(case: dict[str, Any], catalog: dict[str, Any]) -> list[dict[str, Any]]:
    out = []
    for path, meta in catalog.get("fields", {}).items():
        ok = _present(_get(case, path))
        out.append(_check(f"field:{path}", "field", meta["group"], f"Nhập {meta['label'].lower()}",
                          ok=ok, blocking=True, reason="Thông tin bắt buộc của hồ sơ"))
    return out


def _document_checks(case: dict[str, Any], required: list[str], catalog: dict[str, Any],
                     as_of: date) -> list[dict[str, Any]]:
    types = catalog.get("types", {})
    docs = case.get("documents") or []
    out = []
    for t in required:
        meta = types.get(t, {"label": t, "group": "phap_ly", "validity_months": None, "ask": t, "alternatives": []})
        mine = [d for d in docs if d.get("type") == t]
        base = dict(group=meta["group"], ask=meta.get("ask", ""), alternatives=meta.get("alternatives", []))
        if not mine:
            out.append(_check(f"doc:{t}", "document", title=f"Bổ sung {meta['label']}", ok=False, blocking=True,
                              reason="Chứng từ bắt buộc theo checklist sản phẩm", **base))
            continue
        refs = [d["id"] for d in mine]
        out.append(_check(f"doc:{t}", "document", title=f"Bổ sung {meta['label']}", ok=True, blocking=True,
                          refs=refs, **base))
        months = meta.get("validity_months")
        if not months:
            continue
        dated = [d for d in mine if d.get("issued_date")]
        if not dated:
            out.append(_check(f"date:{t}", "document_date", title=f"Ghi ngày lập của {meta['label']}", ok=False,
                              blocking=False, refs=refs,
                              reason=f"Cần ngày lập để kiểm tra hiệu lực {months} tháng", **base))
            continue
        newest = max(dated, key=lambda d: d["issued_date"])
        age = _months_between(date.fromisoformat(newest["issued_date"]), as_of)
        out.append(_check(f"expired:{t}", "document_expired", title=f"Cập nhật {meta['label']} mới hơn",
                          ok=age <= months, blocking=True, refs=[newest["id"]],
                          reason=f"Bản mới nhất lập cách đây {age} tháng, hiệu lực tối đa {months} tháng", **base))
    return out


def _known_facts(case: dict[str, Any]) -> dict[str, Any]:
    facts = dict(case.get("facts") or {})
    request = case.get("request") or {}
    if _present(request.get("amount")):
        facts.setdefault("loan_amount", request["amount"])
    if _present(request.get("term_months")):
        facts.setdefault("term_months", request["term_months"])
    return facts


def _policy_checks(case: dict[str, Any], catalog: dict[str, Any], policy: dict[str, Any] | None,
                   precheck: dict[str, Any] | None) -> list[dict[str, Any]]:
    """Facts Sales can supply, and a pre-check of the conditions they already decide.

    Facts only Underwriting produces (DSCR, LTV, CIC group) are not Sales' gaps
    and are left out; their conditions are evaluated in the underwriting app.
    """
    if not policy:
        return []
    sales_facts = catalog.get("sales_facts", {})
    facts = _known_facts(case)
    out = []
    wanted = {c["fact"] for c in policy.get("conditions", [])} & set(sales_facts)
    for fact in sorted(wanted):
        meta = sales_facts[fact]
        out.append(_check(f"fact:{fact}", "fact", meta["group"], f"Xác định {meta['label'].lower()}",
                          ok=_present(facts.get(fact)), blocking=True,
                          reason=f"Chính sách {policy.get('product_code')} {policy.get('version')} cần dữ kiện này"))
    for row in (precheck or {}).get("matrix", []):
        if row["status"] not in ("met", "not_met"):
            continue
        clause = row.get("clause") or row["id"]
        out.append(_check(f"policy:{row['id']}", "policy_precheck", "nhu_cau",
                          f"Điều kiện {row['fact']} {row['op']} {row['threshold']}", ok=row["status"] == "met",
                          blocking=False,
                          reason=f"Sơ bộ: thực tế {row.get('actual')}, yêu cầu {row['op']} {row['threshold']} ({clause}). "
                                 "Không đạt thì cần cơ cấu lại đề xuất hoặc xin ngoại lệ qua Thẩm định."))
    return out


def analyse(case: dict[str, Any], *, checklist: list[str], catalog: dict[str, Any],
            policy: dict[str, Any] | None, precheck: dict[str, Any] | None, as_of: str) -> list[dict[str, Any]]:
    """Every check for this dossier, in display order."""
    day = date.fromisoformat(as_of)
    return (_field_checks(case, catalog) + _document_checks(case, checklist, catalog, day)
            + _policy_checks(case, catalog, policy, precheck))


def readiness(checks: list[dict[str, Any]], statuses: dict[str, str]) -> dict[str, Any]:
    """Score and submit-readiness. A waived item counts as satisfied but is listed."""
    total = done = 0
    blocking_open, waived = [], []
    for c in checks:
        w = BLOCKING_WEIGHT if c["blocking"] else ADVISORY_WEIGHT
        total += w
        st = statuses.get(c["key"])
        if c["ok"] or st == "waived":
            done += w
            if not c["ok"]:
                waived.append(c["key"])
        elif c["blocking"]:
            blocking_open.append(c["key"])
    return {"score": round(100 * done / total) if total else 100, "ready": not blocking_open,
            "blocking_open": blocking_open, "waived": waived}
