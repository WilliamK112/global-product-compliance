from __future__ import annotations

import csv
import io
from typing import Any

from product_graph.models import ProductTwin

TRUE_VALUES = {"1", "true", "yes", "y", "是"}


def _split(value: str) -> list[str]:
    if not value:
        return []
    return [part.strip() for part in value.replace(";", ",").split(",") if part.strip()]


def _bool(value: str) -> bool:
    return value.strip().lower() in TRUE_VALUES


def row_to_twin(row: dict[str, str]) -> ProductTwin:
    data = {key.strip(): (value or "").strip() for key, value in row.items() if key}
    category = data.get("category", "").lower().replace(" ", "_")
    wireless = _split(data.get("wireless_tech", data.get("wireless", "")))
    return ProductTwin(
        sku=data["sku"],
        name=data.get("name") or data["sku"],
        description=data.get("description", ""),
        category=category,
        origin=data.get("origin", "CN") or "CN",
        hs_code_candidates=_split(data.get("hs_code", data.get("hs_code_candidates", ""))),
        materials=_split(data.get("materials", "")),
        ingredients=_split(data.get("ingredients", "")),
        claims=_split(data.get("claims", "")),
        manufacturer=data.get("manufacturer", ""),
        certifications=[item.upper() for item in _split(data.get("certifications", ""))],
        labels=_split(data.get("labels", "")),
        packaging=_split(data.get("packaging", "")),
        has_battery=_bool(data.get("has_battery", "")) or "battery" in " ".join(_split(data.get("materials", ""))).lower(),
        battery_type=data.get("battery_type") or None,
        has_wireless=_bool(data.get("has_wireless", "")) or bool(wireless),
        wireless_tech=wireless,
        mains_powered=_bool(data.get("mains_powered", "")),
        target_countries=[item.upper() for item in _split(data.get("target_country", data.get("target_countries", "")))],
        target_platforms=_split(data.get("target_platform", data.get("target_platforms", ""))),
        attributes={
            "voltage": data.get("voltage", ""),
            "intended_user": data.get("intended_user", "general"),
        },
    )


def parse_catalog_csv(text: str) -> list[ProductTwin]:
    reader = csv.DictReader(io.StringIO(text))
    products = [row_to_twin(row) for row in reader]
    if not products:
        raise ValueError("Catalog CSV produced zero products")
    return products


def classify_from_clues(clues: dict[str, Any]) -> dict[str, Any]:
    """Vision/text clues are candidates only. Never treated as facts."""
    return {
        "category_candidate": clues.get("category_candidate"),
        "has_wireless_candidate": clues.get("has_wireless_candidate"),
        "requires_manual_confirmation": True,
        "status": "UNCERTAIN",
    }
