"""Fetch allowed official URLs and store content hashes. Does not save full law text."""
from __future__ import annotations

import hashlib
import json
import sys
from pathlib import Path
from urllib.request import Request, urlopen

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))
from tools.official_http import allowed

ROOT = Path(__file__).resolve().parents[1]
SEED = ROOT / "data" / "regulations" / "seed.json"
LOG = ROOT / "data" / "regulations" / "source_hashes.json"


def fetch_hash(url: str, timeout: int = 20) -> dict:
    if not allowed(url):
        return {"url": url, "ok": False, "error": "host not allowlisted"}
    try:
        req = Request(url, headers={"User-Agent": "CanSell-source-monitor/0.1"})
        with urlopen(req, timeout=timeout) as response:
            body = response.read()
        digest = hashlib.sha256(body).hexdigest()
        return {
            "url": url,
            "ok": True,
            "status": response.status,
            "bytes": len(body),
            "sha256": digest,
        }
    except Exception as exc:  # network is optional in CI
        return {"url": url, "ok": False, "error": str(exc)}


def urls_from_seed() -> list[str]:
    payload = json.loads(SEED.read_text())
    seen: list[str] = []
    for regulation in payload["regulations"]:
        url = regulation.get("source_url")
        if url and url not in seen:
            seen.append(url)
        for requirement in regulation.get("requirements", []):
            for evidence in requirement.get("evidence", []):
                url = evidence.get("source_url")
                if url and url not in seen:
                    seen.append(url)
    return seen


def main() -> None:
    results = [fetch_hash(url) for url in urls_from_seed()]
    LOG.write_text(json.dumps({"retrieved_note": "Hashes of fetched official pages. Full texts are not stored.", "results": results}, indent=2) + "\n")
    ok = sum(1 for item in results if item.get("ok"))
    print(f"hashed {ok}/{len(results)} official URLs -> {LOG}")


if __name__ == "__main__":
    main()
