# Existing Asset Audit

Scanned 2026-08-16. GitHub user `WilliamK112` (112 repos) plus local `~/Projects`, `~/Desktop`, `~/Documents`. **Do not overwrite Akang or Pruva.**

## GitHub (priority list)

| Project | Reusable Data | Reusable Code | Relevant Infra | Product Fit | Rewrite Cost | Use? |
|---|---|---|---|---|---|---|
| akang-health-industry-os | Country research, Indonesia/US legal clauses, evidence hashes, source manifests, BPOM-adjacent pharma data, World Bank country stats | Evidence UI patterns, data-pipeline contracts, legal excerpt+hash style | Next.js + D1/Drizzle research DB | High for **method** (evidence-first, versioned law). Low for **content** (pharma industry OS ≠ consumer electronics export) | High if forked whole product | **Reuse method + citation style only.** Do not stuff this product into Akang. Pharma legal files stay in Akang. |
| pruva | None for product law | Verification pyramid idea, skill packing, GOAI submission hygiene, settlement/attestation mindset | Python packages, benchmarks folder layout | High for **verification philosophy** | Low (re-implemented, not copied as dependency) | **Yes, conceptually.** This repo re-implements a pyramid; does not import Pruva. Pruva is Agent Infra track — keep separate. |
| multi-agent-openclaw | None | Multi-agent orchestration sketches | Local OpenClaw workspace | Medium as orchestration reference | Medium | No runtime dependency. Pattern only. |
| application-os | Unknown / empty description | Unknown | — | Low from public metadata | n/a | Not used in MVP |
| auto-apply-worker | None | Worker/job patterns | TS worker | Low | High | No |
| TableUs | None | Next UI | Hackathon UI | Low | — | No |
| globalai-ad-studio | None | Dashboard pipeline | — | Low | — | No |
| mcp-security-scanner | None | MCP permission scanning | TS | Medium for later tool-permission audit | Medium | Later, not MVP |
| secure-ai-tooling | CoSAI risk map | Risk language | Python | Medium for safety writeup | Low | Cite conceptually in LEGAL doc |
| skills | Skill-pack format | TS skills repo | — | Medium | Low | We use YAML skills in this repo instead |
| Lians / palinode | None | Memory/MCP | — | Low for compliance engine | — | No |
| Fdesign | Ecommerce image production | Image pipeline | — | Later image clues | Medium | Not MVP |
| alphafold-sovereign-mcp | Biomedical graph | MCP composition | — | Low | — | No |
| kinaxis-mcp-server | Supply-chain MCP (Kinaxis) | MCP adapter | — | Future ERP | High | No |
| Madhacks TrustRent | Evidence packs for disputes | Evidence UX | — | Medium metaphor | — | Pattern only |
| agentteams-guangzhou-lab (local) | Almost empty (`hello_world.py`, opspilot demo) | Alibaba AgentTeams experiment | — | Strategic (Wukong/AgentTeams) | — | Do not couple runtime. See ALIBABA_STRATEGIC_FIT.md |
| openclaw | Generic agent runtime | Tools/browser | — | Optional tool adapter later | High | Not required for matching |

## Local machine

| Path | Finding | Use? |
|---|---|---|
| ~/Projects/akang-health-industry-os | Local clone is **thin** vs GitHub (GitHub has `data/legal`, `data-pipeline`, `research`). Local should not be treated as full corpus. | Read GitHub method; do not copy private company financials |
| ~/Desktop/阿康实习/akang-health-industry-os | Internship copy | Do not overwrite |
| ~/Projects/pruva | Full GOAI Agent Infra project, already has submission pack dated today | Keep separate track |
| ~/Downloads/GOAI | **Pruva** prelim zip and form text — different product | Do not reuse Pruva form answers blindly |
| ~/Projects/agentteams-guangzhou-lab | Tiny lab | Strategy only |
| ~/Documents/New project/openclaw | OpenClaw checkout | No |

## Explicit non-use

- No Akang company financials, partner lists, or private pharma dossiers in this repo.
- No overwrite of existing repos.
- Healthcare market-access research (US/Indonesia drug distribution) is **analogous**, not portable, to Bluetooth/LED/cosmetics.

## Akang D1 / legal corpus (2026-08-16 follow-up)

See `research/AKANG_DATA_USE.md`. Inspected `akang-health-global-db` config and the Indonesia/US legal corpus. **Not imported.** Pharma SKUs, CDOB lists, and company financials stay in Akang. Method (source + hash + excerpt) was already reused.

## What we actually reused

1. Evidence object shape (authority, document, article, URL, retrieved_at, hash).
2. Verification ranking (official > guidance > platform > standard > LLM > human).
3. Honest coverage: Akang already refuses to fake missing years as zero; we refuse silent PASS.
4. Folder discipline from Pruva (research / submission / benchmarks / skills).
