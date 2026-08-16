from __future__ import annotations

from typing import Literal

from pydantic import BaseModel, Field

from product_graph.models import ProductTwin
from regulation_graph.match import requirement_applies, requirement_satisfied
from regulation_graph.models import EvidenceRef, Regulation, Requirement
from verification.pyramid import can_assert_without_expert, evidence_quality

Status = Literal["PASS", "WARNING", "BLOCKED", "UNCERTAIN", "EXPERT_REVIEW_REQUIRED"]
RANK = {
    "PASS": 0,
    "UNCERTAIN": 1,
    "WARNING": 2,
    "EXPERT_REVIEW_REQUIRED": 3,
    "BLOCKED": 4,
}


class Finding(BaseModel):
    requirement_id: str
    regulation_id: str
    title: str
    status: Status
    reason: str
    missing_item: str | None = None
    required_actions: list[str] = Field(default_factory=list)
    confidence: float
    evidence_quality: str
    last_verified: str
    source_authority: str
    evidence: list[EvidenceRef] = Field(default_factory=list)


class MarketAccessState(BaseModel):
    sku: str
    country: str
    platform: str
    status: Status
    findings: list[Finding]
    confidence: float
    evidence_quality: str
    last_verified: str
    why: str
    applicable_rules: list[str]
    missing_items: list[str]
    required_actions: list[str]


def _worst(statuses: list[Status]) -> Status:
    if not statuses:
        return "UNCERTAIN"
    return max(statuses, key=lambda item: RANK[item])


def _confidence(requirement: Requirement, satisfied: bool) -> float:
    levels = [item.verification_level for item in requirement.evidence]
    quality = evidence_quality(levels)
    if not can_assert_without_expert(levels):
        return 0.35
    if quality == "high":
        return 0.86 if satisfied else 0.84
    if quality == "medium":
        return 0.72
    return 0.48


def assess_requirement(product: ProductTwin, requirement: Requirement) -> Finding | None:
    if not requirement_applies(product, requirement):
        return None
    levels = [item.verification_level for item in requirement.evidence]
    satisfied = requirement_satisfied(product, requirement)
    if not can_assert_without_expert(levels):
        status: Status = "EXPERT_REVIEW_REQUIRED"
        reason = "Only LLM-level interpretation is available; expert review required."
        missing = requirement.missing_if_unmet
    elif satisfied:
        status = "PASS"
        reason = "Product evidence matches the requirement tokens."
        missing = None
    else:
        status = requirement.default_status_if_unmet
        reason = f"Applicable requirement is not evidenced on this SKU: {requirement.title}"
        missing = requirement.missing_if_unmet
    authority = requirement.evidence[0].authority if requirement.evidence else "unknown"
    last_verified = requirement.evidence[0].retrieved_at if requirement.evidence else ""
    return Finding(
        requirement_id=requirement.requirement_id,
        regulation_id=requirement.regulation_id,
        title=requirement.title,
        status=status,
        reason=reason,
        missing_item=missing,
        required_actions=requirement.actions if status != "PASS" else [],
        confidence=_confidence(requirement, satisfied),
        evidence_quality=evidence_quality(levels),
        last_verified=last_verified,
        source_authority=authority,
        evidence=requirement.evidence,
    )


def assess_cell(
    product: ProductTwin,
    country: str,
    platform: str,
    regulations: list[Regulation],
    extra_requirements: list[Requirement] | None = None,
) -> MarketAccessState:
    findings: list[Finding] = []
    for regulation in regulations:
        if regulation.jurisdiction not in {country, "GLOBAL"}:
            continue
        for requirement in regulation.requirements:
            finding = assess_requirement(product, requirement)
            if finding:
                findings.append(finding)
    for requirement in extra_requirements or []:
        finding = assess_requirement(product, requirement)
        if finding:
            findings.append(finding)
    status = _worst([item.status for item in findings]) if findings else "UNCERTAIN"
    why = (
        "No encoded official requirement matched this product in this market; refusing to mark PASS."
        if status == "UNCERTAIN" and not findings
        else "; ".join(item.reason for item in findings if item.status == status)
    )
    confidences = [item.confidence for item in findings] or [0.2]
    qualities = [item.evidence_quality for item in findings]
    quality = "none"
    if "high" in qualities:
        quality = "high"
    elif "medium" in qualities:
        quality = "medium"
    elif qualities:
        quality = "low"
    last_verified = max((item.last_verified for item in findings), default="")
    return MarketAccessState(
        sku=product.sku,
        country=country,
        platform=platform,
        status=status,
        findings=findings,
        confidence=round(min(confidences), 2),
        evidence_quality=quality,
        last_verified=last_verified,
        why=why,
        applicable_rules=[item.requirement_id for item in findings],
        missing_items=[item.missing_item for item in findings if item.missing_item and item.status != "PASS"],
        required_actions=[action for item in findings for action in item.required_actions],
    )


def assess_matrix(
    products: list[ProductTwin],
    countries: list[str],
    platforms: list[str],
    regulations: list[Regulation],
    platform_requirements: dict[str, list[Requirement]],
) -> list[MarketAccessState]:
    results: list[MarketAccessState] = []
    for product in products:
        target_countries = product.target_countries or countries
        target_platforms = product.target_platforms or platforms
        for country in target_countries:
            for platform in target_platforms:
                scoped = []
                for req in platform_requirements.get(platform, []):
                    scope_countries = (req.product_scope or {}).get("countries")
                    if scope_countries and country not in scope_countries:
                        continue
                    scoped.append(req)
                results.append(assess_cell(product, country, platform, regulations, scoped))
    return results
