# Evaluation

**Status: Evaluation planned for encoded-subset unit tests; no LLM bake-off has been run.**

Shipped now:

- Deterministic pytest suite in `tests/test_engine.py` (false-safe, attribute-not-name, change impact).

Not run (do not invent scores):

| Metric | Plan |
|---|---|
| Requirement retrieval accuracy | Gold set of 20 cases in `benchmarks/cases.json` |
| Applicable rule precision | Same |
| **False Safe Rate** | Primary KPI; any PASS without required token is a fail |
| False Block Rate | Secondary |
| Evidence coverage | % findings with official URL |
| SKU impact detection | Change fixtures |
| Regulation diff accuracy | Pairwise versions |
| Latency | Matrix for 3×3×2 |

Baselines to compare later: generic LLM vs RAG-only vs this engine. **No numbers until measured.**
