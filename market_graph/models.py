"""Market graph placeholders. MVP uses regulation + platform overlays."""

from pydantic import BaseModel, Field


class MarketNode(BaseModel):
    country: str
    import_rule: str = ""
    certification: list[str] = Field(default_factory=list)
    tariff: str = ""
    tax: str = ""
    restrictions: list[str] = Field(default_factory=list)
    label: list[str] = Field(default_factory=list)
    testing: list[str] = Field(default_factory=list)
    local_representative: str = ""
    registration: str = ""
