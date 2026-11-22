"""Knowledge pack access and deterministic policy-condition checks."""

from __future__ import annotations

import json
from datetime import date
from pathlib import Path
from typing import Any

_OPS = {
    ">=": lambda a, b: a >= b,
    "<=": lambda a, b: a <= b,
    ">": lambda a, b: a > b,
    "<": lambda a, b: a < b,
    "==": lambda a, b: a == b,
}


class Knowledge:
    def __init__(self, root: Path):
        self.root = Path(root)

    def _load(self, name: str) -> dict[str, Any]:
        return json.loads((self.root / name).read_text(encoding="utf-8"))

    def products(self) -> dict[str, Any]:
        return self._load("products.json")

    def checklist(self, product_code: str, flow: str) -> dict[str, Any]:
        data = self._load("checklists.json")
        items = list(data.get("common", []))
        items += data.get("by_product", {}).get(product_code, [])
        items += data.get("by_flow", {}).get(flow, [])
        return {"version": data.get("version"), "product_code": product_code, "flow": flow,
                "required_documents": list(dict.fromkeys(items))}

    def documents(self) -> dict[str, Any]:
        """Document-type catalogue: labels, validity, customer-facing ask, approved substitutes."""
        return self._load("documents.json")

    def collateral_rules(self) -> dict[str, Any]:
        return self._load("policies.json").get("collateral", {})

    def policy(self, product_code: str, as_of: str) -> dict[str, Any] | None:
        day = date.fromisoformat(as_of)
        for p in self._load("policies.json").get("policies", []):
            if p.get("product_code") != product_code:
                continue
            start = date.fromisoformat(p["effective_from"])
            end = date.fromisoformat(p["effective_to"]) if p.get("effective_to") else None
            if start <= day and (end is None or day <= end):
                return p
        return None

    def policy_check(self, product_code: str, facts: dict[str, Any], as_of: str) -> dict[str, Any]:
        """Evaluate every condition of the policy in force on `as_of`.

        Status per condition: met, not_met, missing (fact absent) or na (fact
        explicitly null because the condition does not apply).
        """
        policy = self.policy(product_code, as_of)
        if policy is None:
            return {"product_code": product_code, "as_of": as_of, "error": "no_policy_in_force", "matrix": []}
        matrix = []
        for c in policy["conditions"]:
            fact = c["fact"]
            row = {"id": c["id"], "fact": fact, "op": c["op"], "threshold": c["value"], "clause": c.get("clause")}
            if fact not in facts:
                row["status"] = "missing"
            elif facts[fact] is None:
                row["status"] = "na"
            else:
                row["actual"] = facts[fact]
                row["status"] = "met" if _OPS[c["op"]](float(facts[fact]), float(c["value"])) else "not_met"
            matrix.append(row)
        return {
            "product_code": product_code,
            "policy_version": policy["version"],
            "effective_from": policy["effective_from"],
            "as_of": as_of,
            "matrix": matrix,
            "not_met": [r["id"] for r in matrix if r["status"] == "not_met"],
            "missing": [r["id"] for r in matrix if r["status"] == "missing"],
        }
