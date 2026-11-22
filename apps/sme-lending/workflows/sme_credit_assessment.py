# Workflow sme-credit-assessment: dieu phoi tham dinh mot ho so SME.
# Day la Credit Orchestrator cua thiet ke: state nam trong case store cua app,
# dependency, retry co gioi han va audit trail nam o workflow engine.
# Luu file nay trong tab Workflows voi slug "sme-credit-assessment".
# Chuoi trong code giu ASCII; agent tra loi tieng Viet theo skill cua no.

META = {
    "name": "sme-credit-assessment",
    "description": "SME credit assessment: documents, product, specialists, policy, consolidation, each verified",
    "phases": [
        {"title": "Documents"},
        {"title": "Product"},
        {"title": "Specialists"},
        {"title": "Policy"},
        {"title": "Consolidate"},
    ],
}

APP = "sme-lending--"
MAX_RERUNS_CAP = 2

RESULT_SCHEMA = {
    "type": "object",
    "properties": {
        "agent": {"type": "string"},
        "case_id": {"type": "string"},
        "summary": {"type": "string"},
        "findings": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "id": {"type": "string"},
                    "topic": {"type": "string"},
                    "statement": {"type": "string"},
                    "severity": {"type": "string", "enum": ["info", "low", "medium", "high"]},
                    "evidence_refs": {"type": "array", "items": {"type": "string"}},
                },
                "required": ["id", "topic", "statement", "severity", "evidence_refs"],
            },
        },
        "missing_information": {"type": "array", "items": {"type": "string"}},
        "open_issues": {"type": "array", "items": {"type": "string"}},
        "calculations": {"type": "array", "items": {"type": "object"}},
        "confidence": {"type": "string", "enum": ["low", "medium", "high"]},
        "stored_version": {"type": "integer"},
    },
    "required": ["agent", "case_id", "summary", "findings", "confidence", "stored_version"],
}

VERDICT_SCHEMA = {
    "type": "object",
    "properties": {
        "agent": {"type": "string"},
        "passed": {"type": "boolean"},
        "errors": {"type": "array", "items": {"type": "string"}},
        "rerun_reason": {
            "type": "string",
            "enum": ["none", "schema_error", "missing_evidence_ref", "calc_mismatch", "unsupported_claim"],
        },
    },
    "required": ["agent", "passed", "errors", "rerun_reason"],
}


async def workflow(ctx):
    case_id = ctx.args["case_id"]
    flow = ctx.args.get("flow", "A")
    max_reruns = min(int(ctx.args.get("max_reruns", 1)), MAX_RERUNS_CAP)
    report = {}

    async def run_agent(name, phase, note):
        prompt = (
            "case_id=" + case_id + " flow=" + flow + ". "
            "Run your skill on this case. " + note + " "
            "Store the result with sme_case_put_result (agent='" + name + "'). It verifies the result and "
            "rejects it with errors; fix them and submit again until accepted. Return that JSON plus "
            "stored_version = the version the tool returned, or stored_version = 0 and the last errors "
            "in open_issues if it was never accepted."
        )
        return await ctx.agent(prompt, agent=APP + name, label=name, phase=phase, schema=RESULT_SCHEMA)

    async def verify(name, phase):
        prompt = (
            "case_id=" + case_id + ". Verify the latest result of agent '" + name + "' "
            "with sme_verify_result, following your skill. Return the verdict JSON."
        )
        return await ctx.agent(prompt, agent=APP + "verifier", label="verify:" + name, phase=phase,
                               schema=VERDICT_SCHEMA)

    async def run_verified(name, phase, semantic=False):
        # Deterministic checks run inside sme_case_put_result, so only the final
        # consolidation pays for a verifier turn (claims beyond the evidence).
        note = ""
        attempts = 0
        while True:
            attempts += 1
            result = await run_agent(name, phase, note)
            if result is None:
                verdict = {"agent": name, "passed": False, "rerun_reason": "schema_error",
                           "errors": ["agent returned no schema-valid result"]}
            elif int(result.get("stored_version", 0) or 0) < 1:
                verdict = {"agent": name, "passed": False, "rerun_reason": "schema_error",
                           "errors": ["result was never accepted by sme_case_put_result"]
                           + list(result.get("open_issues", []))[:5]}
            elif not semantic:
                verdict = {"agent": name, "passed": True, "rerun_reason": "none", "errors": []}
            else:
                verdict = await verify(name, phase)
                if verdict is None:
                    verdict = {"agent": name, "passed": False, "rerun_reason": "none",
                               "errors": ["verifier returned no verdict"]}
            reason = verdict.get("rerun_reason", "none")
            if verdict.get("passed") or reason == "none" or attempts > max_reruns:
                break
            ctx.log("rerun " + name + " reason=" + reason)
            note = ("This is rerun " + str(attempts) + " with reason_code=" + reason
                    + " (pass rerun_reason='" + reason + "' to sme_case_put_result). "
                    + "Fix these verification errors: " + "; ".join(verdict.get("errors", [])[:10]))
        report[name] = {"passed": bool(verdict.get("passed")), "attempts": attempts,
                        "errors": verdict.get("errors", [])}
        return verdict

    ctx.phase("Documents")
    await run_verified("document-evidence", "Documents")

    ctx.phase("Product")
    await run_verified("product-match", "Product")

    ctx.phase("Specialists")
    specialists = ["financial-analysis", "risk-compliance", "collateral"]
    if flow == "B":
        specialists.append("industry")
    await ctx.parallel([lambda n=n: run_verified(n, "Specialists") for n in specialists])

    # Policy reads the verified product, financial and collateral results.
    ctx.phase("Policy")
    await run_verified("policy-exception", "Policy")

    ctx.phase("Consolidate")
    await run_verified("consolidation", "Consolidate", semantic=True)

    blocked = [n for n, r in report.items() if not r["passed"]]
    ctx.log(str(len(blocked)) + " agent result(s) blocked by verification")
    return {
        "case_id": case_id,
        "flow": flow,
        "agents": report,
        "blocked": blocked,
        "next_step": "officer review: open sme_review_list for this case",
    }
