"use client";

import { useEffect, useState } from "react";

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
  category: string;
  origin?: string;
  certifications: string[];
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
  const [csvText, setCsvText] = useState("");
  const [source, setSource] = useState<"demo" | "upload">("demo");

  async function load() {
    const res = await fetch("/api/portfolio");
    if (!res.ok) throw new Error("portfolio failed");
    setData(await res.json());
    const template = await fetch("/api/catalog");
    setCsvText(await template.text());
    setSource("demo");
    setChange(null);
  }

  async function applyCsv(text: string, origin: "demo" | "upload") {
    setBusy("catalog");
    const res = await fetch("/api/catalog", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ csv_text: text }),
    });
    const payload = await res.json();
    if (!res.ok) throw new Error(payload.error || "catalog failed");
    setCsvText(text);
    setSource(origin);
    setData(payload);
    setChange(null);
    if (payload.products?.[0]?.sku) setSku(payload.products[0].sku);
    setBusy("");
  }

  async function onUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    try {
      await applyCsv(await file.text(), "upload");
    } catch (err) {
      setError(String((err as Error).message || err));
      setBusy("");
    }
  }

  function renameFirstProduct(text: string) {
    const lines = text.replaceAll("\r\n", "\n").split("\n");
    const idx = lines.findIndex((line, index) => index > 0 && line.trim());
    if (idx < 0) return text;
    lines[idx] = lines[idx].replace(/^([^,]+),("[^"]*"|[^,]*)/, 'RENAMED-SKU,"Totally Different Name"');
    return lines.join("\n");
  }

  async function proveRename() {
    setBusy("catalog");
    try {
      await applyCsv(renameFirstProduct(csvText || (await (await fetch("/api/catalog")).text())), "upload");
      setDocket({ kind: "recheck", certifications: ["rename-only"], moved: "SKU/name changed; statuses must stay the same if attributes are unchanged." });
    } catch (err) {
      setError(String((err as Error).message || err));
      setBusy("");
    }
  }

  useEffect(() => {
    load().catch((err) => setError(String(err.message || err)));
  }, []);

  async function runChange() {
    setBusy("change");
    const res = await fetch("/api/changes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ csv_text: source === "upload" ? csvText : undefined }),
    });
    setChange(await res.json());
    setBusy("");
  }

  async function runRecheck() {
    setBusy("recheck");
    const res = await fetch("/api/recheck", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sku,
        extra_certifications: certs.split(/[,;]/).map((item) => item.trim()).filter(Boolean),
        csv_text: source === "upload" ? csvText : undefined,
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

  if (error) {
    return (
      <div className="shell">
        <article className="doc"><p className="hint">{error}</p></article>
      </div>
    );
  }
  if (!data) {
    return (
      <div className="shell">
        <article className="doc"><p className="hint">正在编制放行台账…</p></article>
      </div>
    );
  }

  const tally: Record<string, number> = { PASS: 0, WARNING: 0, BLOCKED: 0, UNCERTAIN: 0 };
  data.matrix.forEach((cell) => {
    tally[cell.status] = (tally[cell.status] || 0) + 1;
  });

  return (
    <div className="shell">
      <article className="doc">
        <div className="ribbon">LIVE ENGINE</div>
        <header className="mast">
          <div className="brand">
            <img className="mark" src="/brand/icon-fangxing.png" alt="放行" width={64} height={64} />
            <div>
              <div className="en">Market access passport</div>
              <h1>能卖哪 · CanSell</h1>
              <p className="tagline">Know where every product can sell — before regulations stop it.</p>
            </div>
          </div>
          <div className="meta">
            PORTFOLIO <b>{data.products.length} SKU</b><br />
            MARKETS <b>EU · US · ID</b><br />
            PLATFORMS <b>Alibaba · Amazon</b><br />
            HOST <b>Vercel</b><br />
            STATUS <b>NOT LEGAL ADVICE</b>
          </div>
        </header>
        <div className="banner">点印章查看条款、证据、缺失项和整改。状态由产品属性计算，不能写死。本页是产品，不是介绍 — 设计说明见 GitHub README。</div>
        <div className="kpis">
          <div className="kpi"><span>Catalog</span><strong>{data.products.length}</strong></div>
          <div className="kpi"><span>Cells</span><strong>{data.matrix.length}</strong></div>
          <div className="kpi"><span>Blocked</span><strong style={{ color: "var(--block)" }}>{tally.BLOCKED || 0}</strong></div>
          <div className="kpi"><span>Warning</span><strong style={{ color: "var(--warn)" }}>{tally.WARNING || 0}</strong></div>
          <div className="kpi"><span>Pass</span><strong style={{ color: "var(--pass)" }}>{tally.PASS || 0}</strong></div>
        </div>
        <div className="toolbar">
          <button className="ghost" onClick={() => load()}>恢复演示目录</button>
          <label className="field">
            上传 CSV
            <input type="file" accept=".csv,text/csv" onChange={onUpload} />
          </label>
          <a href="/api/catalog"><button className="ghost" type="button">下载模板</button></a>
          <button className="ghost" onClick={proveRename} disabled={busy === "catalog"}>改首行 SKU 名再评估</button>
          <button onClick={runChange} disabled={busy === "change"}>{busy === "change" ? "研判中…" : "模拟法规变更"}</button>
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
        <p className="hint">目录来源：{source === "demo" ? "演示 catalog" : "已上传 CSV"}。给蓝牙音箱附上 CE-RED / EU-RP / FCC / DJID 再评估。点「改首行 SKU 名再评估」证明结果跟名字无关。</p>
        <div className="layout">
          <section className="panel">
            <h2>01 / Compliance ledger</h2>
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
                <h2>02 / Evidence docket</h2>
                <div className="empty"><div><div className="chop">待查</div>点左侧印章，打开 Why、条款、证据和整改。</div></div>
              </>
            )}
            {docket?.kind === "recheck" && (
              <>
                <h2>02 / Evidence docket</h2>
                <div className="body">
                  <p className="status-xl">已复检</p>
                  <p>附证：{docket.certifications.join(", ")}</p>
                  <p className="sku">{docket.moved}</p>
                </div>
              </>
            )}
            {docket?.kind === "cell" && (
              <>
                <h2>02 / Evidence docket</h2>
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
        <div className="wide">
          <section className="panel">
            <h2>03 / Catalog twins</h2>
            <div className="body twin-grid">
              {data.products.map((product) => (
                <div className="twin" key={product.sku}>
                  <div className="prod">{product.name}</div>
                  <dt>SKU / HS</dt>
                  <dd>{product.sku} · {product.hs_code || "n/a"}</dd>
                  <dt>Origin / Maker</dt>
                  <dd>{product.origin || "CN"} · {product.manufacturer || "n/a"}</dd>
                  <dt>Battery / Radio / Mains</dt>
                  <dd>
                    {product.has_battery ? `yes ${product.battery_type || ""}` : "no battery"} ·
                    {product.has_wireless ? ` ${(product.wireless_tech || []).join("/") || "wireless"}` : " no radio"} ·
                    {product.mains_powered ? " mains" : " portable"}
                  </dd>
                  <dt>Materials / Ingredients</dt>
                  <dd>{(product.materials || []).join(", ") || "—"} / {(product.ingredients || []).join(", ") || "—"}</dd>
                  <dt>Certs</dt>
                  <dd>{(product.certifications || []).join(" · ") || "none"}</dd>
                </div>
              ))}
            </div>
          </section>
          <section className="panel" style={{ marginTop: 16 }}>
            <h2>04 / Required actions</h2>
            <div className="body">
              {(data.actions || []).slice(0, 8).flatMap((plan) => plan.steps.slice(0, 2).map((step, index) => (
                <div key={`${plan.sku}-${plan.country}-${plan.platform}-${index}`} style={{ padding: "8px 0", borderBottom: "1px dashed var(--rule)" }}>
                  <b>{plan.sku}</b> · {plan.country} · {plan.platform}
                  <div className="sku">{step.action}</div>
                </div>
              )))}
            </div>
          </section>
          {change && (
            <section className="panel" style={{ marginTop: 16 }}>
              <h2>05 / Change impact</h2>
              <div className="body">
                <p>{change.impact.summary}</p>
                <p>受影响 SKU：<b>{(change.impact.affected_skus || []).join(", ")}</b> / {data.products.length}</p>
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
            </section>
          )}
        </div>
        <div className="foot">
          <span>CanSell · 不是法律意见</span>
          <span>
            <a href="https://github.com/WilliamK112/global-product-compliance">产品说明 README</a>
            {" · "}
            <a href="/pitch.html">路演</a>
          </span>
        </div>
      </article>
    </div>
  );
}
