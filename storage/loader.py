from __future__ import annotations

import hashlib
import json
from pathlib import Path

from regulation_graph.models import EvidenceRef, Regulation, Requirement

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "data"


def _hash(payload: str) -> str:
    return hashlib.sha256(payload.encode("utf-8")).hexdigest()


def _evidence(item: dict) -> EvidenceRef:
    raw = json.dumps(item, sort_keys=True)
    item = {**item, "hash": item.get("hash") or _hash(raw)}
    return EvidenceRef(**item)


def load_regulations(include_upcoming: bool = False) -> list[Regulation]:
    payload = json.loads((DATA / "regulations" / "seed.json").read_text())
    regulations = []
    for item in payload["regulations"]:
        if item.get("status") == "upcoming" and not include_upcoming:
            continue
        requirements = []
        for req in item["requirements"]:
            req = {**req, "evidence": [_evidence(ev) for ev in req.get("evidence", [])]}
            requirements.append(Requirement(**req))
        regulations.append(Regulation(**{**item, "requirements": requirements, "source_hash": item.get("source_hash") or _hash(item["source_url"] + item["version"])}))
    return regulations


def load_upcoming_regulations() -> list[Regulation]:
    payload = json.loads((DATA / "regulations" / "seed.json").read_text())
    upcoming = []
    for item in payload["regulations"]:
        if item.get("status") != "upcoming":
            continue
        requirements = []
        for req in item["requirements"]:
            req = {**req, "evidence": [_evidence(ev) for ev in req.get("evidence", [])]}
            requirements.append(Requirement(**req))
        upcoming.append(Regulation(**{**item, "requirements": requirements, "source_hash": item.get("source_hash") or _hash(item["source_url"] + item["version"])}))
    return upcoming


def load_platform_requirements() -> dict[str, list[Requirement]]:
    payload = json.loads((DATA / "platforms" / "seed.json").read_text())
    result: dict[str, list[Requirement]] = {}
    for platform, items in payload["platforms"].items():
        result[platform] = []
        for req in items["requirements"]:
            req = {**req, "evidence": [_evidence(ev) for ev in req.get("evidence", [])]}
            result[platform].append(Requirement(**req))
    return result
