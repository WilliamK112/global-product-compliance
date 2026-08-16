from __future__ import annotations

from typing import Any

from pydantic import BaseModel, Field


class ProductTwin(BaseModel):
    sku: str
    name: str
    description: str = ""
    category: str
    origin: str = "CN"
    hs_code_candidates: list[str] = Field(default_factory=list)
    materials: list[str] = Field(default_factory=list)
    ingredients: list[str] = Field(default_factory=list)
    claims: list[str] = Field(default_factory=list)
    manufacturer: str = ""
    certifications: list[str] = Field(default_factory=list)
    labels: list[str] = Field(default_factory=list)
    packaging: list[str] = Field(default_factory=list)
    has_battery: bool = False
    battery_type: str | None = None
    has_wireless: bool = False
    wireless_tech: list[str] = Field(default_factory=list)
    mains_powered: bool = False
    target_countries: list[str] = Field(default_factory=list)
    target_platforms: list[str] = Field(default_factory=list)
    attributes: dict[str, Any] = Field(default_factory=dict)
    evidence_ids: list[str] = Field(default_factory=list)
    image_clues: list[str] = Field(default_factory=list)
    image_confirmed: bool = False

    def attr(self, key: str) -> Any:
        if hasattr(self, key):
            return getattr(self, key)
        return self.attributes.get(key)
