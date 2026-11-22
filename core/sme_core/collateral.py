"""Deterministic collateral checks: valuation validity and LTV."""

from __future__ import annotations

from datetime import date
from typing import Any


def _months_between(start: date, end: date) -> int:
    months = (end.year - start.year) * 12 + (end.month - start.month)
    if end.day < start.day:
        months -= 1
    return months


def collateral_ltv(
    loan_amount: float,
    assets: list[dict[str, Any]],
    as_of: str,
    rules: dict[str, Any],
) -> dict[str, Any]:
    """Check each asset's valuation age and compute LTV on valid assets.

    `assets` items: {id, type, value, valuation_date (ISO), encumbered (bool)}.
    `rules` is the `collateral` block of the policy knowledge pack.
    An expired or encumbered asset is excluded from the eligible value and
    flagged; the caller decides what that means, never this function.
    """
    validity = rules.get("valuation_validity_months", {})
    max_ltv = rules.get("max_ltv_pct", {})
    today = date.fromisoformat(as_of)
    rows, flags = [], []
    eligible = 0.0
    weighted_cap = 0.0
    for a in assets:
        kind = a.get("type") or "other"
        aid = str(a.get("id", ""))
        value = float(a.get("value") or 0)
        row: dict[str, Any] = {"id": aid, "type": kind, "value": value}
        vdate = a.get("valuation_date")
        if not vdate:
            row["valid"] = False
            flags.append({"asset": aid, "flag": "missing_valuation_date"})
        else:
            age = _months_between(date.fromisoformat(vdate), today)
            limit = int(validity.get(kind, validity.get("other", 6)))
            row["valuation_age_months"] = age
            row["valid"] = age <= limit
            if not row["valid"]:
                flags.append({"asset": aid, "flag": "valuation_expired", "age_months": age, "limit_months": limit})
        if a.get("encumbered"):
            row["valid"] = False
            flags.append({"asset": aid, "flag": "encumbered"})
        if row["valid"]:
            eligible += value
            weighted_cap += value * float(max_ltv.get(kind, max_ltv.get("other", 50)))
        rows.append(row)

    ltv = round(loan_amount / eligible * 100, 2) if eligible > 0 else None
    cap = round(weighted_cap / eligible, 2) if eligible > 0 else None
    if ltv is None:
        flags.append({"asset": "*", "flag": "no_eligible_collateral"})
    elif cap is not None and ltv > cap:
        flags.append({"asset": "*", "flag": "ltv_above_cap", "ltv_pct": ltv, "cap_pct": cap})
    return {"assets": rows, "eligible_value": round(eligible, 2), "ltv_pct": ltv, "max_ltv_pct": cap, "flags": flags}
