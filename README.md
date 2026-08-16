# CanSell · 能卖哪

<p align="center">
  <img src="apps/web/public/brand/icon-fangxing.png" width="96" alt="放行" />
</p>

**Know where every product can sell — before regulations stop it.**

The market-access layer for global commerce.

上传目录。每个 SKU × 国家 × 平台 得到 `PASS` / `WARNING` / `BLOCKED` / `UNCERTAIN` / `EXPERT_REVIEW_REQUIRED`，带官方证据、缺失项和整改清单。法规变化只报告 **哪些 SKU 被打中**。

不是法律意见。不是法规搜索器。不是聊天机器人。也不是欧盟 ESPR 术语 Digital Product Passport。

- **产品（Website）：** https://cansell-kappa.vercel.app
- **路演页：** https://cansell-kappa.vercel.app/pitch.html
- **仓库：** https://github.com/WilliamK112/global-product-compliance
- **赛道：** GOAI 2026 无界应用 / Boundless Agents / 赛题五 AI+工业制造

---

## 00 论旨

中国出口真正缺的不是法条，是「这部法打中我哪几个 SKU」。

今天出口商不是没有法规信息。法规和平台规则非常多，但企业不知道这些规则具体影响自己哪些 SKU。因此核心不是 `LAW → SEARCH`，而是：

```
LAW × PRODUCT × MARKET × PLATFORM → IMPACT → ACTION
```

第一用户：广东中小制造商的外贸/认证岗。付钱的是老板。  
第一垂直：消费电子（蓝牙音箱 + TWS + LED）。化妆品精华液只作对照 SKU，不是第二垂直承诺。  
第一市场：中国产地 → EU / US / 印度尼西亚。  
第一平台：Alibaba.com + Amazon。CSV 是通用入口。Alibaba 是理想第一生态，不是唯一客户。

## 01 引擎必须回答的十问

评审请用这十问压产品，而不是看功能清单。

| # | 问题 | 产品怎么答 |
|---|---|---|
| 01 | 这个 SKU 能不能进入目标国家？ | Market Access State：PASS / WARNING / BLOCKED / UNCERTAIN / EXPERT_REVIEW_REQUIRED。不是 Yes/No。 |
| 02 | 为什么？ | Why 绑定适用条款，不绑定 SKU 名字。 |
| 03 | 缺什么？ | Missing item：证书、标签、责任人、注册号、测试报告。 |
| 04 | 哪些法规适用？ | Regulation Graph 按产品属性匹配。空匹配 = UNCERTAIN，禁止沉默 PASS。 |
| 05 | 哪些平台规则适用？ | Platform Graph 叠在国家法之上。Alibaba.com 与 Amazon 分开评估。 |
| 06 | 风险等级是多少？ | 状态 + confidence + evidence quality + last verified + source authority。 |
| 07 | 需要什么认证 / 文件 / 标签 / 测试？ | Required actions 来自未满足 requirement，不是聊天建议。 |
| 08 | 法规变化后哪些 SKU 受影响？ | Diff → 受影响品类 → 受影响 SKU。不说「出了一部新法」。 |
| 09 | 下一步企业应该做什么？ | Remediation plan + 补证后再评估。 |
| 10 | 哪些结论已验证，哪些要专家复核？ | Verification pyramid。LLM 在最下层，不能单独主张。 |

## 02 今天工厂怎么查「能不能卖去德国」

1. 外贸 / 运营 Google「蓝牙音箱 CE」，微信群和货代 PDF。
2. Alibaba.com / Amazon 上架表单在 SKU 已经存在之后才要证书，平台不回答「GPSR 一变我哪 3000 个 SKU 会断」。
3. 检测机构（SGS / TÜV / 本地实验室）按型号报价、按指令测试，不监控目录。
4. 认证中介市场混乱；虚假 CE 导致扣关、下架。
5. 律师用于合同、欧盟责任人、召回，很少按 SKU 批处理。
6. Excel 记到期日。法规一变，全表失效。
7. ERP / PIM 有主数据，通常没有条款级映射。
8. 邮件和微信向欧洲客户要「你要哪些证书」。

瓶颈不是「知道欧盟有 CE」，而是 **SKU × 目的国 × 平台 × 现行义务**。

### 谁用、谁买、谁拍板

| 角色 | 用户 | 买家 | 决策 |
|---|---|---|---|
| 外贸专员 | 主用户 | 否 | 否 |
| 品质 / 认证工程师 | 重度用户 | 影响 | 有时 |
| 老板 / GM | 看板 | **付钱** | **是** |
| 品牌方 / 工厂 | 数据所有者 | 是 | 是 |

### 公开成本区间（不是报价单）

| 项目 | 区间 | 备注 |
|---|---|---|
| 电子 EMC/LVD CE 路径 | 约 ¥2,000–20,000+ | 实验室营销价，不是官价 |
| 无线 RED | 约 ¥3,000–100,000+ | 模组 vs 整机、公告机构 |
| GPSR 欧盟责任人 | 未公开标准价 | Amazon 上架阻断是强制力 |
| RegASK / Enhesa | 企业定制，未公开 | 生命科学 / 财富 500 |
| 一次召回物流示例 | €30,000–50,000 / 5,000 件 | 尚未含法律成本 |
| Amazon 下架 | GMV 立即归零 | 账户死亡 > 测试费 |

## 03 缺口

不是「我们发明了监管 AI」。空白是：**中国工厂目录 × 跨平台 × SKU 影响 × 整改闭环**。

| 选手 | 判定 | 留下的缺口 |
|---|---|---|
| RegASK / Enhesa | 企业级部分已解决 | 价格、语言、不是中国工厂目录，不是 Alibaba+Amazon 矩阵 |
| Amazon Product Compliance | 站内已解决 | 只覆盖 Amazon |
| Alibaba 认证中心 / 悟空 | 上架卫生部分解决 | 教育卖家看 CSDDD/ESPR，不做 SKU 级目的国影响 |
| 规海星图 / 全球法规网 | 法规检索 | LAW → SEARCH，不是 LAW × PRODUCT |
| 欧税通 | 税务相邻新兴 | VAT/EPR，不是 RED/BPOM/FCC 证据图 |
| SGS / TÜV / Intertek | 执行层已解决 | 一次测一个型号，不看 3000 SKU 的 diff |
| CanSell | 新组合，不是新品类 | 可信子集：电子 + 一条化妆品对照 × EU/US/ID × 两平台 |

Already solved：买得起 RegASK/Enhesa 的企业；只做 Amazon 的卖家。  
Open problem：同时在 Alibaba 和 Amazon 卖 3000 个 SKU 的工厂，仍然看不到「这次变更打中 18 个 SKU」并带证据。

## 04 四图

缺任何一张图，系统就会退化成搜索。

**A. Product Graph**

```
SKU
├── Category / HS candidate
├── Materials / Ingredients / Claims
├── Manufacturer / Origin
├── Certifications / Lab reports
├── Labels / Packaging
├── Battery / Wireless
└── Evidence
```

**B. Regulation Graph**

```
Country → Authority → Regulation → Article → Requirement
jurisdiction · document · article · effective_date
status · supersedes · source_url · source_hash
language · product_scope · evidence
```

**C. Market Graph**

```
Country
├── Import / Certification
├── Tariff / Tax
├── Restrictions / Label
├── Testing
├── Local representative
└── Registration
```

**D. Platform Graph**

```
Amazon · Alibaba.com · TikTok Shop · Temu · SHEIN · Shopify
        ↓
Platform-specific Requirement
(MVP 只编码 Alibaba.com + Amazon)
```

## 05 核心计算

```
Product × Country × Platform × Regulation = Market Access State
```

| 状态 | 含义 |
|---|---|
| PASS | 适用且已编码的要求有证据。不是发货许可证。 |
| WARNING | 有缺口或平台叠加。自行承担发货风险。 |
| BLOCKED | 硬义务未满足：RED、FCC、DJID、BPOM、CPNP 等。 |
| UNCERTAIN | 无编码规则或属性缺失。拒绝沉默 PASS。 |
| EXPERT_REVIEW_REQUIRED | 金字塔禁止自动主张。 |

匹配按产品属性，不按 SKU 名字。未知品类不能 PASS。

## 06 证据优先

每个关键判断绑定官方来源。不允许 “LLM says so.”

证据对象至少包含：authority、document、article、source_url、retrieved_at、hash、excerpt。

验证金字塔（上 → 下）：

1. Official regulation — EUR-Lex / eCFR / 主管机关门户。可主张。
2. Official authority guidance — FDA / CPSC / BPOM / DJID。
3. Platform rule — Amazon / Alibaba 卖家政策。叠在国家法之上。
4. Accredited standard — SNI / IEC。证据质量中等。
5. Cross-source verification — 多源交叉。仍弱于官方法。
6. LLM interpretation — 最下层。不能单独作为证据。
7. Human expert — UNCERTAIN → EXPERT_REVIEW_REQUIRED。

## 07 智能体与 Skill

不为了评委把 Agent 拆成蜂群。

| Agent | 职责 |
|---|---|
| Product Intake | 读 CSV，形成 Product Digital Twin。图片线索在人工确认前不得当事实。 |
| Regulatory Research | 只写入官方 URL。MVP 用 curated seed。 |
| Compliance Matching | 对孪生做确定性谓词。禁止按 SKU 名写死。空匹配 = UNCERTAIN。 |
| Verification | 金字塔判定能否主张。LLM 不能单独 assert。 |
| Action | 整改清单、专家升级、补证后再评估。 |

Skills（带 schema 的规程，≠ Tool）：`classify_product` · `extract_hs_code_candidate` · `parse_regulation` · `extract_requirement` · `diff_regulation` · `map_requirement_to_product` · `validate_evidence` · `assess_market_access` · `generate_remediation_plan` · `monitor_regulatory_change`

MCP 可选，不是算出矩阵的必要条件。Python 引擎是 pytest 的源；Vercel 上跑 TypeScript 端口。

## 08 产品怎么用

打开 https://cansell-kappa.vercel.app

1. 看四个广东 SKU 的放行矩阵（EU / US / ID × Alibaba.com / Amazon）。
2. 点印章：Why、条款、官方 URL、哈希、缺失项、整改。
3. **下载模板 / 上传 CSV**，或点 **改首行 SKU 名再评估**（状态应不变）。
4. 点 **模拟法规变更**：印尼灯具 SNI 版本事件。4 个 SKU 里只有 LED 被打中，ID PASS → WARNING。
5. 给 `BT-SPEAKER-01` 附上 `CE-RED,EU-RP,FCC,DJID`，点 **补证后再评估**。状态由引擎重算，不能写死。

操作说明见 [docs/RUNBOOK.md](docs/RUNBOOK.md)。

## 09 法规变更引擎

```
Regulation v1 → v2 → Diff → Changed requirement
→ Affected category → Affected SKU → Affected market → Affected platform
→ Merchant alert
```

不要告诉工厂「出了一部新法」。要告诉工厂：4 个 SKU 里哪 1 个被打中。

## 10 整改闭环

BLOCKED 必须带 Reason 和 Action。动作来自未满足 requirement。做完再跑一遍。专家升级（律师、顾问、实验室、发证机构）也是商业模式；产品不冒充他们。

## 11 责任

这不是律师事务所，不是公告机构，也不是海关裁定。

| 标签 | 含义 |
|---|---|
| Verified regulatory source | 官方 URL + 条款 + 检索日 + 哈希 |
| Automated interpretation | 产品属性对编码 scope 的谓词匹配 |
| Compliance recommendation | 建议的测试、文件、责任人 |
| Expert review required | 证据不足或范围含糊 |

假 PASS 比过度预警更致命。

## 12 商业模式

一次 Amazon 下架或一次扣柜，超过 Pro 订阅。

| 档位 | 内容 |
|---|---|
| Free | 1 SKU × 1 市场。获客。水印：不是法律意见。 |
| Pro | 100 SKU × 5 市场 × 变更监控。定价待设计伙伴，不公布假人民币数。 |
| Enterprise | 10k SKU × 多市场 × API × PIM/ERP。 |
| API | 按 SKU check、国家包、监控事件计费。 |
| Expert marketplace | 需要 CE-RED / BPOM / EU-RP 时推荐实验室与顾问。 |

Alibaba 已解决信任标和部分证书上传；仍把目的国法的目录级影响留给商家。商户 API 不开放就走 CSV，不逆向卖家后台。

## 13 可信子集与来源

4 个 SKU × 3 个市场 × 2 个平台，每一条都有来源。强过假的 200 国。

| id | authority | role | url |
|---|---|---|---|
| eu-red-2014-53 | EU | 无线 CE / RED | https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32014L0053 |
| eu-lvd-2014-35 | EU | 市电安全 LVD | https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32014L0035 |
| eu-emc-2014-30 | EU | EMC | https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32014L0030 |
| eu-gpsr-2023-988 | EU | 欧盟责任人 GPSR | https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32023R0988 |
| eu-cosmetics-1223-2009 | EU | 化妆品 CPNP | https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32009R1223 |
| us-fcc-part15 | FCC | 有意辐射体 | https://www.ecfr.gov/current/title-47/chapter-I/subchapter-A/part-15 |
| us-cpsc | CPSC | 消费品安全 | https://www.cpsc.gov/Regulations-Laws--Standards/Statutes |
| us-fda-mocra | FDA | MoCRA | https://www.fda.gov/cosmetics/cosmetics-laws-regulations/modernization-cosmetics-regulation-act-2022-mocra |
| id-notifkos | BPOM | 化妆品 NIE | https://notifkos.pom.go.id/ |
| id-djid | DJID | 无线电认证 | https://sertifikasi.postel.go.id/ |
| id-bsn | BSN | 灯具 SNI（标准级证据） | https://bsn.go.id/ |
| amazon-eu | Amazon | 平台 EU | Amazon Product Compliance EU PDF |
| amazon-us | Amazon | 平台 US | Amazon Product Compliance US PDF |
| alibaba-2026 | Alibaba.com | 平台规则 | Alibaba.com 2026 export compliance guide |

未计划假的 200 国覆盖。法规摘录仅用于识别，全文以官方 URL 为准。

---

## 本地运行（Python 引擎 / pytest）

```bash
python3.11 -m venv .venv
source .venv/bin/activate
pip install pytest pydantic fastapi python-multipart uvicorn
python3 scripts/sync_web_data.py
pytest -q
uvicorn apps.api.main:app --port 8000
```

打开 http://127.0.0.1:8000

前端：`cd apps/web && npm install && npm run dev`

## License

MIT。
