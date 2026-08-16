from __future__ import annotations

from pathlib import Path

from monitoring.change_impact import apply_change
from product_graph.intake import parse_catalog_csv
from product_graph.models import ProductTwin
from regulation_graph.assess import assess_matrix
from storage.loader import load_platform_requirements, load_regulations, load_upcoming_regulations

ROOT = Path(__file__).resolve().parents[1]
DEFAULT_COUNTRIES = ["EU", "US", "ID"]
DEFAULT_PLATFORMS = ["Alibaba.com", "Amazon"]


def load_demo_products() -> list[ProductTwin]:
    text = (ROOT / "data" / "products" / "demo_catalog.csv").read_text()
    return parse_catalog_csv(text)


def run_portfolio(products: list[ProductTwin] | None = None, include_upcoming: bool = False):
    products = products or load_demo_products()
    regulations = load_regulations(include_upcoming=include_upcoming)
    platforms = load_platform_requirements()
    matrix = assess_matrix(products, DEFAULT_COUNTRIES, DEFAULT_PLATFORMS, regulations, platforms)
    return {
        "products": [item.model_dump() for item in products],
        "matrix": [item.model_dump() for item in matrix],
        "countries": DEFAULT_COUNTRIES,
        "platforms": DEFAULT_PLATFORMS,
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
