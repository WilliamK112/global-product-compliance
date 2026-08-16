# Market Gap Analysis

Retrieved 2026-08-16. Unverified numbers are marked **Not publicly disclosed**.

## Current workflow: “Can this SKU sell in Germany?”

Typical Chinese SME exporter / 跨境卖家 path observed across seller guides, lab marketing pages, and platform help (not a survey of N factories):

1. **外贸销售 / 运营** Google: “蓝牙音箱 CE 认证”, WeChat groups, 货代转发的 PDF.
2. **Alibaba.com / Amazon Seller Central** listing forms ask for certificates *after* the SKU exists. Platforms do not answer “which of my 3,000 SKUs break if GPSR changes.”
3. **检测机构报价** (SGS / TÜV / 本地实验室): 先问产品，再报指令（LVD/EMC/RED），再测。
4. **认证中介 / 代办**: 低价 CE 证书市场混乱；官方与行业媒体反复警告虚假报告导致扣关、下架。
5. **律师 / 合规咨询**: 用于合同、RP、召回，很少按 SKU 目录批处理。
6. **Excel**: 证书到期日、型号、国家，一人维护，法规一变全表失效。
7. **ERP/PIM**: 有 SKU 主数据，通常没有法规条款级映射。
8. **邮件 + 微信**: 向欧洲客户要“你要哪些证书”。

**Conclusion:** The bottleneck is not “finding that the EU has CE.” It is **SKU × destination × platform × current obligation**.

## Cost (public ranges; not a quote)

| Item | Public range | Source class | Notes |
|---|---|---|---|
| Simple electronics EMC/LVD CE path (China lab marketing) | about CNY 2,000–20,000+ | Lab/agency blogs 2025–2026 | Highly product-specific; **not a tariff** |
| Wireless RED | about CNY 3,000 to 100,000+ | Same | Module vs host, NB involvement |
| Mechanical / higher risk CE | tens of thousands CNY | Agency blogs | |
| GPSR EU Responsible Person service | **Not publicly disclosed** as a standard list price | Vendor landing pages | Amazon listing blocks are the forcing function |
| EU VAT compliance service | often cited USD 2,000–5,000 / marketplace / year | Marketplace expansion guides | Tax, not product safety |
| Enterprise RegASK / Enhesa | **Not publicly disclosed** (custom footprint pricing) | Enhesa pricing page; RegASK Azure listing | Fortune / life-science buyers |
| 欧税通 etc. seller tools | **Not publicly disclosed** in a SKU-engine rate card | Marketing | VAT/EPR heavy |
| Recall logistics example | €30,000–50,000 logistics for ~5,000 units **before** legal | GPSR practitioner blog, not official statistics | Directional only |
| Amazon listing suppression | Immediate GMV halt; FBA disposal fees | Amazon policy / seller reports | Account death > test fee |
| False CE / missing RP | Customs hold, Safety Gate, platform ban | EU/Amazon materials | |

**Enterprise annual compliance spend:** Not publicly disclosed for Chinese electronics SMEs as a reliable average. Do not invent a TAM from this.

**Wrong-compliance loss:** Platform suppression and recall dominate test-fee savings. False **PASS** is the product’s lethal error.

## Frequency

| Event | Typical cadence for a Guangdong electronics exporter | Confidence |
|---|---|---|
| New SKU | Weekly to monthly in active factories | Medium (industry pattern, not survey) |
| New country / marketplace | Quarterly to yearly | Medium |
| New platform (Temu/TikTok/Amazon) | Burst when opening a channel | Medium |
| Regulation change (GPSR, RED delegated acts, BPOM annex, FCC) | A few material hits per year per category | High for 2024–2026 public law calendar |
| Certificate / standard update | Every 1–3 years per family | Medium |
| Label change | With each dest. language / RP / ingredient annex | Medium |
| Recall / Safety Gate / CPSC | Rare per SKU, existential when it hits | High |

## Buyer ≠ user ≠ decision maker

| Role | User? | Buyer? | Decision maker? |
|---|---|---|---|
| 外贸专员 / Export ops | Primary user | No | No |
| 品质 / Compliance / 认证工程师 | Power user | Influencer | Sometimes |
| 产品经理 | Occasional | No | SKU freeze |
| 法务 | Escalation | Influencer | High-risk only |
| Regulatory Affairs (bigger firms) | User | Influencer | Category rules |
| 跨境店长 | User for platform overlay | Sometimes | Listing go/no-go |
| 老板 / GM / CEO of SME | Dashboard | **Yes (payer)** | **Yes** |
| 工厂 / Brand owner | Data owner | Yes if branded | Yes |
| Amazon/Alibaba themselves | Distribution partner | Possible API buyer later | Ecosystem |

**ICP (phase 1):** 中国广东中小型制造商 + 其外贸/品质负责人；付钱的是老板；每天点矩阵的是外贸或认证岗。

## Whitespace (honest)

| Layer | Who already plays | Gap |
|---|---|---|
| Law search | 规海星图, 全球法规网, national gazettes | Not SKU-aware |
| Regulatory intelligence enterprise | RegASK, Enhesa, Cortellis/IQVIA (life science) | Price, language, not China factory UX, not Alibaba+Amazon overlay |
| Tax/EPR seller ops | 欧税通, 跨境财税 SaaS | Not RED/BPOM/FCC evidence graph |
| Single platform | Amazon Product Compliance, Alibaba cert center, TikTok qualification | Stops at *their* listing |
| Labs | SGS, TÜV, Intertek, BV, UL | Execute tests; do not watch 3,000 SKUs against a diff |
| Legal content | InsightLex, law firms, 哪吒出海法律通 (**public SKU engine not verified**) | Advice / contracts |

**Classification of the core job (Product × Country × Platform × Regulation → Action):**

**Novel combination** of existing pieces. **Not** “nobody has regulations.” **Not** “RegASK does not exist.”

**Already solved:** enterprise regulatory monitoring (if you can pay and operate in English).  
**Partially solved:** in-platform listing compliance.  
**Emerging:** AI label review (RegASK 2026), AI seller tax guides (欧税通).  
**Open problem for Chinese SME exporters:** cheap, evidence-bound, **catalog-level** impact + cross-platform remediation.

## Platforms in scope (what they solve vs leave)

See also ALIBABA_STRATEGIC_FIT.md. Short:

- **Alibaba.com:** verification badges, cert upload, Trade Assurance. Leaves destination law and SKU impact to the merchant.
- **AliExpress / 1688 / Taobao:** platform governance + 悟空经营 Skill. Not a global product-access graph.
- **Amazon:** strongest in-platform compliance ops; seller still owns destination law; no Alibaba/TikTok view.
- **TikTok Shop / SHEIN / Temu:** document gates and restricted lists; seller owns underlying regulation.
- **Shopify:** infrastructure, almost no product-safety brain.
- **Walmart / Lazada / Shopee:** marketplace policies, not a portable SKU passport.
