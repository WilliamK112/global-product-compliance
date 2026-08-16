# Agent Architecture

Agents are few and mapped to the real job. They are not a swarm for judging theater.

```
CSV / Excel catalog
        │
        ▼
Product Intake Agent  →  Product Digital Twin (facts only)
        │
        ▼
Regulatory Research Agent  →  versioned Regulation Graph (official URLs)
        │
        ▼
Platform overlay  →  Platform Graph (seller policy)
        │
        ▼
Compliance Matching Agent  →  Product × Country × Platform × Requirement
        │
        ▼
Verification Agent  →  pyramid; LLM cannot assert alone
        │
        ▼
Action Agent  →  remediation + expert escalation + re-check
        │
        ▼
Change monitor  →  diff → affected SKUs (not “here is a new law”)
```

## Product Intake Agent

Reads sku, name, description, category, origin, materials, ingredients, claims, certifications, battery, wireless, targets. Image clues, if any, stay `UNCERTAIN` until a human confirms.

## Regulatory Research Agent

MVP uses a curated official-source seed (`data/regulations/seed.json`). It does not scrape random blogs into the graph. Future: fetch official URL, hash, re-index.

## Compliance Matching Agent

Deterministic predicates on the twin. No SKU-name hardcoding. Empty match ⇒ `UNCERTAIN`, never `PASS`.

## Verification Agent

`verification/pyramid.py`. Official regulation > authority guidance > platform rule > accredited standard > cross-source > LLM > human expert.

## Action Agent

`agents/action.py` binds actions to unmet findings and always offers re-check.

## Tools vs skills

Skills are typed procedures (YAML). Tools are adapters (filesystem, HTTP GET of official URLs, CSV). MCP is optional; not required to compute the matrix.
