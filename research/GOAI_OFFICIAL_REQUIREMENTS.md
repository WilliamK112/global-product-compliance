# GOAI Official Requirements

**Primary sources used**

- Official site: https://www.goaihz.com
- Boundless Agents track: https://www.goaihz.com/tracks?track=apps
- Registration announcement: https://www.goaihz.com/news/official-launch
- Terms: https://www.goaihz.com/terms

**Not used as primary:** third-party recap sites, except to locate the official URL.

**Track mapping:** Official GOAI 2026 has four tracks. There is **no separate “创业赛道” page**. Startup support is a **post-award resource** (“创业加速”). This project enters **无界应用 / Boundless Agents**, scenario **AI+工业制造** (export-side quality / market-access / supply-chain compliance for manufacturers). Adjacent to AI+金融 (rule matching) but manufacturing exporter workflow is the user.

Retrieved: 2026-08-16.

## Requirement → Our Evidence → Missing → Action

| Requirement | Official evidence | Our evidence | Missing | Action |
|---|---|---|---|---|
| Track: Boundless Agents | goaihz.com/tracks?track=apps | This repo | — | Submit under 无界应用 |
| Industry direction | Five listed: glasses / auto / finance / education / industrial manufacturing; or a real subdivision consistent with the track | Framed as AI+工业制造: 中国制造商出口商品准入 | Handbook PDF not downloadable without login (“下载参赛手册跳转手册下载入口”) | If handbook PDF is obtained from the portal, reconcile weights |
| Closed-loop task | User input → task understanding → orchestration → tools/KB → delivery → exception → verification | CSV intake → twin → retrieve encoded rules → match → evidence → matrix → remediation → re-check; change impact | Live official crawler not in MVP | Keep encoded official URLs; add monitor later |
| Not a chatbot | “不鼓励泛聊天机器人、单点问答、简单内容生成” | Engine is deterministic matching, not chat | — | Do not add a legal chatbot as the demo |
| Target user / pain / data / privacy / boundary | Core work requirements on track page | docs/LEGAL_AND_SAFETY.md, this file, MARKET_GAP_ANALYSIS.md | — | Keep disclaimer in UI |
| Preliminary deadline | 2026-08-16 23:59 CST | Dual-track today | — | Submit description + PPT + GitHub; demo optional but we ship runnable |
| Prelim materials | 作品简介、方案 PPT/PDF、可选原型或视频 | submission/ | Official form may need login | Fill portal with SUBMISSION_DESCRIPTION_* and PPT_OUTLINE |
| Semifinal | 8.25–9.3: updated plan, Demo, runbook, code | Roadmap | — | Harden demo + README |
| Final | 9.22 Hangzhou | — | — | Live matrix + change impact |
| Judging | 行业场景价值; Agent 闭环; 产品体验与 Demo; 工程可复现; 安全合规与开放复用 | README, tests, MIT license, safety doc | No recorded demo video yet | Screenshot + script; video if time |
| Open source | Encouraged, not “must disclose everything”; disclose license, third-party, models | MIT; no required LLM; data is cited official URLs | Full crawled corpus not published | Do not ship copyrighted full-text laws; ship metadata + quotes + URLs |
| Commercial models OK | Must disclose | Matching does not need a model | — | If a model is added, document it |
| Safety / IP | Team owns IP; no infringement; data compliance | Legal disclaimer; no scraped paywalled DBs | Handbook-specific safety rubric unknown | Conservative claims only |
| Agent requirement | Task understanding, orchestration, tools, knowledge, multi-turn, delivery | Five agents: intake, research (encoded sources), matching, verification, action | Multi-turn chat UI not the product | Keep agents behind the matrix |
| Commercial value | Real workflow, not concept | China exporter SKU × market | No paid customer yet | Honest: design partner path, not fake ARR |
| Tech | Runnable, reproducible | pytest + FastAPI + Next.js | Frontend may need `npm i` | Document two-terminal run |
| Awards | Track champion 500k RMB; grand 1M; 4–10 开源新锐 5k | — | — | Irrelevant to product honesty |

## Schedule (official)

| Stage | When (CST) |
|---|---|
| Register | from 2026-07-16 |
| Prelim submit | **2026-08-16 23:59** |
| Prelim results / Top 30 | 2026-08-24 |
| Semifinal submit | 2026-09-03 |
| Finalists Top 15 | 2026-09-10 |
| Final | 2026-09-22 |
| GOAI DAY | 2026-09-23 |

## Decision implication

Prelim **today**. Track A (submission pack) and Track B (real engine) must both exist. A regulations search website would fail the “not a chatbot / enter a real workflow” bar.
