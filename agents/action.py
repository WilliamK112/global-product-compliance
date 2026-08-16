from __future__ import annotations

from regulation_graph.assess import MarketAccessState


def remediation_plan(state: MarketAccessState) -> dict:
    steps = []
    seen = set()
    for finding in state.findings:
        if finding.status == "PASS":
            continue
        for action in finding.required_actions:
            if action not in seen:
                seen.add(action)
                steps.append(
                    {
                        "step": len(steps) + 1,
                        "action": action,
                        "requirement_id": finding.requirement_id,
                        "status": finding.status,
                    }
                )
        if finding.status in {"UNCERTAIN", "EXPERT_REVIEW_REQUIRED"}:
            steps.append(
                {
                    "step": len(steps) + 1,
                    "action": "Escalate to a qualified regulatory consultant, testing lab, or lawyer",
                    "requirement_id": finding.requirement_id,
                    "status": finding.status,
                }
            )
    return {
        "sku": state.sku,
        "country": state.country,
        "platform": state.platform,
        "current_status": state.status,
        "reason": state.why,
        "missing_items": state.missing_items,
        "steps": steps,
        "recheck_after_fix": True,
        "disclaimer": "Not a legal opinion. Re-run the engine after evidence is attached.",
    }
