# Competitor Matrix

Evaluated 2026-08-16 against **Product × Country × Platform × Regulation → SKU impact → Action**.

Do **not** claim we invented regulatory AI.

| Product | Country | Regulation DB | SKU mapping | Change monitoring | Country coverage | Platform coverage | Action workflow | API | Pricing | Target customer | Verdict |
|---|---|---|---|---|---|---|---|---|---|---|---|
| RegASK | SG/US | Yes, curated + experts | Label/product/market impact (enterprise) | Yes, near real-time | 160+ claimed | Not first-class Amazon+Alibaba+TikTok matrix | Yes, workflows + experts | Yes (Azure/A2A claimed) | Custom / **Not publicly disclosed** | Life science + consumer enterprise | **Partially solved** at enterprise |
| Enhesa Product Intelligence | BE/global | Yes, **400+** jurisdictions (official FAQ, 2026-08-16) | Substance/product stewardship | Yes | Very wide | No marketplace graph | Stewardship, SDS | Enterprise | Custom | Fortune / product stewardship | **Partially solved** (chemicals/EHS) |
| IQVIA / Clarivate Cortellis | US/UK | Life-science | Drug/device RA | Yes | Wide (pharma) | No | RA workflows | Enterprise | **Not publicly disclosed** | Pharma RA | Different industry |
| 医药魔方 / GBI | CN | China+global pharma intel | Pipeline/drug | News | Pharma | No | Research | Vendor | **Not publicly disclosed** | Pharma | Different industry |
| 哪吒出海法律通 | CN? | Unclear | **Not verified** | Unknown | Unknown | Unknown | Unknown | Unknown | **Not publicly disclosed** | Unclear | **Insufficient public evidence** of SKU engine |
| InsightLex 明鉴智律 | CN | Legal/compliance frameworks | Contracts, overseas audit, certifications | Unclear | 20+ frameworks claimed | No | Expert+AI | Unclear | **Not publicly disclosed** | Enterprise legal | Legal ops, not catalog access |
| 商务部全球法规网 | CN gov | Official law retrieval | No | Publication | Broad texts | No | None | Unknown | Free/gov | Exporters (search) | Law search |
| 规海星图 | CN (2025-12) | Structured overseas law query | No SKU catalog | Query/risk Q&A | Silk Road ecommerce framing | No | Lawyer modules | Claimed APIs | **Not publicly disclosed** | Outbound firms | Law search + legal services |
| 欧税通 | CN | Tax/VAT/EPR + some product-link guides | Product link → tax/IP/cert checklist (marketing) | Platform tax risk | EU-heavy | Amazon/eBay/AliExpress tax APIs claimed | Tax filing | Yes (tax) | **Not publicly disclosed** | Cross-border sellers | **Emerging** adjacent; tax-first |
| Amazon Product Compliance | US | Policy + dest. law pointers | ASIN-level on Amazon | Policy updates | Amazon stores | Amazon only | Suppress, RP fields, SPN | Seller APIs limited | Included in selling | Amazon sellers | **Already solved** *inside Amazon* |
| Alibaba.com cert/compliance | CN | Platform rules + seller blogs | Listing/cert center | Platform notices | Buyer destinations | Alibaba only | Upload certs | Merchant APIs not openly usable for this | Platform | Alibaba merchants | **Partially** listing, not portfolio impact |
| TikTok Shop qualification | CN/global | Platform restricted + GPSR fields | Listing | Policy | Shop markets | TikTok only | Docs or removal | No public SKU API | Platform | TikTok sellers | Single platform |
| SHEIN / Temu supplier portals | CN | Supplier manuals | PO/listing | Portal | Their markets | Their platforms | Chargebacks/removal | Closed | Platform | Suppliers | Closed gardens |
| Shopify | CA | None native | None | None | n/a | Shopify | Apps ecosystem | Admin API | App store | DTC brands | Hole for apps |
| SGS / TÜV / Intertek / BV / UL | Global | Standards knowledge | Per-sample | Standard updates | Lab network | Indirect (Amazon-accepted labs) | Test → certificate | Portal | Per SKU/test **quoted** | Manufacturers | Execution, not monitoring graph |
| Customs brokers | Global | HS/tariff | Shipment | Duty changes | Trade lanes | No | Brokerage | Some EDI | Per entry | Importers | Trade, not product safety |
| CanSell (this) | CN origin | **Credible subset only** (EU/US/ID × electronics+cosmetics) | Yes, catalog CSV | Versioned diff → affected SKUs | 3 jurisdictions MVP | Alibaba.com + Amazon MVP | Remediation + re-check | REST | Free/Pro/Ent designed; **no live prices** | CN SME manufacturers | **Novel combination**, not category creation |

## Headline

**Already solved:** paying enterprises can buy RegASK/Enhesa; Amazon sellers can clear Amazon.

**Open problem:** a factory with 3,000 SKUs selling on Alibaba *and* Amazon *and* later TikTok still cannot see “18 SKUs hit by this change” with evidence.

That is the only honest uniqueness claim.
