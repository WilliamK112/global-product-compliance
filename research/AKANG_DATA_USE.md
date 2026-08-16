# Akang database use (read-only, only if needed)

Evaluated 2026-08-16 against CanSell MVP (consumer electronics → EU/US/ID).

**Identified store:** Cloudflare D1 `akang-health-global-db` (`database_id` e7c0f9ef-8c28-4699-9c78-6a3176de313a) in `akang-health-industry-os` wrangler config. Local legal files also exist at `~/Desktop/阿康实习/github和数据库`. Wrangler is **not logged in** on this machine. The string `akangjkang` is treated as the account/owner pointer, not as a second product database.

## Decision

**Do not copy the Akang database into this public repo.**

It is not needed for the current electronics market-access engine. Official RED/LVD/EMC/GPSR/FCC/DJID/Notifkos sources are already encoded. Akang content is **pharma / health-system market access**, a different vertical.

## What was inspected

| Asset | What it is | Fit for CanSell MVP |
|---|---|---|
| `pharmaceutical_products` | 阿康药品 SKU、批准文号、成分 | No. Wrong category. Would fake electronics coverage. |
| BPOM CDOB certificates / PBF list | 药品批发质量认证 | No. Cosmetics contrast SKU uses **Notifkos**, not CDOB. |
| `data/legal-corpus/id` | UU 17/2023, PerBPOM drug registration, CDOB, online pharmacy | No for speakers/LED. Later only if we add **health products**. |
| `data/legal-corpus/us` | 21 USC 351/355/360/381, 21 CFR 210/211, HIPAA, CFIUS | 21 USC 381 (imports) is adjacent to cosmetics, already covered by FDA MoCRA guidance. Not required now. |
| World Bank country snapshot | 217 economies health/economy indicators | Market sizing later, not matching. |
| Source registry + sha256 documents | Evidence method | **Already reused as method**, not as a data dump. |
| Company financials / 阿康主体 | Private research subject | **Never** copy into GOAI public tree. |

## Use policy if we need it later

1. Read-only. Never write back to Akang. Never overwrite the Akang repo.
2. Copy only **public official citations** (URL, article, hash, short excerpt) with `provenance: akang-health-industry-os`.
3. Do not publish CDOB certificate dumps, partner lists, or financial facts.
4. D1 access requires `wrangler login` on the akangjkang/Cloudflare account — ask before that login.

## Trigger to actually import

Only if CanSell adds a **health/pharma/medical-device** SKU family, or Indonesia cosmetics needs Izin Edar-class clauses beyond Notifkos. Until then, keep the adapter unplugged.
