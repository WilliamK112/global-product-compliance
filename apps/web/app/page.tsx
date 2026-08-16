"use client";

import { useEffect, useState } from "react";
import {
  AGENTS,
  BUSINESS,
  COMPETITORS,
  COSTS,
  PYRAMID,
  QUESTIONS,
  ROLES,
  SAFETY,
  SKILLS,
  SOURCES,
  STATUSES,
  TOC,
  TREES,
  WORKFLOW,
} from "@/lib/report";

type Evidence = {
  authority: string;
  document: string;
  article: string;
  source_url: string;
  excerpt: string;
  hash: string;
};

type Cell = {
  sku: string;
  country: string;
  platform: string;
  status: string;
  why: string;
  confidence: number;
  evidence_quality: string;
  last_verified: string;
  missing_items: string[];
  required_actions: string[];
  findings: Array<{
    requirement_id: string;
    title: string;
    status: string;
    evidence: Evidence[];
  }>;
};

type Product = {
  sku: string;
  name: string;
  description?: string;
  category: string;
  origin?: string;
  certifications: string[];
  labels?: string[];
  materials?: string[];
  ingredients?: string[];
  claims?: string[];
  has_battery?: boolean;
  battery_type?: string;
  has_wireless?: boolean;
  wireless_tech?: string[];
  mains_powered?: boolean;
  hs_code?: string;
  manufacturer?: string;
  target_countries?: string[];
  target_platforms?: string[];
};

type Portfolio = {
  products: Product[];
  matrix: Cell[];
  countries: string[];
  actions: Array<{ sku: string; country: string; platform: string; steps: Array<{ action: string }> }>;
};

type Docket =
  | { kind: "cell"; cell: Cell }
  | { kind: "recheck"; certifications: string[]; moved: string };

const LABEL: Record<string, string> = {
  PASS: "放行 PASS",
  WARNING: "待补 WARNING",
  BLOCKED: "受阻 BLOCKED",
  UNCERTAIN: "待定 UNCERTAIN",
  EXPERT_REVIEW_REQUIRED: "复核 EXPERT",
};

export default function Page() {
  const [data, setData] = useState<Portfolio | null>(null);
  const [change, setChange] = useState<{
    impact: {
      summary: string;
      affected_skus: string[];
      before: Record<string, string>;
      after: Record<string, string>;
    };
  } | null>(null);
  const [docket, setDocket] = useState<Docket | null>(null);
  const [sku, setSku] = useState("BT-SPEAKER-01");
  const [certs, setCerts] = useState("CE-RED,EU-RP,FCC,DJID");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState("");

  async function load() {
    const res = await fetch("/api/portfolio");
    if (!res.ok) throw new Error("portfolio failed");
    setData(await res.json());
  }

  useEffect(() => {
    load().catch((err) => setError(String(err.message || err)));
    fetch("/api/changes").then((res) => res.json()).then(setChange).catch(() => undefined);
  }, []);

  async function runChange() {
    setBusy("change");
    const res = await fetch("/api/changes");
    setChange(await res.json());
    setBusy("");
    document.getElementById("change")?.scrollIntoView({ behavior: "smooth" });
  }

  async function runRecheck() {
    setBusy("recheck");
    const res = await fetch("/api/recheck", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sku,
        extra_certifications: certs.split(/[,;]/).map((item) => item.trim()).filter(Boolean),
      }),
    });
    const payload = await res.json();
    setData(payload.portfolio);
    const moved = Object.entries(payload.moved || {})
      .map(([key, value]) => `${key}: ${(value as { before: string; after: string }).before} → ${(value as { before: string; after: string }).after}`)
      .join(" · ") || "no status change";
    setDocket({ kind: "recheck", certifications: payload.certifications, moved });
    setBusy("");
  }

  const tally: Record<string, number> = { PASS: 0, WARNING: 0, BLOCKED: 0, UNCERTAIN: 0 };
  data?.matrix.forEach((cell) => {
    tally[cell.status] = (tally[cell.status] || 0) + 1;
  });

  return (
    <div className="shell">
      <article className="doc">
        <div className="ribbon">D&amp;D REPORT</div>
        <header className="mast">
          <div className="brand">
            <div className="mark">放行</div>
            <div>
              <div className="en">Design and development report · Market access passport</div>
              <h1>能卖哪 · CanSell</h1>
              <p className="tagline">Know where every product can sell — before regulations stop it. 不是法规搜索器。是商品 × 国家 × 平台 × 法规的市场准入层。</p>
            </div>
          </div>
          <div className="meta">
            DOC NO. <b>CN-EX-2026-0816</b><br />
            TYPE <b>D&amp;D REPORT + LIVE ENGINE</b><br />
            TRACK <b>GOAI / 工业制造</b><br />
            MARKETS <b>EU · US · ID</b><br />
            STATUS <b>NOT LEGAL ADVICE</b>
          </div>
        </header>
        <nav className="toc">
          {TOC.map((item) => (
            <a key={item.id} href={`#${item.id}`}>{item.no} {item.title}</a>
          ))}
        </nav>
        <div className="banner">自动研判必须绑定官方来源。LLM 不能单独作为证据。沉默 PASS 被禁止。本页结构对标设计与开发报告：先论旨与四图，再放行台账与变更闭环。</div>

        <section className="chapter" id="thesis">
          <h2>00 / Thesis</h2>
          <h3>中国出口真正缺的不是法条，是「这部法打中我哪几个 SKU」</h3>
          <p className="lede">今天出口商不是没有法规信息。法规和平台规则非常多，但企业不知道这些规则具体影响自己哪些 SKU。因此核心不是 LAW → SEARCH，而是 LAW × PRODUCT × MARKET × PLATFORM → IMPACT → ACTION。</p>
          <p>系统最终必须能让一个广东工厂在上传目录后回答：每个 SKU 能卖到哪里、为什么、缺什么、法规变化后哪些商品必须立刻行动。长期定位是全球贸易的市场准入层（The market-access layer for global commerce），不是聊天机器人，也不是 Digital Product Passport——那是欧盟 ESPR 监管术语。</p>
          <p>第一用户：广东中小制造商的外贸/认证岗。付钱的是老板。第一垂直：消费电子（蓝牙音箱 + LED）。化妆品精华液只作对照 SKU，不是第二垂直承诺。第一市场：中国产地 → EU / US / 印度尼西亚。第一平台：Alibaba.com + Amazon。CSV 是通用入口。Alibaba 是理想第一生态，不是唯一客户。</p>
        </section>

        <section className="chapter" id="questions">
          <h2>01 / Ten questions the engine must answer</h2>
          <h3>评审时请用这十问压产品，而不是看功能清单</h3>
          <ol className="q-list">
            {QUESTIONS.map((item, index) => (
              <li key={item.q}>
                <span className="q-no">{String(index + 1).padStart(2, "0")}</span>
                <div><b>{item.q}</b><div className="sku">{item.a}</div></div>
              </li>
            ))}
          </ol>
        </section>

        <section className="chapter" id="workflow">
          <h2>02 / Current workflow</h2>
          <h3>一个工厂今天怎么回答「这款能不能卖去德国」</h3>
          <div className="grid-2">
            <div className="card">
              <b>现行路径</b>
              <ol>{WORKFLOW.map((item) => <li key={item}>{item}</li>)}</ol>
            </div>
            <div className="card">
              <b>谁用、谁买、谁拍板</b>
              <table>
                <thead><tr><th>角色</th><th>用户</th><th>买家</th><th>决策</th></tr></thead>
                <tbody>
                  {ROLES.map((row) => (
                    <tr key={row.role}><td>{row.role}</td><td>{row.user}</td><td>{row.buyer}</td><td>{row.decide}</td></tr>
                  ))}
                </tbody>
              </table>
              <p className="sku" style={{ marginTop: 12 }}>瓶颈不是「知道欧盟有 CE」，而是 SKU × 目的国 × 平台 × 现行义务。</p>
            </div>
          </div>
          <div className="card" style={{ marginTop: 12 }}>
            <b>公开成本区间（不是报价单）</b>
            <table>
              <thead><tr><th>项目</th><th>区间</th><th>备注</th></tr></thead>
              <tbody>
                {COSTS.map((row) => (
                  <tr key={row.item}><td>{row.item}</td><td>{row.value}</td><td className="sku">{row.note}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="chapter" id="competitors">
          <h2>03 / Whitespace</h2>
          <h3>不是「我们发明了监管 AI」。空白是中国工厂目录 × 跨平台 × SKU 影响 × 整改闭环</h3>
          <table>
            <thead><tr><th>选手</th><th>判定</th><th>留下的缺口</th></tr></thead>
            <tbody>
              {COMPETITORS.map((row) => (
                <tr key={row.name}><td><b>{row.name}</b></td><td>{row.verdict}</td><td>{row.gap}</td></tr>
              ))}
            </tbody>
          </table>
          <p>Already solved：买得起 RegASK/Enhesa 的企业；只做 Amazon 的卖家。Open problem：同时在 Alibaba 和 Amazon 卖 3000 个 SKU 的工厂，仍然看不到「这次变更打中 18 个 SKU」并带证据。</p>
        </section>

        <section className="chapter" id="graphs">
          <h2>04 / Four graphs</h2>
          <h3>产品、法规、市场、平台。缺任何一张图，系统就会退化成搜索</h3>
          <div className="grid-2">
            <div><b>A. Product Graph</b><pre className="tree">{TREES.product}</pre></div>
            <div><b>B. Regulation Graph</b><pre className="tree">{TREES.regulation}</pre></div>
            <div><b>C. Market Graph</b><pre className="tree">{TREES.market}</pre></div>
            <div><b>D. Platform Graph</b><pre className="tree">{TREES.platform}</pre></div>
          </div>
        </section>

        <section className="chapter" id="formula">
          <h2>05 / Core computation</h2>
          <h3>Product × Country × Platform × Regulation = Market Access State</h3>
          <p>系统核心不是聊天。不要 Yes/No。五个状态都要出现在台账里，因为 LED 缺欧盟责任人是 WARNING，音箱缺 RED 是 BLOCKED，未知品类必须是 UNCERTAIN。</p>
          <div className="grid-3">
            {STATUSES.map((item) => (
              <div className="card" key={item.id}><b>{LABEL[item.id] || item.id}</b><span className="sku">{item.mean}</span></div>
            ))}
          </div>
        </section>

        <section className="chapter" id="evidence">
          <h2>06 / Evidence first</h2>
          <h3>每个关键判断绑定官方来源。不允许 “LLM says so.”</h3>
          <p>证据对象至少包含 authority、document、article、source_url、retrieved_at、hash、excerpt。验证金字塔从上到下，LLM 必须在下层。</p>
          <div className="pyramid">
            {PYRAMID.map((item, index) => (
              <div className="card" key={item.level}>
                <b>{String(index + 1).padStart(2, "0")} / {item.level}</b>
                <span>{item.note}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="chapter" id="agents">
          <h2>07 / Agents and skills</h2>
          <h3>Intake → Research → Match → Verify → Action。不为了评委把 Agent 拆成蜂群</h3>
          <div className="grid-2">
            {AGENTS.map((item) => (
              <div className="card" key={item.name}><b>{item.name}</b><span>{item.job}</span></div>
            ))}
          </div>
          <p style={{ marginTop: 14 }}>Skills 是带 schema 的规程，Tools 是适配器。Skill ≠ Tool。MCP 可选，不算矩阵的必要条件。</p>
          <p className="sku">{SKILLS.join(" · ")}</p>
        </section>

        <section className="chapter" id="ledger">
          <h2>08 / Live compliance ledger</h2>
          <h3>以下矩阵由引擎按属性计算，不能写死。点印章看 Why / 条款 / 证据 / 缺失项</h3>
          {error && <p>{error}</p>}
          {!data && !error && <p className="hint">正在编制放行台账…</p>}
          {data && (
            <>
              <div className="kpis" style={{ paddingLeft: 0, paddingRight: 0 }}>
                <div className="kpi"><span>Catalog</span><strong>{data.products.length}</strong></div>
                <div className="kpi"><span>Cells</span><strong>{data.matrix.length}</strong></div>
                <div className="kpi"><span>Blocked</span><strong style={{ color: "var(--block)" }}>{tally.BLOCKED || 0}</strong></div>
                <div className="kpi"><span>Warning</span><strong style={{ color: "var(--warn)" }}>{tally.WARNING || 0}</strong></div>
                <div className="kpi"><span>Pass</span><strong style={{ color: "var(--pass)" }}>{tally.PASS || 0}</strong></div>
              </div>
              <div className="toolbar" style={{ paddingLeft: 0 }}>
                <button className="ghost" onClick={() => load()}>重载目录</button>
                <button onClick={runChange} disabled={busy === "change"}>{busy === "change" ? "研判中…" : "模拟法规变更"}</button>
                <a href="/pitch.html"><button className="ghost" type="button">路演页</button></a>
                <label className="field">
                  SKU
                  <input value={sku} onChange={(e) => setSku(e.target.value)} />
                </label>
                <label className="field">
                  附证
                  <input value={certs} onChange={(e) => setCerts(e.target.value)} />
                </label>
                <button onClick={runRecheck} disabled={busy === "recheck"}>{busy === "recheck" ? "复检中…" : "补证后再评估"}</button>
              </div>
              <p className="hint" style={{ paddingLeft: 0 }}>整改闭环：给蓝牙音箱附上 CE-RED / EU-RP / FCC / DJID，状态由引擎重算。改 SKU 名字不会变结果。</p>
              <div className="layout" style={{ paddingLeft: 0, paddingRight: 0 }}>
                <section className="panel">
                  <h2>Compliance ledger</h2>
                  <div className="body">
                    <table>
                      <thead>
                        <tr>
                          <th>SKU</th>
                          {["EU", "US", "ID"].map((country) => <th key={country}>{country}</th>)}
                        </tr>
                      </thead>
                      <tbody>
                        {data.products.map((product) => (
                          <tr key={product.sku}>
                            <td>
                              <div className="prod">{product.name}</div>
                              <div className="sku">{product.sku} · {product.category}<br />{(product.certifications || []).join(" · ") || "no certificates"}</div>
                            </td>
                            {["EU", "US", "ID"].map((country) => {
                              const cells = data.matrix.filter((item) => item.sku === product.sku && item.country === country);
                              return (
                                <td key={country}>
                                  <div className="stamps">
                                    {cells.map((cell) => (
                                      <button key={cell.platform} type="button" className={`stamp ${cell.status}`} onClick={() => setDocket({ kind: "cell", cell })}>
                                        <span>{cell.platform.replace(".com", "")}</span>
                                        <span>{LABEL[cell.status]}</span>
                                      </button>
                                    ))}
                                  </div>
                                </td>
                              );
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>
                <aside className="panel">
                  {!docket && (
                    <>
                      <h2>Evidence docket</h2>
                      <div className="empty"><div><div className="chop">待查</div>点左侧印章，打开 Why、条款、证据、缺失项和整改。对应十问里的 1–7、10。</div></div>
                    </>
                  )}
                  {docket?.kind === "recheck" && (
                    <>
                      <h2>Evidence docket</h2>
                      <div className="body">
                        <p className="status-xl">已复检</p>
                        <p>附证：{docket.certifications.join(", ")}</p>
                        <p className="sku">{docket.moved}</p>
                      </div>
                    </>
                  )}
                  {docket?.kind === "cell" && (
                    <>
                      <h2>Evidence docket</h2>
                      <div className="body docket">
                        <p className="status-xl">{LABEL[docket.cell.status]}</p>
                        <div className="sku">{docket.cell.sku} × {docket.cell.country} × {docket.cell.platform}</div>
                        <dt>Why</dt><dd>{docket.cell.why}</dd>
                        <dt>Confidence</dt><dd>{docket.cell.confidence} · {docket.cell.evidence_quality} · {docket.cell.last_verified}</dd>
                        <dt>Missing</dt>
                        <dd>
                          <ul>
                            {(docket.cell.missing_items || []).length
                              ? docket.cell.missing_items.map((item) => <li key={item}>{item}</li>)
                              : <li>none</li>}
                          </ul>
                        </dd>
                        <dt>Actions</dt>
                        <dd>
                          <ol>
                            {(docket.cell.required_actions || []).map((item) => <li key={item}>{item}</li>)}
                          </ol>
                        </dd>
                        {(docket.cell.findings || []).map((finding) => (
                          <div className="finding" key={finding.requirement_id}>
                            <b>{finding.title}</b>
                            <div className="sku">{finding.requirement_id} · {finding.status}</div>
                            {(finding.evidence || []).map((ev) => (
                              <div className="sku" style={{ marginTop: 6 }} key={ev.hash || ev.source_url}>
                                {ev.authority} · {ev.document} · {ev.article}<br />
                                <a href={ev.source_url} target="_blank" rel="noreferrer">{ev.source_url}</a><br />
                                {ev.excerpt}<br />
                                hash {(ev.hash || "").slice(0, 12)}
                              </div>
                            ))}
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </aside>
              </div>
            </>
          )}
        </section>

        <section className="chapter" id="twins">
          <h2>09 / Product digital twin</h2>
          <h3>属性是事实，SKU 名字不是。图片线索在人工确认前保持 UNCERTAIN</h3>
          <div className="twin-grid">
            {(data?.products || []).map((product) => (
              <div className="card twin" key={product.sku}>
                <b>{product.name}</b>
                <dt>SKU / Category / HS</dt>
                <dd>{product.sku} · {product.category} · {product.hs_code || "n/a"}</dd>
                <dt>Origin / Manufacturer</dt>
                <dd>{product.origin || "CN"} · {product.manufacturer || "n/a"}</dd>
                <dt>Materials / Ingredients / Claims</dt>
                <dd>{(product.materials || []).join(", ") || "—"} / {(product.ingredients || []).join(", ") || "—"} / {(product.claims || []).join(", ") || "—"}</dd>
                <dt>Battery / Wireless / Mains</dt>
                <dd>
                  {product.has_battery ? `yes ${product.battery_type || ""}` : "no battery"} ·
                  {product.has_wireless ? ` ${(product.wireless_tech || []).join("/") || "wireless"}` : " no radio"} ·
                  {product.mains_powered ? " mains" : " portable"}
                </dd>
                <dt>Certifications</dt>
                <dd>{(product.certifications || []).join(" · ") || "none"}</dd>
                <dt>Targets</dt>
                <dd>{(product.target_countries || []).join("/")} · {(product.target_platforms || []).join(" / ")}</dd>
              </div>
            ))}
          </div>
        </section>

        <section className="chapter" id="change">
          <h2>10 / Regulatory change engine</h2>
          <h3>不要告诉工厂「出了一部新法」。要告诉工厂：3 个 SKU 里哪 1 个被打中</h3>
          <p>流程：Regulation v1 → v2 → Diff → Changed requirement → Affected category → Affected SKU → Affected market → Affected platform → Merchant alert。本演示监控印尼灯具 SNI/IEC 60598 证据版本。音箱和精华液不应移动。</p>
          {change ? (
            <div className="panel">
              <h2>Change impact object</h2>
              <div className="body">
                <p>{change.impact.summary}</p>
                <p>受影响 SKU：<b>{(change.impact.affected_skus || []).join(", ") || "none"}</b> / {data?.products.length || 3}</p>
                <table>
                  <thead><tr><th>Cell</th><th>Before</th><th>After</th></tr></thead>
                  <tbody>
                    {Object.keys(change.impact.after || {}).map((key) => (
                      <tr key={key}>
                        <td className="sku">{key}</td>
                        <td>{change.impact.before[key]}</td>
                        <td><b>{change.impact.after[key]}</b></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : <p className="sku">变更对象加载中，或点击「模拟法规变更」。</p>}
        </section>

        <section className="chapter" id="actions">
          <h2>11 / Remediation and re-check</h2>
          <h3>从 Intelligence 走到 Action：缺什么、做什么、做完再跑一遍</h3>
          <p>BLOCKED 必须带 Reason 和 Action。动作来自未满足 requirement，例如取得测试报告、更新标签、指定欧盟责任人、提交注册、再评估。专家升级路径：律师、法规顾问、实验室、发证机构——这也是商业模式，产品不冒充他们。</p>
          <div className="panel">
            <h2>Required actions from live engine</h2>
            <div className="body">
              {(data?.actions || []).slice(0, 10).flatMap((plan) => plan.steps.slice(0, 2).map((step, index) => (
                <div key={`${plan.sku}-${plan.country}-${plan.platform}-${index}`} style={{ padding: "8px 0", borderBottom: "1px dashed var(--rule)" }}>
                  <b>{plan.sku}</b> · {plan.country} · {plan.platform}
                  <div className="sku">{step.action}</div>
                </div>
              )))}
            </div>
          </div>
        </section>

        <section className="chapter" id="safety">
          <h2>12 / Liability and confidence</h2>
          <h3>这不是律师事务所，不是公告机构，也不是海关裁定</h3>
          <div className="grid-2">
            {SAFETY.map((item) => (
              <div className="card" key={item.label}><b>{item.label}</b><span>{item.mean}</span></div>
            ))}
          </div>
          <p style={{ marginTop: 12 }}>每个结论必须有 confidence、evidence quality、last verified、source authority。假 PASS 比过度预警更致命：告诉工厂能卖而实际不能卖，是产品的致命错误。</p>
        </section>

        <section className="chapter" id="business">
          <h2>13 / Commercial model</h2>
          <h3>一次 Amazon 下架或一次扣柜，超过 Pro 订阅。Alibaba 是第一生态，不是唯一客户</h3>
          <div className="grid-2">
            {BUSINESS.map((item) => (
              <div className="card" key={item.tier}><b>{item.tier}</b><span>{item.detail}</span></div>
            ))}
          </div>
          <p style={{ marginTop: 12 }}>Alibaba 已解决信任标、部分证书上传和悟空经营 Skill；仍把目的国法、GPSR/RED/FCC/BPOM 的目录级影响留给商家。商户 API 不开放就走 CSV，不逆向卖家后台。未来可做悟空 Skill / 云上 Agent，但引擎必须独立。</p>
        </section>

        <section className="chapter" id="coverage">
          <h2>14 / Credible subset and sources</h2>
          <h3>3 类产品 × 3 个市场 × 2 个平台，每一条都有来源。强过假的 200 国</h3>
          <p>主垂直消费电子（无线音频 + 灯具）。化妆品精华液仅演示对照：印尼 BPOM vs 美国 MoCRA vs 欧盟 1223，用来证明东盟 BLOCKED 格子，不承诺第二行业。不做医疗器械（责任与赛题安全），不做假全球覆盖。路线：初赛编码子集；复赛更多官方抓取与第二电子家族；决赛用脱敏真实目录。未计划 200 国。</p>
          <table>
            <thead><tr><th>ID</th><th>Authority</th><th>Role</th><th>Source</th></tr></thead>
            <tbody>
              {SOURCES.map((row) => (
                <tr key={row.id}>
                  <td className="sku">{row.id}</td>
                  <td>{row.authority}</td>
                  <td>{row.role}</td>
                  <td className="sku"><a href={row.url} target="_blank" rel="noreferrer">{row.url}</a></td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <div className="foot">
          <span>CanSell D&amp;D Report · 不是法律意见 · MIT</span>
          <span>
            <a href="https://github.com/WilliamK112/global-product-compliance">GitHub</a>
            {" · "}
            <a href="/pitch.html">Pitch</a>
          </span>
        </div>
      </article>
    </div>
  );
}
