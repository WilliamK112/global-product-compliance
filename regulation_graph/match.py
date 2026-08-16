from __future__ import annotations

from typing import Any

from product_graph.models import ProductTwin
from regulation_graph.models import Requirement


def _matches_clause(product: ProductTwin, clause: dict[str, Any]) -> bool:
    if "all" in clause:
        return all(_matches_clause(product, item) for item in clause["all"])
    if "any" in clause:
        return any(_matches_clause(product, item) for item in clause["any"])
    if "not" in clause:
        return not _matches_clause(product, clause["not"])
    attr = clause.get("attr")
    value = product.attr(attr) if attr else None
    if "eq" in clause:
        return value == clause["eq"]
    if "in" in clause:
        if isinstance(value, list):
            return any(item in clause["in"] for item in value)
        return value in clause["in"]
    if "contains_any" in clause:
        haystack = [str(item).lower() for item in (value or [])]
        return any(needle.lower() in " ".join(haystack) or needle.lower() in haystack for needle in clause["contains_any"])
    if "truthy" in clause:
        return bool(value) is bool(clause["truthy"])
    return False


def requirement_applies(product: ProductTwin, requirement: Requirement) -> bool:
    scope = requirement.product_scope or {}
    if not scope:
        return False
    return _matches_clause(product, scope)


def requirement_satisfied(product: ProductTwin, requirement: Requirement) -> bool:
    if not requirement.satisfied_by:
        return False
    certs = {item.upper() for item in product.certifications}
    labels = {item.upper() for item in product.labels}
    available = certs | labels
    return any(token.upper() in available for token in requirement.satisfied_by)
