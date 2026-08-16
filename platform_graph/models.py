from pydantic import BaseModel, Field


class PlatformRequirement(BaseModel):
    platform: str
    requirement_id: str
    title: str
    countries: list[str] = Field(default_factory=list)
