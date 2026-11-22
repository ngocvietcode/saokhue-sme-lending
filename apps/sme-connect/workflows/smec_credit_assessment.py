# Workflow smec-credit-assessment: dieu phoi 9 AI Agents ho tro CBBH tren SME Connect.
# Ho tro tham so selected_groups (fin, col, risk, pol) va tu dong bo qua collateral khi goi san pham 100% tin chap.

META = {
    "name": "smec-credit-assessment",
    "description": "SME Connect 9-Agent credit assessment for CBBH with selective specialist groups and deterministic verification",
    "phases": [
        {"title": "Documents"},
        {"title": "Product"},
        {"title": "Specialists"},
        {"title": "Policy"},
        {"title": "Consolidate"},
    ],
}

APP = "sme-connect--"
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
    has_collateral = bool(ctx.args.get("has_collateral", True))
    selected = ctx.args.get("selected_groups") or ["fin", "col", "risk", "pol"]
    max_reruns = min(int(ctx.args.get("max_reruns", 1)), MAX_RERUNS_CAP)
    report = {}

    async def run_agent(name, phase, note):
        prompt = (
            "case_id=" + case_id + " flow=" + flow + ". "
            "Run your SME Connect skill on this case. " + note + " "
            "Store the result with sme_case_put_result (agent='" + name + "'). "
            "Return that JSON plus stored_version."
        )
        return await ctx.agent(prompt, agent=APP + name, label=name, phase=phase, schema=RESULT_SCHEMA)

    async def verify(name, phase):
        prompt = (
            "case_id=" + case_id + ". Verify the latest result of agent '" + name + "' "
            "with sme_verify_result. Return the verdict JSON."
        )
        return await ctx.agent(prompt, agent=APP + "verifier", label="verify:" + name, phase=phase, schema=VERDICT_SCHEMA)

    async def run_verified(name, phase, semantic=False):
        note = ""
        attempts = 0
        while True:
            attempts += 1
            result = await run_agent(name, phase, note)
            if result is None or int(result.get("stored_version", 0) or 0) < 1:
                verdict = {
                    "agent": name,
                    "passed": False,
                    "rerun_reason": "schema_error",
                    "errors": ["result was not accepted by sme_case_put_result"],
                }
            elif not semantic:
                verdict = {"agent": name, "passed": True, "rerun_reason": "none", "errors": []}
            else:
                verdict = await verify(name, phase) or {
                    "agent": name,
                    "passed": False,
                    "rerun_reason": "none",
                    "errors": ["verifier returned no verdict"],
                }
            reason = verdict.get("rerun_reason", "none")
            if verdict.get("passed") or reason == "none" or attempts > max_reruns:
                break
            note = "Rerun " + str(attempts) + " reason_code=" + reason + ". Fix: " + "; ".join(verdict.get("errors", [])[:8])
        report[name] = {
            "passed": bool(verdict.get("passed")),
            "attempts": attempts,
            "stored_version": (result or {}).get("stored_version", 0),
        }

    with ctx.phase("Documents"):
        await run_verified("document-evidence", "Documents")

    with ctx.phase("Product"):
        await run_verified("product-match", "Product")

    with ctx.phase("Specialists"):
        specialists = []
        if "fin" in selected:
            specialists.extend(["financial-analysis", "industry"])
        if "risk" in selected:
            specialists.append("risk-compliance")
        if "col" in selected and has_collateral:
            specialists.append("collateral")
        if specialists:
            await ctx.parallel(*[run_verified(s, "Specialists") for s in specialists])

    with ctx.phase("Policy"):
        if "pol" in selected:
            await run_verified("policy-exception", "Policy")

    with ctx.phase("Consolidate"):
        await run_verified("consolidation", "Consolidate", semantic=True)

    return {"case_id": case_id, "flow": flow, "selected_groups": selected, "agents": report}
