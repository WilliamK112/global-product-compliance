from __future__ import annotations

from typing import Any, Literal

from pydantic import BaseModel, Field


class EvidenceRef(BaseModel):
    authority: str
    document: str
    article: str = ""
    source_url: str
    retrieved_at: str
    hash: str
    excerpt: str = ""
    language: str = "en"
    verification_level: str = "official_regulation"


class Requirement(BaseModel):
    requirement_id: str
    regulation_id: str
    title: str
    requirement_type: str
    product_scope: dict[str, Any]
    missing_if_unmet: str
    default_status_if_unmet: Literal[
        "WARNING", "BLOCKED", "UNCERTAIN", "EXPERT_REVIEW_REQUIRED"
    ] = "WARNING"
    satisfied_by: list[str] = Field(default_factory=list)
    actions: list[str] = Field(default_factory=list)
    evidence: list[EvidenceRef] = Field(default_factory=list)


class Regulation(BaseModel):
    regulation_id: str
    version: str
    jurisdiction: str
    authority: str
    document: str
    status: Literal["in_force", "upcoming", "repealed"] = "in_force"
    effective_from: str
    effective_to: str | None = None
    supersedes: str | None = None
    source_url: str
    source_hash: str
    language: str = "en"
    translation: str | None = None
    retrieved_at: str
    requirements: list[Requirement] = Field(default_factory=list)
