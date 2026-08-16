from __future__ import annotations

from pydantic import BaseModel, Field

from product_graph.models import ProductTwin
from regulation_graph.assess import MarketAccessState, assess_matrix
from regulation_graph.models import Regulation, Requirement


class ChangeImpact(BaseModel):
    change_id: str
    jurisdiction: str
    effective_date: str
    summary: str
    affected_requirements: list[str] = Field(default_factory=list)
    affected_skus: list[str] = Field(default_factory=list)
    before: dict[str, str] = Field(default_factory=dict)
    after: dict[str, str] = Field(default_factory=dict)
    severity: str
    required_actions: list[str] = Field(default_factory=list)
    evidence: list[dict] = Field(default_factory=list)


def apply_change(
    products: list[ProductTwin],
    countries: list[str],
    platforms: list[str],
    base_regulations: list[Regulation],
    added_regulations: list[Regulation],
    platform_requirements: dict[str, list[Requirement]],
    change_id: str,
    jurisdiction: str,
    effective_date: str,
    summary: str,
) -> tuple[list[MarketAccessState], list[MarketAccessState], ChangeImpact]:
    before = assess_matrix(products, countries, platforms, base_regulations, platform_requirements)
    after = assess_matrix(
        products,
        countries,
        platforms,
        base_regulations + added_regulations,
        platform_requirements,
    )
    before_map = {(item.sku, item.country, item.platform): item.status for item in before}
    after_map = {(item.sku, item.country, item.platform): item.status for item in after}
    affected = []
    before_status = {}
    after_status = {}
    actions: list[str] = []
    req_ids: list[str] = []
    for key, new_status in after_map.items():
        old_status = before_map.get(key, "UNCERTAIN")
        if new_status != old_status:
            sku, country, platform = key
            affected.append(sku)
            before_status[f"{sku}|{country}|{platform}"] = old_status
            after_status[f"{sku}|{country}|{platform}"] = new_status
    for item in after:
        if item.sku in affected:
            actions.extend(item.required_actions)
            req_ids.extend(item.applicable_rules)
    unique_skus = sorted(set(affected))
    severity = "high" if any(status in {"BLOCKED", "WARNING"} for status in after_status.values()) else "medium"
    evidence = []
    for regulation in added_regulations:
        for requirement in regulation.requirements:
            evidence.extend([ref.model_dump() for ref in requirement.evidence])
    impact = ChangeImpact(
        change_id=change_id,
        jurisdiction=jurisdiction,
        effective_date=effective_date,
        summary=summary,
        affected_requirements=sorted(set(req_ids)),
        affected_skus=unique_skus,
        before=before_status,
        after=after_status,
        severity=severity,
        required_actions=sorted(set(actions)),
        evidence=evidence[:8],
    )
    return before, after, impact
