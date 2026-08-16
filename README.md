# CanSell · 能卖哪

**Know where every product can sell — before regulations stop it.**

The market-access layer for global commerce. Upload a catalog. For each SKU × country × platform the engine returns `PASS` / `WARNING` / `BLOCKED` / `UNCERTAIN` / `EXPERT_REVIEW_REQUIRED`, with official evidence, missing items, and a remediation list. A regulation change tells you **which SKUs moved**, not that “a new law exists.”

This is **not a legal opinion** and **not a regulation search engine**.

GOAI 2026 track: **Boundless Agents / 无界应用 / AI+工业制造**.

## Credible subset (on purpose)

3 product types × 3 markets × 2 platforms, every requirement bound to a public official or platform URL:

- Products: Bluetooth speaker, LED lamp, cosmetic serum (electronics primary; cosmetics is a contrast SKU)
- Markets: EU, US, Indonesia
- Platforms: Alibaba.com, Amazon

No fake “200 countries.”

## Run

```bash
python3 -m pip install -e ".[dev]"
python3 -m pytest
python3 -m uvicorn apps.api.main:app --port 8000
```

```bash
cd apps/web && npm install && npm run dev
```

Open http://localhost:3000 — the UI proxies `/backend/*` to the API.

Demo catalog: `data/products/demo_catalog.csv`.

## Core calculation

`Product × Country × Platform × Regulation = Market Access State`

Matching is deterministic on product attributes. Renaming a SKU cannot change the answer. An unknown category cannot PASS.

## License

MIT. Regulation excerpts are cited for identification; retrieve full text from the official URL.
