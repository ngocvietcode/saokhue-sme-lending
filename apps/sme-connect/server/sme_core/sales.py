"""The Sales-side service: two-layer Master Checklist (A-I), cross-checks, requirements, drafts & handover."""

from __future__ import annotations

import os
from datetime import date
from pathlib import Path
from typing import Any

from .actions import completion, extraction, group_progress, next_actions, profile
from .crosscheck import evaluate_crosschecks
from .dossier import DossierStore, validate_case_patch
from .gaps import FACT_LABELS, analyse, known_facts, readiness
from .handover import build_handover_package, resolve_handover_adapter
from .service import LendingService
from .verify import customer_promises


class SalesService(LendingService):
    def __init__(
        self,
        data_root: Path,
        knowledge_root: Path,
        data_home: Path | None = None,
        lending_data_root: Path | None = None,
    ):
        super().__init__(data_root, knowledge_root)
        self.store = DossierStore(data_root)
        self.data_home = data_home or Path(data_root).resolve().parent.parent.parent
        self.lending_data_root = Path(lending_data_root) if lending_data_root else None

    def _today(self) -> str:
        return self.store.clock()[:10]

    def _evaluate(
        self, case: dict[str, Any], as_of: str
    ) -> tuple[list[dict[str, Any]], dict[str, Any] | None, dict[str, Any], dict[str, Any]]:
        request = case.get("request") or {}
        product = request.get("product_code") or ""
        policy = self.kb.policy(product, as_of) if product else None
        precheck = None
        if policy:
            facts = known_facts(case, date.fromisoformat(as_of))
            precheck = self.kb.policy_check(product, facts, as_of)
        products = self.kb.products()
        checks, master_eval = analyse(
            case,
            master_spec=self.kb.master_checklist(),
            catalog=self.kb.documents(),
            policy=policy,
            precheck=precheck,
            as_of=as_of,
            products=products,
        )
        xchecks = evaluate_crosschecks(case, evidence=None, as_of=as_of, products_meta=products)
        return checks, precheck, master_eval, xchecks

    def _checks(self, case: dict[str, Any], as_of: str) -> list[dict[str, Any]]:
        return self._evaluate(case, as_of)[0]

    @staticmethod
    def _stage(case: dict[str, Any], ready: bool) -> str:
        if case.get("submitted"):
            return "submitted"
        if ready:
            return "ready"
        return "collecting" if case.get("documents") else "draft"

    def _overview_for(self, case: dict[str, Any], as_of: str) -> dict[str, Any]:
        case_id = case["case_id"]
        checks, precheck, master_eval, xchecks = self._evaluate(case, as_of)
        states = self.store.sync_requirements(case_id, checks)
        items = []
        for c in checks:
            st = states.get(c["key"], {})
            status = "resolved" if c["ok"] else st.get("status", "open")
            if c["ok"] and not st:
                status = "ok"
            items.append({
                **c,
                "status": status,
                **{k: st[k] for k in ("note", "due_date", "requested_at", "updated_by", "resolved_at") if k in st},
            })
        ready = readiness(checks, {k: v.get("status", "") for k, v in states.items()})
        ready["actionable_blocking"] = [i["key"] for i in items if i["blocking"] and i["status"] == "open"]
        ready["waiting_blocking"] = [i["key"] for i in items if i["blocking"] and i["status"] == "requested"]
        stage = self._stage(case, ready["ready"])
        catalog = self.kb.documents()
        sales_policy_facts = set(catalog.get("sales_facts", {})) | {"loan_amount", "term_months"}
        policy_checks = [
            {
                "id": row["id"],
                "fact": row["fact"],
                "label": FACT_LABELS.get(row["fact"], row["fact"]),
                "op": row["op"],
                "threshold": row["threshold"],
                "actual": row.get("actual"),
                "status": row["status"],
                "clause": row.get("clause") or row["id"],
            }
            for row in (precheck or {}).get("matrix", [])
            if row["fact"] in sales_policy_facts
        ]
        return {
            "case_id": case_id,
            "as_of": as_of,
            "stage": stage,
            "readiness": ready,
            "checklist_overall": master_eval["overall_status"],
            "checklist_counts": master_eval["counts"],
            "checklist_groups": master_eval["groups"],
            "crosschecks": xchecks,
            "items": items,
            "policy_checks": policy_checks,
            "groups": group_progress(items, catalog),
            "progress": completion(items),
            "actions": next_actions(case, items, ready, stage, as_of, catalog, crosschecks=xchecks),
            "profile": profile(case, catalog),
        }

    def overview(self, case_id: str, as_of: str = "") -> dict[str, Any]:
        """Checks with their effective status, readiness, Master Checklist verdict and cross-checks."""
        as_of = as_of or self._today()
        return self._overview_for(self.store.get_case(case_id), as_of)

    def crosscheck_preview(self, case_id: str, as_of: str = "") -> dict[str, Any]:
        """Deterministic 7 cross-check preview for Sales."""
        case = self.store.get_case(case_id)
        day = as_of or self._today()
        return evaluate_crosschecks(case, evidence=None, as_of=day, products_meta=self.kb.products())

    def gap_analysis(self, case_id: str, as_of: str = "") -> dict[str, Any]:
        """The active gaps, separated for Customer request vs RM internal vs Undetermined conditions."""
        ov = self.overview(case_id, as_of)
        fields = (
            "key", "kind", "group", "title", "owner_role", "rule_status", "reason",
            "ask", "alternatives", "blocking", "status", "document_refs",
            "condition_label", "rule_label", "fail_reasons", "missing_condition_fields", "crosscheck_refs",
        )
        open_items = [
            {k: i[k] for k in fields if k in i}
            for i in ov["items"]
            if i.get("applicable", True) and i["status"] in ("open", "requested")
        ]
        open_customer_items = [
            i for i in open_items if i.get("owner_role") == "CUSTOMER" and i.get("rule_status") != "UNDETERMINED_CONDITION"
        ]
        open_rm_items = [
            i for i in open_items if i.get("owner_role") == "RM_INTERNAL"
        ]
        undetermined_items = [
            i for i in open_items if i.get("rule_status") == "UNDETERMINED_CONDITION"
        ]
        xcheck = ov["crosschecks"]
        return {
            "case_id": case_id,
            "as_of": ov["as_of"],
            "stage": ov["stage"],
            "score": ov["readiness"]["score"],
            "ready": ov["readiness"]["ready"],
            "checklist_overall": ov["checklist_overall"],
            "checklist_counts": ov["checklist_counts"],
            "crosscheck_overall": xcheck["overall_status"],
            "crosscheck_issues": [r for r in xcheck["rules"] if r["status"] in ("FAIL", "MISSING_DATA")],
            "open_items": open_items,
            "open_customer_items": open_customer_items,
            "open_rm_items": open_rm_items,
            "undetermined_items": undetermined_items,
            "next_actions": [a["title"] for a in ov["actions"]],
        }

    def list_dossiers(self) -> list[dict[str, Any]]:
        out = []
        as_of = self._today()
        for row in self.store.list_cases():
            case = self.store.get_case(row["case_id"])
            ov = self._overview_for(case, as_of)
            drafts = self.store.list_drafts(row["case_id"])
            open_items = [
                i for i in ov["items"]
                if i.get("applicable", True) and i["status"] in ("open", "requested")
            ]
            first = ov["actions"][0] if ov["actions"] else None
            due_dates = sorted(i["due_date"] for i in open_items if i["status"] == "requested" and i.get("due_date"))
            docs = case.get("documents") or []
            customer = case.get("customer") or {}
            request = case.get("request") or {}
            out.append({
                **row,
                "tax_id": customer.get("tax_id"),
                "product_code": request.get("product_code"),
                "stage": ov["stage"],
                "score": ov["readiness"]["score"],
                "ready": ov["readiness"]["ready"],
                "checklist_overall": ov["checklist_overall"],
                "checklist_counts": ov["checklist_counts"],
                "crosscheck_overall": ov["crosschecks"]["overall_status"],
                "blocking_open": len(ov["readiness"]["blocking_open"]),
                "actionable_blocking": len(ov["readiness"]["actionable_blocking"]),
                "requested": sum(1 for i in open_items if i["status"] == "requested"),
                "overdue": sum(len(a["keys"]) for a in ov["actions"] if a["kind"] == "remind"),
                "stale": sum(len(a["keys"]) for a in ov["actions"] if a["kind"] in ("remind", "follow_up")),
                "unclassified_docs": sum(1 for d in docs if not d.get("type")),
                "policy_breaches": sum(
                    1 for i in ov["items"]
                    if i["kind"] == "policy_precheck" and i["status"] == "open"
                ),
                "next_due_date": due_dates[0] if due_dates else None,
                "pending_drafts": sum(1 for d in drafts if d.get("status") == "draft"),
                "open_items": len(open_items),
                "groups": ov["groups"],
                "progress": ov["progress"],
                "next_action": first and {k: first[k] for k in ("kind", "tone", "title", "cta")},
                "actions": ov["actions"],
                "items_open": [
                    {k: i[k] for k in ("key", "title", "status", "blocking", "group", "kind", "due_date",
                                       "owner_role", "rule_status") if k in i}
                    for i in open_items
                ],
                "profile": ov["profile"],
                "documents": [
                    {k: d[k] for k in ("id", "name", "type", "issued_date", "summary", "meta") if k in d}
                    for d in docs
                ],
            })
        return out

    def today(self, rows: list[dict[str, Any]]) -> dict[str, Any]:
        """Across all dossiers: what needs the Sale first."""
        live = [r for r in rows if r["stage"] != "submitted"]
        return {
            "ready": [r["case_id"] for r in live if r["ready"]],
            "overdue": [r["case_id"] for r in live if r["overdue"]],
            "blocked": [r["case_id"] for r in live if r["blocking_open"]],
            "waiting": sum(r["requested"] for r in live),
            "no_documents": [r["case_id"] for r in live if r["stage"] == "draft"],
            "action_needed": [
                r["case_id"] for r in live
                if r.get("actionable_blocking", 0) > 0 or r.get("unclassified_docs", 0) > 0
            ],
            "waiting_cases": [r["case_id"] for r in live if r.get("requested", 0) > 0 and not r.get("overdue", 0)],
            "attention": [r["case_id"] for r in live if r.get("overdue", 0) > 0 or r.get("stale", 0) > 0],
        }

    def create_dossier(
        self, customer: dict[str, Any], request: dict[str, Any], flow: str = "A",
        actor: str = "agent:dossier-coach",
    ) -> dict[str, Any]:
        """Validate inputs first so a bad field never leaves an empty orphan dossier."""
        norm = validate_case_patch({"customer": customer or {}, "request": request or {}, "flow": flow})
        case = self.case_create({}, {}, [], flow)
        patch = {k: norm[k] for k in ("customer", "request") if k in norm}
        if patch:
            self.store.update_case(case["case_id"], patch, actor=actor)
        return self.store.get_case(case["case_id"])

    def _validate_doc_type(self, doc_type: str) -> None:
        if not doc_type:
            return
        types = self.kb.documents().get("types", {})
        if doc_type not in types:
            valid = ", ".join(sorted(types))
            raise ValueError(f"unknown doc_type {doc_type!r}; valid keys: {valid}")

    def import_document(
        self, case_id: str, path: str, doc_type: str = "", issued_date: str = "",
        summary: str = "", meta: dict[str, Any] | None = None, actor: str = "agent:dossier-coach",
    ) -> dict[str, Any]:
        self._validate_doc_type(doc_type)
        doc = self.store.import_file(
            case_id, path, roots=self.import_roots(), doc_type=doc_type,
            issued_date=issued_date or None, summary=summary, meta=meta, actor=actor,
        )
        return {
            "document": doc,
            "extract_next": self.extract_next(case_id, doc["id"]),
            "gaps": self.gap_analysis(case_id),
        }

    def classify_document(
        self, case_id: str, document_id: str, doc_type: str = "", issued_date: str = "",
        summary: str = "", not_stated: list[str] | None = None, meta: dict[str, Any] | None = None,
        actor: str = "agent:dossier-coach",
    ) -> dict[str, Any]:
        self._validate_doc_type(doc_type)
        patch: dict[str, Any] = {}
        if doc_type:
            patch["type"] = doc_type
        if issued_date:
            patch["issued_date"] = issued_date
        if summary:
            patch["summary"] = summary
        if not_stated:
            patch["not_stated"] = not_stated
        if meta is not None:
            patch["meta"] = meta
        doc = self.store.update_document(case_id, document_id, patch, actor=actor)
        return {"document": doc, "extract_next": self.extract_next(case_id, document_id)}

    def find_dossiers(self, query: str) -> list[dict[str, Any]]:
        """Dossiers whose customer name, tax id or case id contains `query` (case-insensitive)."""
        q = query.strip().lower()
        out = []
        for row in self.store.list_cases():
            case = self.store.get_case(row["case_id"])
            hay = " ".join(str(x) for x in (
                row["case_id"],
                (case.get("customer") or {}).get("name", ""),
                (case.get("customer") or {}).get("tax_id", ""),
            )).lower()
            if not q or q in hay:
                out.append({
                    "case_id": row["case_id"],
                    "customer_name": row.get("customer_name"),
                    "created_at": row.get("created_at"),
                })
        return out

    def import_roots(self) -> list[Path]:
        """Folders a chat attachment may be imported from (see DossierStore.import_file)."""
        home = Path(os.environ.get("KIROCREW_HOME") or self.data_home)
        roots = [home / "uploads", home / "sessions"]
        roots += [Path(p) for p in os.environ.get("SME_SALES_IMPORT_DIRS", "").split(os.pathsep) if p.strip()]
        return [r for r in roots if r.exists()]

    def extract_next(self, case_id: str, doc_id: str) -> list[dict[str, str]]:
        """Fields this document's type should yield that the dossier still lacks."""
        found = extraction(self.store.get_case(case_id), self.kb.documents(), doc_id)
        return found[0]["missing"] if found else []

    def documents_catalog(self) -> dict[str, Any]:
        return self.kb.documents()

    def draft_save(
        self, case_id: str, channel: str, subject: str, body: str,
        requirement_keys: list[str], agent: str,
    ) -> dict[str, Any]:
        promises = customer_promises(f"{subject}\n{body}")
        if promises:
            raise ValueError("a customer message must not promise an outcome: " + ", ".join(promises))
        ov = self.overview(case_id)
        by_key = {i["key"]: i for i in ov["items"]}
        unknown = [k for k in requirement_keys if k not in by_key]
        if unknown:
            raise ValueError(f"unknown requirement keys: {', '.join(unknown)}")
        internal = [k for k in requirement_keys if by_key[k].get("owner_role") == "RM_INTERNAL"]
        if internal:
            raise ValueError(f"internal RM items cannot be included in customer drafts: {', '.join(internal)}")
        skipped = [k for k in requirement_keys if by_key[k].get("rule_status") == "SKIPPED"]
        if skipped:
            raise ValueError(f"non-applicable (SKIPPED) items cannot be requested: {', '.join(skipped)}")
        allowed = {k for k, i in by_key.items() if i["status"] in ("open", "requested")}
        closed = [k for k in requirement_keys if k not in allowed]
        if closed:
            raise ValueError(f"requirement keys already resolved or waived: {', '.join(closed)}")
        author = agent if agent.startswith("agent:") else f"agent:{agent}"
        return self.store.save_draft(
            case_id, channel=channel, subject=subject, body=body,
            requirement_keys=requirement_keys, author=author,
        )

    def submit_dossier(self, case_id: str, actor: str, note: str = "") -> dict[str, Any]:
        """Submit the dossier and push it through the configured HandoverAdapter."""
        ov = self.overview(case_id)
        if not ov["readiness"]["ready"] and not note.strip():
            raise ValueError("the dossier still has blocking items; give a reason to submit anyway")
        case = self.store.get_case(case_id)
        submitted_at = self.store.clock()
        package = build_handover_package(
            case, ov, submitted_by=actor, submitted_at=submitted_at, note=note,
        )
        adapter = resolve_handover_adapter(
            data_root=self.store.root,
            data_home=self.data_home,
            lending_data_root=self.lending_data_root,
            clock=self.store.clock,
        )
        receipt = adapter.handover(package, self.store._dir(case_id))
        self.store.mark_submitted(case_id, actor, note, handover=receipt)
        return self.overview(case_id)
