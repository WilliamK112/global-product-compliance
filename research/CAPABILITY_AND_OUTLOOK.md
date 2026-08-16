# Expected Capability and Later Outlook

Not a feature changelog. Three layers:

1. **Expected capability** — the product contract. Scale may grow; the questions do not change.
2. **Now** — what the live demo and this repo actually run.
3. **Later** — outlook. Do not read as shipped.

Last aligned with code: 2026-08-16.

---

## Expected capability (contract)

A Chinese exporter uploads a **product catalog**. For every `SKU × country × marketplace` the system returns a **market-access state**, not a law summary.

```
Product Portfolio × Country × Marketplace × Regulation
        ↓
Market Access State
        ↓
Impact (which SKUs)
        ↓
Remediation → Re-check
```

The engine must keep answering these ten questions (README §01):

| # | Question | Expected answer |
|---|---|---|
| 01 | Can this SKU enter the destination? | `PASS / WARNING / BLOCKED / UNCERTAIN / EXPERT_REVIEW_REQUIRED` — never Yes/No |
| 02 | Why? | Bound to applicable articles, not the SKU name |
| 03 | What is missing? | Certificate, label, responsible person, registration, test report |
| 04 | Which regulations apply? | Regulation Graph on product attributes; empty match = UNCERTAIN |
| 05 | Which platform rules apply? | Platform Graph on top of national law |
| 06 | How sure? | Confidence + evidence quality + last verified + authority |
| 07 | What file / test / cert? | Actions from unmet requirements |
| 08 | After a law change, which SKUs? | Diff → affected SKUs, not a news blast |
| 09 | What should the factory do next? | Remediation plan + re-check |
| 10 | What is verified vs expert? | Verification pyramid; LLM cannot assert alone |

Coverage rule that never expires: **only claim encoded, sourced requirements**. Unknown category cannot PASS.

---

## Now vs later (same contract, different scale)

| Capability | Expected (always) | Now (MVP) | Later (outlook) |
|---|---|---|---|
| Catalog in | Any merchant catalog | CSV upload + 4-SKU demo | ERP / PIM / design-partner CSV |
| Product twin | Attributes, not names | Category, origin, certs, battery, radio, mains, ingredients | Richer HS, packaging, images only after human confirm |
| Markets | Many destinations | EU, US, Indonesia | More jurisdictions, still sourced subsets |
| Platforms | One portfolio, every marketplace | Alibaba.com + Amazon | TikTok Shop, Temu, SHEIN, Shopify |
| Regulation graph | Official URL + article + hash | Curated seed (electronics + cosmetics contrast) | Fetch official URL, re-hash, thicken same vertical first |
| Matrix | Every SKU × market × platform | 24 cells | Thousands of SKUs (illustrative, not a current benchmark) |
| Change impact | Affected SKUs only | One encoded event: ID luminaire SNI → LED only | Production monitoring / scheduled diffs |
| Re-check | Attach evidence, recompute | Extra certs on a SKU | Expert / lab handoff then re-check |
| API | Embed in ops systems | Demo `/api/portfolio\|catalog\|recheck\|changes` | Billed SKU-check / country pack / monitor events |
| Expert layer | Escalation when pyramid forbids assert | Label `EXPERT_REVIEW_REQUIRED` | Marketplace of labs, RP, counsel |
| Commercial | Factory pays to see which SKUs to move | Live product is free demo | Free / Pro / Enterprise — **hypothesis, not a rate card** |

---

## Later outlook (phased)

None of this is shipped.

### Near

- More official sources and retrieve-time hashes in the **same** electronics + EU/US/ID slice
- Design-partner catalog (redacted)
- Expert-escalation UX (who to call, not a fake legal opinion)
- GOAI semifinal pack: video, runbook, pitch (process, not engine scale)

### Mid

- Marketplace adapters: TikTok Shop, Temu, SHEIN, Shopify
- Production regulatory diff (beyond the single demo object)
- ERP / PIM connectors
- Public API with auth and audit log

### Far

- Certification partner routing (SGS / TÜV / Intertek / UL as **execution**, not competitors)
- Alibaba Wukong Skill **if** a usable official API exists — no scraping seller backends
- Live billing: Free 1×1, Pro catalog+monitor, Enterprise API

### Explicitly not planned

- Fake 200-country coverage
- Legal chatbot / law search as the product
- Silent PASS
- Treating PASS as customs or marketplace clearance
- Reverse-engineering Alibaba/Amazon seller consoles

---

## Illustrative scale (not a benchmark)

```
3,000 SKUs  →  47 affected  →  12 HIGH / 21 MEDIUM / 14 LOW
```

Today the demo is **4 SKUs**. The numbers above show the **shape** of portfolio impact, not a measured production run.
