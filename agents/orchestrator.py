from __future__ import annotations

from pathlib import Path

from agents.action import remediation_plan
from monitoring.change_impact import apply_change
from product_graph.intake import parse_catalog_csv
from product_graph.models import ProductTwin
from regulation_graph.assess import MarketAccessState, assess_matrix
from storage.loader import load_platform_requirements, load_regulations, load_upcoming_regulations

ROOT = Path(__file__).resolve().parents[1]
DEFAULT_COUNTRIES = ["EU", "US", "ID"]
DEFAULT_PLATFORMS = ["Alibaba.com", "Amazon"]


def load_demo_products() -> list[ProductTwin]:
    text = (ROOT / "data" / "products" / "demo_catalog.csv").read_text()
    return parse_catalog_csv(text)


def _portfolio_from(products: list[ProductTwin], include_upcoming: bool = False) -> dict:
    regulations = load_regulations(include_upcoming=include_upcoming)
    platforms = load_platform_requirements()
    matrix = assess_matrix(products, DEFAULT_COUNTRIES, DEFAULT_PLATFORMS, regulations, platforms)
    actions = []
    for item in matrix:
        state = MarketAccessState(**item.model_dump())
        plan = remediation_plan(state)
        if plan["steps"]:
            actions.append(plan)
    return {
        "products": [item.model_dump() for item in products],
        "matrix": [item.model_dump() for item in matrix],
        "countries": DEFAULT_COUNTRIES,
        "platforms": DEFAULT_PLATFORMS,
        "actions": actions,
        "disclaimer": "Not a legal opinion. Automated interpretation bound to encoded official sources.",
    }


def run_portfolio(products: list[ProductTwin] | None = None, include_upcoming: bool = False):
    return _portfolio_from(products or load_demo_products(), include_upcoming=include_upcoming)


def recheck_sku(sku: str, extra_certifications: list[str], products: list[ProductTwin] | None = None) -> dict:
    catalog = [item.model_copy(deep=True) for item in (products or load_demo_products())]
    target = next((item for item in catalog if item.sku == sku), None)
    if target is None:
        raise KeyError(sku)
    before = run_portfolio(catalog)
    merged = {item.upper() for item in target.certifications}
    merged.update(item.upper() for item in extra_certifications if item.strip())
    target.certifications = sorted(merged)
    after = run_portfolio(catalog)
    before_cells = {
        (item["country"], item["platform"]): item["status"]
        for item in before["matrix"]
        if item["sku"] == sku
    }
    after_cells = {
        (item["country"], item["platform"]): item["status"]
        for item in after["matrix"]
        if item["sku"] == sku
    }
    moved = {
        f"{sku}|{country}|{platform}": {"before": before_cells[(country, platform)], "after": after_cells[(country, platform)]}
        for country, platform in after_cells
        if before_cells.get((country, platform)) != after_cells[(country, platform)]
    }
    return {
        "sku": sku,
        "added_certifications": sorted({item.upper() for item in extra_certifications if item.strip()}),
        "certifications": target.certifications,
        "moved": moved,
        "portfolio": after,
    }


def run_change_demo(products: list[ProductTwin] | None = None):
    products = products or load_demo_products()
    base = load_regulations(include_upcoming=False)
    upcoming = load_upcoming_regulations()
    platforms = load_platform_requirements()
    before, after, impact = apply_change(
        products,
        DEFAULT_COUNTRIES,
        DEFAULT_PLATFORMS,
        base,
        upcoming,
        platforms,
        change_id="id-sni-luminaires-2026-monitor",
        jurisdiction="ID",
        effective_date="2026-10-01",
        summary="Monitored update to Indonesian luminaire SNI/IEC 60598 evidence. Lighting SKUs are re-evaluated; other categories are unchanged.",
    )
    return {
        "before": [item.model_dump() for item in before],
        "after": [item.model_dump() for item in after],
        "impact": impact.model_dump(),
    }
