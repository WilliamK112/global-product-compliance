export const TOC = [
  { id: "thesis", no: "00", title: "论旨 Thesis" },
  { id: "questions", no: "01", title: "十问 Ten questions" },
  { id: "workflow", no: "02", title: "现状 Workflow" },
  { id: "competitors", no: "03", title: "缺口 Whitespace" },
  { id: "graphs", no: "04", title: "四图 Four graphs" },
  { id: "formula", no: "05", title: "计算 Formula" },
  { id: "evidence", no: "06", title: "证据 Evidence" },
  { id: "agents", no: "07", title: "智能体 Agents" },
  { id: "ledger", no: "08", title: "放行台账 Ledger" },
  { id: "twins", no: "09", title: "数字孪生 Twin" },
  { id: "change", no: "10", title: "法规变更 Change" },
  { id: "actions", no: "11", title: "整改闭环 Action" },
  { id: "safety", no: "12", title: "责任 Safety" },
  { id: "business", no: "13", title: "商业模式 Business" },
  { id: "coverage", no: "14", title: "可信子集 Coverage" },
] as const;

export const QUESTIONS = [
  { q: "这个 SKU 能不能进入目标国家？", a: "Market Access State：PASS / WARNING / BLOCKED / UNCERTAIN / EXPERT_REVIEW_REQUIRED。不是 Yes/No。" },
  { q: "为什么？", a: "Why 绑定适用条款，不绑定 SKU 名字。" },
  { q: "缺什么？", a: "Missing item：证书、标签、责任人、注册号、测试报告。" },
  { q: "哪些法规适用？", a: "Regulation Graph 按产品属性匹配，空匹配 = UNCERTAIN，禁止沉默 PASS。" },
  { q: "哪些平台规则适用？", a: "Platform Graph 叠在国家法之上。Alibaba.com 与 Amazon 分开评估。" },
  { q: "风险等级是多少？", a: "状态 + confidence + evidence quality + last verified + source authority。" },
  { q: "需要什么认证 / 文件 / 标签 / 测试？", a: "Required actions 来自未满足 requirement，不是聊天建议。" },
  { q: "法规变化后哪些 SKU 受影响？", a: "Diff → 受影响品类 → 受影响 SKU。不说「出了一部新法」。" },
  { q: "下一步企业应该做什么？", a: "Remediation plan + 补证后再评估。Intelligence → Action。" },
  { q: "哪些结论已验证，哪些要专家复核？", a: "Verification pyramid。LLM 在最下层，不能单独主张。" },
];

export const WORKFLOW = [
  "外贸 / 运营 Google「蓝牙音箱 CE」，微信群和货代 PDF。",
  "Alibaba.com / Amazon 上架表单在 SKU 已经存在之后才要证书，平台不回答「GPSR 一变我哪 3000 个 SKU 会断」。",
  "检测机构（SGS / TÜV / 本地实验室）按型号报价、按指令测试，不监控目录。",
  "认证中介市场混乱；虚假 CE 导致扣关、下架。",
  "律师用于合同、欧盟责任人、召回，很少按 SKU 批处理。",
  "Excel 记到期日。法规一变，全表失效。",
  "ERP / PIM 有主数据，通常没有条款级映射。",
  "邮件和微信向欧洲客户要「你要哪些证书」。",
];

export const COSTS = [
  { item: "电子 EMC/LVD CE 路径", value: "约 ¥2,000–20,000+", note: "实验室营销价，不是官价" },
  { item: "无线 RED", value: "约 ¥3,000–100,000+", note: "模组 vs 整机、公告机构" },
  { item: "GPSR 欧盟责任人", value: "未公开标准价", note: "Amazon 上架阻断是强制力" },
  { item: "RegASK / Enhesa", value: "企业定制，未公开", note: "生命科学 / 财富 500" },
  { item: "一次召回物流示例", value: "€30,000–50,000 / 5,000 件", note: "尚未含法律成本" },
  { item: "Amazon 下架", value: "GMV 立即归零", note: "账户死亡 > 测试费" },
];

export const ROLES = [
  { role: "外贸专员", user: "主用户", buyer: "否", decide: "否" },
  { role: "品质 / 认证工程师", user: "重度用户", buyer: "影响", decide: "有时" },
  { role: "老板 / GM", user: "看板", buyer: "付钱", decide: "是" },
  { role: "品牌方 / 工厂", user: "数据所有者", buyer: "是", decide: "是" },
];

export const COMPETITORS = [
  { name: "RegASK / Enhesa", verdict: "企业级部分已解决", gap: "价格、语言、不是中国工厂目录，不是 Alibaba+Amazon 矩阵" },
  { name: "Amazon Product Compliance", verdict: "站内已解决", gap: "只覆盖 Amazon，不管 Alibaba / TikTok" },
  { name: "Alibaba 认证中心 / 悟空", verdict: "上架卫生部分解决", gap: "教育卖家看 CSDDD/ESPR，不做 SKU 级目的国影响" },
  { name: "规海星图 / 全球法规网", verdict: "法规检索", gap: "LAW → SEARCH，不是 LAW × PRODUCT" },
  { name: "欧税通", verdict: "税务相邻新兴", gap: "VAT/EPR，不是 RED/BPOM/FCC 证据图" },
  { name: "SGS / TÜV / Intertek", verdict: "执行层已解决", gap: "一次测一个型号，不看 3000 SKU 的 diff" },
  { name: "CanSell", verdict: "新组合，不是新品类", gap: "可信子集：电子 + 一条化妆品对照 × EU/US/ID × 两平台" },
];

export const TREES = {
  product: `SKU
├── Category / HS candidate
├── Materials / Ingredients / Claims
├── Manufacturer / Origin
├── Certifications / Lab reports
├── Labels / Packaging
├── Battery / Wireless
└── Evidence`,
  regulation: `Country
└── Authority
    └── Regulation
        └── Article
            └── Requirement
jurisdiction · document · article · effective_date
status · supersedes · source_url · source_hash
language · product_scope · evidence`,
  market: `Country
├── Import / Certification
├── Tariff / Tax
├── Restrictions / Label
├── Testing
├── Local representative
└── Registration`,
  platform: `Amazon · Alibaba.com
TikTok Shop · Temu · SHEIN · Shopify
        ↓
Platform-specific Requirement
(MVP 只编码 Alibaba.com + Amazon)`,
};

export const PYRAMID = [
  { level: "Official regulation", note: "EUR-Lex / eCFR / 主管机关门户。可主张。" },
  { level: "Official authority guidance", note: "FDA / CPSC / BPOM / DJID 指南。" },
  { level: "Platform rule", note: "Amazon / Alibaba 卖家政策。叠在国家法之上。" },
  { level: "Accredited standard", note: "SNI / IEC 等。证据质量中等。" },
  { level: "Cross-source verification", note: "多源交叉。仍弱于官方法。" },
  { level: "LLM interpretation", note: "最下层。不能单独作为证据。" },
  { level: "Human expert", note: "UNCERTAIN → EXPERT_REVIEW_REQUIRED。" },
];

export const AGENTS = [
  { name: "Product Intake", job: "读 CSV：SKU、描述、规格、认证、电池、无线。形成 Product Digital Twin。图片线索在人工确认前不得当事实。" },
  { name: "Regulatory Research", job: "只写入官方 URL。MVP 用 curated seed，不把随机博客写进图。" },
  { name: "Compliance Matching", job: "对孪生做确定性谓词。禁止按 SKU 名写死。空匹配 = UNCERTAIN。" },
  { name: "Verification", job: "金字塔判定能否主张。LLM 不能单独 assert。" },
  { name: "Action", job: "整改清单、专家升级、补证后再评估。" },
];

export const SKILLS = [
  "classify_product",
  "extract_hs_code_candidate",
  "parse_regulation",
  "extract_requirement",
  "diff_regulation",
  "map_requirement_to_product",
  "validate_evidence",
  "assess_market_access",
  "generate_remediation_plan",
  "monitor_regulatory_change",
];

export const STATUSES = [
  { id: "PASS", mean: "适用且已编码的要求有证据。不是发货许可证。" },
  { id: "WARNING", mean: "有缺口或平台叠加。自行承担发货风险。" },
  { id: "BLOCKED", mean: "硬义务未满足：RED、FCC、DJID、BPOM、CPNP 等。" },
  { id: "UNCERTAIN", mean: "无编码规则或属性缺失。拒绝沉默 PASS。" },
  { id: "EXPERT_REVIEW_REQUIRED", mean: "金字塔禁止自动主张。" },
];

export const SAFETY = [
  { label: "Verified regulatory source", mean: "官方 URL + 条款 + 检索日 + 哈希" },
  { label: "Automated interpretation", mean: "产品属性对编码 scope 的谓词匹配" },
  { label: "Compliance recommendation", mean: "建议的测试、文件、责任人" },
  { label: "Expert review required", mean: "证据不足或范围含糊" },
];

export const BUSINESS = [
  { tier: "Free", detail: "1 SKU × 1 市场。获客。水印：不是法律意见。" },
  { tier: "Pro", detail: "100 SKU × 5 市场 × 变更监控。广东电子出口商。定价待设计伙伴，不公布假人民币数。" },
  { tier: "Enterprise", detail: "10k SKU × 多市场 × API × PIM/ERP。SSO、审计日志。" },
  { tier: "API", detail: "按 SKU check、国家包、监控事件计费。" },
  { tier: "Expert marketplace", detail: "需要 CE-RED / BPOM / EU-RP 时推荐实验室与顾问。推荐分成，同时是责任缓冲。" },
];

export const SOURCES = [
  { id: "eu-red-2014-53", authority: "EU", url: "https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32014L0053", role: "无线 CE / RED" },
  { id: "eu-lvd-2014-35", authority: "EU", url: "https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32014L0035", role: "市电安全 LVD" },
  { id: "eu-emc-2014-30", authority: "EU", url: "https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32014L0030", role: "EMC" },
  { id: "eu-gpsr-2023-988", authority: "EU", url: "https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32023R0988", role: "欧盟责任人 GPSR" },
  { id: "eu-cosmetics-1223-2009", authority: "EU", url: "https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32009R1223", role: "化妆品 CPNP" },
  { id: "us-fcc-part15", authority: "FCC", url: "https://www.ecfr.gov/current/title-47/chapter-I/subchapter-A/part-15", role: "有意辐射体" },
  { id: "us-cpsc", authority: "CPSC", url: "https://www.cpsc.gov/Regulations-Laws--Standards/Statutes", role: "消费品安全" },
  { id: "us-fda-mocra", authority: "FDA", url: "https://www.fda.gov/cosmetics/cosmetics-laws-regulations/modernization-cosmetics-regulation-act-2022-mocra", role: "MoCRA" },
  { id: "id-notifkos", authority: "BPOM", url: "https://notifkos.pom.go.id/", role: "化妆品 NIE" },
  { id: "id-djid", authority: "DJID", url: "https://sertifikasi.postel.go.id/", role: "无线电认证" },
  { id: "id-bsn", authority: "BSN", url: "https://bsn.go.id/", role: "灯具 SNI（标准级证据）" },
  { id: "amazon-eu", authority: "Amazon", url: "https://m.media-amazon.com/images/G/28/AS/AGS/SU/CN_GS_Regulatory_Compliance_1.1_Product_Compliance_EU_EN.pdf", role: "平台 EU" },
  { id: "amazon-us", authority: "Amazon", url: "https://m.media-amazon.com/images/G/28/AS/AGS/SU/CN_GS_Regulatory_Compliance_1.1_Product_Compliance_US_EN.pdf", role: "平台 US" },
  { id: "alibaba-2026", authority: "Alibaba.com", url: "https://seller.alibaba.com/blogs/2026/global/b2b-ecommerce/alibaba-com-compliance-guide-2026-export-regulations", role: "平台规则" },
];
