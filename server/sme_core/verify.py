"""Deterministic verification: result schema, evidence refs, recomputation.

`validate_result` is the gate `put_result` runs before a result is stored.
`recompute` re-runs every reported calculation and diffs its outputs, which is
what lets a deterministic check, not a model, catch a wrong number.
"""

from __future__ import annotations

import unicodedata
from typing import Any, Callable

SEVERITIES = ("info", "low", "medium", "high")
CONFIDENCE = ("low", "medium", "high")
CALC_KINDS = ("fin_ratios", "repayment_capacity", "collateral_ltv", "policy_check", "genform")
REL_TOL = 1e-6

# A result states facts and flags; it never carries a credit decision.
PROHIBITED_PHRASES = (
    "đã phê duyệt", "được phê duyệt", "đề xuất phê duyệt", "đồng ý cấp tín dụng",
    "từ chối cấp tín dụng", "đề xuất từ chối", "ngoại lệ được chấp nhận", "đã chấp nhận ngoại lệ",
)


def _norm(text: str) -> str:
    return unicodedata.normalize("NFC", text).lower()


def _is_str_list(v: Any) -> bool:
    return isinstance(v, list) and all(isinstance(x, str) for x in v)


def validate_result(payload: Any, *, agent: str, case_id: str, known_evidence: set[str]) -> list[str]:
    if not isinstance(payload, dict):
        return ["result must be a JSON object"]
    errors: list[str] = []
    if payload.get("agent") != agent:
        errors.append(f"agent must be {agent!r}")
    if payload.get("case_id") != case_id:
        errors.append(f"case_id must be {case_id!r}")
    if not isinstance(payload.get("summary"), str) or not payload["summary"].strip():
        errors.append("summary must be a non-empty string")
    if payload.get("confidence") not in CONFIDENCE:
        errors.append(f"confidence must be one of {CONFIDENCE}")
    for key in ("missing_information", "open_issues"):
        if not _is_str_list(payload.get(key, [])):
            errors.append(f"{key} must be a list of strings")

    findings = payload.get("findings")
    if not isinstance(findings, list):
        errors.append("findings must be a list")
        findings = []
    seen: set[str] = set()
    for i, f in enumerate(findings):
        where = f"findings[{i}]"
        if not isinstance(f, dict):
            errors.append(f"{where} must be an object")
            continue
        fid = f.get("id")
        if not isinstance(fid, str) or not fid or fid in seen:
            errors.append(f"{where}.id must be a unique non-empty string")
        seen.add(str(fid))
        for key in ("topic", "statement"):
            if not isinstance(f.get(key), str) or not f[key].strip():
                errors.append(f"{where}.{key} must be a non-empty string")
        if f.get("severity") not in SEVERITIES:
            errors.append(f"{where}.severity must be one of {SEVERITIES}")
        refs = f.get("evidence_refs")
        if not _is_str_list(refs) or not refs:
            errors.append(f"{where}.evidence_refs must list at least one evidence id")
        else:
            unknown = [r for r in refs if r not in known_evidence]
            if unknown:
                errors.append(f"{where}.evidence_refs unknown ids: {', '.join(unknown)}")

    calcs = payload.get("calculations", [])
    if not isinstance(calcs, list):
        errors.append("calculations must be a list")
    else:
        for i, c in enumerate(calcs):
            if not isinstance(c, dict) or c.get("kind") not in CALC_KINDS:
                errors.append(f"calculations[{i}].kind must be one of {CALC_KINDS}")
            elif not isinstance(c.get("inputs"), dict) or not isinstance(c.get("outputs"), dict):
                errors.append(f"calculations[{i}] needs object inputs and outputs")

    text = _norm(" ".join(_texts(payload)))
    for phrase in PROHIBITED_PHRASES:
        if _norm(phrase) in text:
            errors.append(f"result states a credit decision ({phrase!r}); agents only analyse and flag")
    return errors


def _texts(payload: dict[str, Any]) -> list[str]:
    out = [str(payload.get("summary", ""))]
    for f in payload.get("findings") or []:
        if isinstance(f, dict):
            out.append(str(f.get("statement", "")))
    out += [str(x) for x in payload.get("open_issues") or []]
    return out


def _diff(expected: Any, actual: Any, path: str, out: list[str]) -> None:
    """Check every value the agent REPORTED against the recomputed one.

    An object may omit keys (agents quote the part of a tool output they use),
    but every key it does carry must exist in the tool output and match. A list
    must keep its length, so a row of a compliance matrix cannot be dropped.
    """
    if isinstance(expected, dict) and isinstance(actual, dict):
        for k in actual:
            if k not in expected:
                out.append(f"{path}.{k} is not produced by the tool")
            else:
                _diff(expected[k], actual[k], f"{path}.{k}", out)
    elif isinstance(expected, list) and isinstance(actual, list):
        if len(expected) != len(actual):
            out.append(f"{path} length {len(actual)} != {len(expected)}")
        for i, (e, a) in enumerate(zip(expected, actual)):
            _diff(e, a, f"{path}[{i}]", out)
    elif isinstance(expected, (int, float)) and isinstance(actual, (int, float)) \
            and not isinstance(expected, bool) and not isinstance(actual, bool):
        if abs(expected - actual) > REL_TOL * max(1.0, abs(expected)):
            out.append(f"{path} reported {actual}, recomputed {expected}")
    elif expected != actual:
        out.append(f"{path} reported {actual!r}, recomputed {expected!r}")


def recompute(payload: dict[str, Any], calculators: dict[str, Callable[[dict[str, Any]], dict[str, Any]]]) -> list[str]:
    """Re-run each calculation through `calculators[kind]` and diff outputs."""
    errors: list[str] = []
    for i, c in enumerate(payload.get("calculations") or []):
        kind = c.get("kind")
        fn = calculators.get(kind)
        if fn is None:
            continue
        try:
            expected = fn(c.get("inputs") or {})
        except Exception as exc:  # a bad input is a verification failure, not a crash
            errors.append(f"calculations[{i}] ({kind}) cannot be recomputed: {exc}")
            continue
        outputs = c.get("outputs") or {}
        if not outputs:
            errors.append(f"calculations[{i}] ({kind}) reports no outputs")
            continue
        _diff(expected, outputs, f"calculations[{i}].outputs", errors)
    return errors
