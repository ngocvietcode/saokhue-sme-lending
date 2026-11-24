# Workflow sme-credit-assessment: dieu phoi tham dinh mot ho so SME.
# Ba agent chay noi tiep; moi agent luu mot hoac nhieu "phan" ket qua (document-evidence,
# financial-analysis, ...) qua sme_case_put_result, noi kiem chung tat dinh chay ngay khi luu.
# Workflow chi kiem tra moi phan da duoc nhan, va chay lai agent cho cac phan con thieu.
# Luu file nay trong tab Workflows voi slug "sme-credit-assessment".
# Chuoi trong code giu ASCII; agent tra loi tieng Viet theo skill cua no.

META = {
    "name": "sme-credit-assessment",
    "version": "0.5.0",
    "description": "SME credit assessment in three agents: documents and product, credit analysis, consolidation",
    "phases": [
        {"title": "Documents"},
        {"title": "Analysis"},
        {"title": "Consolidate"},
    ],
}

APP = "sme-lending--"
MAX_RERUNS_CAP = 2

SECTIONS_SCHEMA = {
    "type": "object",
    "properties": {
        "sections": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "agent": {"type": "string"},
                    "summary": {"type": "string"},
                    "stored_version": {"type": "integer"},
                    "open_issues": {"type": "array", "items": {"type": "string"}},
                },
                "required": ["agent", "stored_version"],
            },
        },
    },
    "required": ["sections"],
}


async def workflow(ctx):
    case_id = ctx.args["case_id"]
    flow = ctx.args.get("flow", "A")
    max_reruns = min(int(ctx.args.get("max_reruns", 1)), MAX_RERUNS_CAP)
    report = {}

    async def run(agent, phase, sections):
        missing = list(sections)
        note = ""
        attempts = 0
        while missing and attempts <= max_reruns:
            attempts += 1
            prompt = (
                "case_id=" + case_id + " flow=" + flow + ". Produce these result sections, in this order: "
                + ", ".join(missing) + ". Store each with sme_case_put_result(agent=<section>); it verifies "
                "and rejects with errors, so fix them and store again until accepted. " + note + " "
                "Return {\"sections\": [{\"agent\": <section>, \"stored_version\": <version the tool "
                "returned, 0 if never accepted>, \"summary\": ..., \"open_issues\": [...]}]}."
            )
            out = await ctx.agent(prompt, agent=APP + agent, label=agent, phase=phase, schema=SECTIONS_SCHEMA)
            stored = {}
            for s in (out or {}).get("sections", []):
                if int(s.get("stored_version", 0) or 0) >= 1:
                    stored[s.get("agent")] = s
            for name in missing:
                if name in stored:
                    report[name] = {"passed": True, "attempts": attempts, "errors": []}
            errors = {name: ["result was never accepted by sme_case_put_result"] for name in missing
                      if name not in stored}
            missing = [name for name in missing if name not in stored]
            if missing:
                ctx.log("rerun " + agent + " for " + ", ".join(missing))
                note = ("This is rerun " + str(attempts) + " (pass rerun_reason='schema_error' to "
                        "sme_case_put_result). Only these sections are still missing: " + ", ".join(missing) + ".")
                for name in missing:
                    report[name] = {"passed": False, "attempts": attempts, "errors": errors[name]}

    ctx.phase("Documents")
    await run("document-product", "Documents", ["document-evidence", "product-match"])

    ctx.phase("Analysis")
    analysis = ["financial-analysis", "risk-compliance", "collateral"]
    if flow == "B":
        analysis.append("industry")
    analysis.append("policy-exception")
    await run("credit-analysis", "Analysis", analysis)

    ctx.phase("Consolidate")
    await run("consolidation", "Consolidate", ["consolidation"])

    blocked = [n for n, r in report.items() if not r["passed"]]
    ctx.log(str(len(blocked)) + " result section(s) never accepted")
    return {
        "case_id": case_id,
        "flow": flow,
        "sections": report,
        "blocked": blocked,
        "next_step": "officer review: open sme_review_list for this case",
    }
