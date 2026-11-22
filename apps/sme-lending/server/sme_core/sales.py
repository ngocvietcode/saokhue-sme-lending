"""The Sales-side service: dossier completeness, requirements and customer requests.

One `overview` answers every question the Sales page and the dossier coach ask:
which checks fail, what a person already did about each, how ready the dossier
is, and which stage it is in. The MCP tools and the backend both call it, so the
agent and the page can never disagree about what is missing.
"""

from __future__ import annotations

from pathlib import Path
from typing import Any

from .dossier import DossierStore
from .gaps import analyse, readiness
from .service import LendingService
from .verify import customer_promises


class SalesService(LendingService):
    def __init__(self, data_root: Path, knowledge_root: Path):
        super().__init__(data_root, knowledge_root)
        self.store = DossierStore(data_root)

    def _today(self) -> str:
        return self.store.clock()[:10]

    def _checks(self, case: dict[str, Any], as_of: str) -> list[dict[str, Any]]:
        request = case.get("request") or {}
        product = request.get("product_code") or ""
        checklist = self.kb.checklist(product, case.get("flow") or "A")["required_documents"]
        policy = self.kb.policy(product, as_of) if product else None
        precheck = None
        if policy:
            facts = dict(case.get("facts") or {})
            if request.get("amount") is not None:
                facts.setdefault("loan_amount", request["amount"])
            if request.get("term_months") is not None:
                facts.setdefault("term_months", request["term_months"])
            precheck = self.kb.policy_check(product, facts, as_of)
        return analyse(case, checklist=checklist, catalog=self.kb.documents(), policy=policy,
                       precheck=precheck, as_of=as_of)

    @staticmethod
    def _stage(case: dict[str, Any], ready: bool) -> str:
        if case.get("submitted"):
            return "submitted"
        if ready:
            return "ready"
        return "collecting" if case.get("documents") else "draft"

    def overview(self, case_id: str, as_of: str = "") -> dict[str, Any]:
        """Checks with their effective status, readiness and stage; syncs requirement state."""
        as_of = as_of or self._today()
        case = self.store.get_case(case_id)
        checks = self._checks(case, as_of)
        states = self.store.sync_requirements(case_id, checks)
        items = []
        for c in checks:
            st = states.get(c["key"], {})
            status = "resolved" if c["ok"] else st.get("status", "open")
            if c["ok"] and not st:
                status = "ok"
            items.append({**c, "status": status, **{k: st[k] for k in ("note", "due_date", "requested_at",
                                                                         "updated_by", "resolved_at") if k in st}})
        ready = readiness(checks, {k: v.get("status", "") for k, v in states.items()})
        return {"case_id": case_id, "as_of": as_of, "stage": self._stage(case, ready["ready"]),
                "readiness": ready, "items": items}

    def gap_analysis(self, case_id: str, as_of: str = "") -> dict[str, Any]:
        """The open items only, for an agent: what to ask for, and why."""
        ov = self.overview(case_id, as_of)
        open_items = [{k: i[k] for k in ("key", "kind", "group", "title", "reason", "ask", "alternatives",
                                         "blocking", "status", "document_refs") if k in i}
                      for i in ov["items"] if i["status"] in ("open", "requested")]
        return {"case_id": case_id, "as_of": ov["as_of"], "stage": ov["stage"],
                "score": ov["readiness"]["score"], "ready": ov["readiness"]["ready"], "open_items": open_items}

    def list_dossiers(self) -> list[dict[str, Any]]:
        out = []
        for row in self.store.list_cases():
            ov = self.overview(row["case_id"])
            open_items = [i for i in ov["items"] if i["status"] in ("open", "requested")]
            out.append({**row, "stage": ov["stage"], "score": ov["readiness"]["score"],
                        "ready": ov["readiness"]["ready"],
                        "blocking_open": len(ov["readiness"]["blocking_open"]),
                        "requested": sum(1 for i in open_items if i["status"] == "requested"),
                        "open_items": len(open_items)})
        return out

    def documents_catalog(self) -> dict[str, Any]:
        return self.kb.documents()

    def draft_save(self, case_id: str, channel: str, subject: str, body: str,
                   requirement_keys: list[str], agent: str) -> dict[str, Any]:
        promises = customer_promises(f"{subject}\n{body}")
        if promises:
            raise ValueError("a customer message must not promise an outcome: " + ", ".join(promises))
        known = {i["key"] for i in self.overview(case_id)["items"]}
        unknown = [k for k in requirement_keys if k not in known]
        if unknown:
            raise ValueError(f"unknown requirement keys: {', '.join(unknown)}")
        return self.store.save_draft(case_id, channel=channel, subject=subject, body=body,
                                     requirement_keys=requirement_keys, author=agent)
