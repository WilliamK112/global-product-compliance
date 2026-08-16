"""Verification pyramid. LLM interpretation is never a sufficient source."""

LEVELS = [
    "official_regulation",
    "official_authority_guidance",
    "platform_rule",
    "accredited_standard",
    "cross_source_verification",
    "llm_interpretation",
    "human_expert",
]

RANK = {name: index for index, name in enumerate(LEVELS)}
INSUFFICIENT_ALONE = {"llm_interpretation"}


def evidence_quality(levels: list[str]) -> str:
    if not levels:
        return "none"
    best = min(RANK.get(level, len(LEVELS)) for level in levels)
    if best <= RANK["official_regulation"]:
        return "high"
    if best <= RANK["accredited_standard"]:
        return "medium"
    return "low"


def can_assert_without_expert(levels: list[str]) -> bool:
    usable = [level for level in levels if level not in INSUFFICIENT_ALONE]
    return bool(usable)
