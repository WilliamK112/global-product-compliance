#!/usr/bin/env python3
"""Copy Python seed files into the Next.js app so Vercel and pytest share one source."""
from __future__ import annotations

from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
WEB = ROOT / "apps" / "web"


def write_demo_catalog_ts(csv_text: str) -> None:
    body = csv_text.replace("\\", "\\\\").replace("`", "\\`")
    (WEB / "lib" / "demo-catalog.ts").write_text(
        "export const DEMO_CATALOG_CSV = `" + body.rstrip() + "\n`;\n",
        encoding="utf-8",
    )


def main() -> None:
    regs = (ROOT / "data" / "regulations" / "seed.json").read_text()
    plats = (ROOT / "data" / "platforms" / "seed.json").read_text()
    catalog = (ROOT / "data" / "products" / "demo_catalog.csv").read_text()
    (WEB / "data").mkdir(parents=True, exist_ok=True)
    (WEB / "data" / "regulations.json").write_text(regs)
    (WEB / "data" / "platforms.json").write_text(plats)
    (WEB / "data" / "demo_catalog.csv").write_text(catalog)
    (WEB / "public" / "templates").mkdir(parents=True, exist_ok=True)
    (WEB / "public" / "templates" / "cansell-catalog.csv").write_text(catalog)
    write_demo_catalog_ts(catalog)
    print("synced apps/web/data and demo-catalog.ts from data/")


if __name__ == "__main__":
    main()
