# CanSell runbook

Not legal advice. Do not present output as a customs ruling.

## Live product

https://cansell-kappa.vercel.app

1. Open the ledger. Demo catalog is Guangdong electronics + one cosmetics contrast SKU.
2. Click a stamp for Why, article, official URL, hash, missing items, actions.
3. Upload CSV (template: `/api/catalog`) or restore the demo catalog.
4. Click **改首行 SKU 名再评估**. Statuses stay the same if attributes are unchanged.
5. Click **模拟法规变更**. Only lighting SKUs move (LED ID PASS → WARNING).
6. Attach `CE-RED,EU-RP,FCC,DJID` to `BT-SPEAKER-01` and **补证后再评估**.

Pitch: https://cansell-kappa.vercel.app/pitch.html

## Reproduce locally

Python engine (source of truth for pytest):

```bash
cd /path/to/global-product-compliance
python3.11 -m venv .venv
source .venv/bin/activate
pip install pytest pydantic fastapi python-multipart uvicorn
python3 scripts/sync_web_data.py
pytest -q
uvicorn apps.api.main:app --port 8000
```

Fallback UI: http://127.0.0.1:8000

Next.js / Vercel engine:

```bash
python3 scripts/sync_web_data.py
cd apps/web
npm install
npm run build
npm run dev
```

Open http://127.0.0.1:3000

## Sync rule

Edit only `data/regulations/seed.json`, `data/platforms/seed.json`, `data/products/demo_catalog.csv`. Then run `python3 scripts/sync_web_data.py`. `tests/test_parity.py` fails if the web copies drift.

Optional official hash refresh (stores hashes, not full law text). On some macOS Python builds SSL verify may fail; encoded evidence hashes are still computed at load time from excerpts + URLs.

```bash
python3 tools/refresh_source_hashes.py
```

## If Vercel is down

Show pytest output and FastAPI at port 8000. The matching engine is deterministic and does not need an LLM.

## Do not

- Add a legal chatbot.
- Claim 200-country coverage.
- Import Akang pharma SKUs into this repo.
- Treat PASS as permission to ship.
