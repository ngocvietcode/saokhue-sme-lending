"""Deterministic financial calculations: ratios, growth, debt service, DSCR.

Every function is pure: same inputs, same outputs, so Verification can
recompute a result an agent reported and compare it field by field.
"""

from __future__ import annotations

from typing import Any

ROUND = 4

# (ratio name, numerator field, denominator field)
_RATIOS = [
    ("gross_margin", "gross_profit", "revenue"),
    ("net_margin", "net_income", "revenue"),
    ("ebitda_margin", "ebitda", "revenue"),
    ("current_ratio", "current_assets", "current_liabilities"),
    ("debt_to_equity", "total_debt", "equity"),
    ("liabilities_to_assets", "total_liabilities", "total_assets"),
    ("roa", "net_income", "total_assets"),
    ("roe", "net_income", "equity"),
    ("interest_coverage", "ebit", "interest_expense"),
    ("receivable_days", "receivables_x365", "revenue"),
    ("inventory_days", "inventory_x365", "cogs"),
]


def _num(value: Any) -> float | None:
    if value is None or isinstance(value, bool):
        return None
    try:
        return float(value)
    except (TypeError, ValueError):
        return None


def _div(a: float | None, b: float | None) -> float | None:
    if a is None or b is None or b == 0:
        return None
    return round(a / b, ROUND)


def _derived(period: dict[str, Any]) -> dict[str, float | None]:
    f = {k: _num(v) for k, v in period.items() if k != "period"}
    revenue, cogs = f.get("revenue"), f.get("cogs")
    if f.get("gross_profit") is None and revenue is not None and cogs is not None:
        f["gross_profit"] = revenue - cogs
    if f.get("total_debt") is None:
        short, long_ = f.get("short_term_debt"), f.get("long_term_debt")
        if short is not None or long_ is not None:
            f["total_debt"] = (short or 0.0) + (long_ or 0.0)
    rec, inv = f.get("receivables"), f.get("inventory")
    f["receivables_x365"] = rec * 365 if rec is not None else None
    f["inventory_x365"] = inv * 365 if inv is not None else None
    return f


def fin_ratios(periods: list[dict[str, Any]]) -> dict[str, Any]:
    """Ratios per period, plus year-on-year growth of revenue and net income.

    `periods` is ordered oldest first; each item carries `period` (e.g. "2025")
    and any of the raw statement fields used above. A ratio whose inputs are
    missing or whose denominator is zero is reported as None and listed in
    `missing`, never guessed.
    """
    out_periods = []
    for p in periods:
        f = _derived(p)
        ratios: dict[str, float | None] = {}
        missing: list[str] = []
        for name, num, den in _RATIOS:
            ratios[name] = _div(f.get(num), f.get(den))
            if ratios[name] is None:
                missing.append(name)
        out_periods.append({"period": str(p.get("period", "")), "ratios": ratios, "missing": missing})

    growth = []
    for prev, cur in zip(periods, periods[1:]):
        row: dict[str, Any] = {"from": str(prev.get("period", "")), "to": str(cur.get("period", ""))}
        for field in ("revenue", "net_income"):
            a, b = _num(prev.get(field)), _num(cur.get(field))
            row[f"{field}_growth"] = _div(None if a is None or b is None else b - a, abs(a) if a else None)
        growth.append(row)
    return {"periods": out_periods, "growth": growth}


def _annual_debt_service(amount: float, annual_rate_pct: float, term_months: int, method: str) -> float:
    """First-year debt service of the new loan (principal + interest)."""
    r = annual_rate_pct / 100 / 12
    months = min(12, term_months)
    if method == "bullet":
        return round(amount * r * months + (amount if term_months <= 12 else 0.0), 2)
    if method == "equal_principal":
        principal = amount / term_months
        total, balance = 0.0, amount
        for _ in range(months):
            total += principal + balance * r
            balance -= principal
        return round(total, 2)
    # annuity
    if r == 0:
        return round(amount / term_months * months, 2)
    payment = amount * r / (1 - (1 + r) ** -term_months)
    return round(payment * months, 2)


def repayment_capacity(
    cash_available_annual: float,
    existing_debt_service_annual: float,
    loan_amount: float,
    annual_rate_pct: float,
    term_months: int,
    method: str = "annuity",
    stress_pcts: list[float] | None = None,
) -> dict[str, Any]:
    """DSCR = cash available for debt service / total annual debt service.

    Stress scenarios reduce cash available by each percentage in `stress_pcts`.
    """
    if method not in ("annuity", "equal_principal", "bullet"):
        raise ValueError("method must be annuity, equal_principal or bullet")
    if term_months <= 0:
        raise ValueError("term_months must be positive")
    new_ds = _annual_debt_service(loan_amount, annual_rate_pct, term_months, method)
    total_ds = round(existing_debt_service_annual + new_ds, 2)
    stress = stress_pcts if stress_pcts is not None else [10, 20, 30]
    scenarios = [{"stress_pct": 0, "cash_available": cash_available_annual,
                  "dscr": _div(cash_available_annual, total_ds)}]
    for pct in stress:
        cash = round(cash_available_annual * (1 - pct / 100), 2)
        scenarios.append({"stress_pct": pct, "cash_available": cash, "dscr": _div(cash, total_ds)})
    return {
        "new_loan_debt_service_annual": new_ds,
        "total_debt_service_annual": total_ds,
        "scenarios": scenarios,
    }
