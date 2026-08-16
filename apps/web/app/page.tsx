"use client";

import { useEffect, useMemo, useState } from "react";

type Finding = {
  requirement_id: string;
  title: string;
  status: string;
  reason: string;
  missing_item?: string | null;
  required_actions: string[];
  confidence: number;
  evidence_quality: string;
  last_verified: string;
  source_authority: string;
  evidence: Array<{
    authority: string;
    document: string;
    article: string;
    source_url: string;
    retrieved_at: string;
    hash: string;
    excerpt: string;
  }>;
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
  findings: Finding[];
};

type Product = { sku: string; name: string; category: string; origin: string };

const SYMBOL: Record<string, string> = {
  PASS: "✓ PASS",
  WARNING: "⚠ WARNING",
  BLOCKED: "✕ BLOCKED",
  UNCERTAIN: "? UNCERTAIN",
  EXPERT_REVIEW_REQUIRED: "▣ EXPERT",
};

export default function Page() {
  const [data, setData] = useState<{ products: Product[]; matrix: Cell[]; countries: string[]; platforms: string[] } | null>(null);
  const [selected, setSelected] = useState<Cell | null>(null);
  const [change, setChange] = useState<any>(null);
  const [error, setError] = useState("");

  async function load() {
    const res = await fetch("/backend/portfolio");
    if (!res.ok) throw new Error("API not reachable. Start FastAPI on :8000.");
    setData(await res.json());
  }

  useEffect(() => {
    load().catch((err) => setError(String(err.message || err)));
  }, []);

  const counts = useMemo(() => {
    const tally: Record<string, number> = { PASS: 0, WARNING: 0, BLOCKED: 0, UNCERTAIN: 0, EXPERT_REVIEW_REQUIRED: 0 };
    data?.matrix.forEach((cell) => {
      tally[cell.status] = (tally[cell.status] || 0) + 1;
    });
    return tally;
  }, [data]);

  async function runChange() {
    const res = await fetch("/backend/changes/demo");
    setChange(await res.json());
  }

  async function upload(file: File) {
    const text = await file.text();
    const res = await fetch("/backend/catalog", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ csv_text: text }),
    });
    setData(await res.json());
    setSelected(null);
  }

  if (error) {
    return (
      <div className="wrap">
        <h1>CanSell</h1>
        <p>{error}</p>
      </div>
    );
  }
  if (!data) return <div className="wrap">Loading market access matrix…</div>;

  return (
    <div className="wrap">
      <div className="hero">
        <h1>CanSell · 能卖哪</h1>
        <p>Know where every product can sell — before regulations stop it. Product × country × platform × regulation. Not a legal opinion.</p>
      </div>
      <div className="banner">
        本系统输出的是带证据的自动研判，不是律师意见。BLOCKED / WARNING 需人工复核后再出货。LLM 不能单独作为证据。
      </div>
      <div className="kpi">
        <div><span className="muted">Cells</span><strong>{data.matrix.length}</strong></div>
        <div><span className="muted">Blocked</span><strong className="BLOCKED">{counts.BLOCKED}</strong></div>
        <div><span className="muted">Warning</span><strong className="WARNING">{counts.WARNING}</strong></div>
        <div><span className="muted">Pass</span><strong className="PASS">{counts.PASS}</strong></div>
      </div>
      <div className="actions">
        <label className="secondary" style={{ display: "inline-block" }}>
          <button type="button" className="secondary" onClick={() => document.getElementById("csv")?.click()}>Upload CSV catalog</button>
          <input id="csv" hidden type="file" accept=".csv" onChange={(e) => e.target.files && upload(e.target.files[0])} />
        </label>
        <button onClick={runChange}>Simulate regulation change</button>
      </div>
      <div className="grid">
        <div className="card">
          <h2>Compliance matrix</h2>
          <p className="muted">Click a cell. Results are computed from product attributes and encoded official sources, not hardcoded SKU names.</p>
          <table>
            <thead>
              <tr>
                <th>Product</th>
                {data.countries.map((country) => (
                  <th key={country}>{country}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.products.map((product) => (
                <tr key={product.sku}>
                  <td>
                    {product.name}
                    <div className="muted">{product.sku} · {product.category}</div>
                  </td>
                  {data.countries.map((country) => {
                    const cells = data.matrix.filter((item) => item.sku === product.sku && item.country === country);
                    const worst = cells.sort((a, b) => statusRank(b.status) - statusRank(a.status))[0];
                    return (
                      <td key={country}>
                        {worst && (
                          <span className={`status ${worst.status}`} onClick={() => setSelected(worst)}>
                            {SYMBOL[worst.status]}
                          </span>
                        )}
                        <div className="muted">{cells.map((item) => item.platform.replace(".com", "")).join(" / ")}</div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="card">
          <h2>{selected ? `${selected.sku} × ${selected.country} × ${selected.platform}` : "Cell detail"}</h2>
          {!selected && <p className="muted">Select a matrix cell to inspect why, evidence, missing items, and actions.</p>}
          {selected && (
            <dl className="detail">
              <dt>Status</dt>
              <dd className={selected.status}>{SYMBOL[selected.status]}</dd>
              <dt>Why</dt>
              <dd>{selected.why}</dd>
              <dt>Confidence / evidence / last verified</dt>
              <dd>{selected.confidence} · {selected.evidence_quality} · {selected.last_verified}</dd>
              <dt>Missing</dt>
              <dd>
                <ul className="list">
                  {selected.missing_items.map((item) => <li key={item}>{item}</li>)}
                </ul>
              </dd>
              <dt>Required actions</dt>
              <dd>
                <ol className="list">
                  {selected.required_actions.map((item) => <li key={item}>{item}</li>)}
                </ol>
              </dd>
              <dt>Evidence</dt>
              <dd>
                {selected.findings.map((finding) => (
                  <div key={finding.requirement_id} style={{ marginBottom: 12 }}>
                    <strong>{finding.title}</strong>
                    <div className="muted">{finding.requirement_id} · {finding.status}</div>
                    {finding.evidence.map((ev) => (
                      <div key={ev.hash} className="muted">
                        {ev.authority} · {ev.document} · {ev.article}
                        <br />
                        <a href={ev.source_url} target="_blank" rel="noreferrer">{ev.source_url}</a>
                        <br />
                        retrieved {ev.retrieved_at} · hash {ev.hash.slice(0, 12)}
                        <br />
                        {ev.excerpt}
                      </div>
                    ))}
                  </div>
                ))}
              </dd>
            </dl>
          )}
        </div>
      </div>
      {change && (
        <div className="card" style={{ marginTop: 16 }}>
          <h2>Regulation change impact</h2>
          <p>{change.impact.summary}</p>
          <p>
            Affected SKUs: <strong>{change.impact.affected_skus.join(", ") || "none"}</strong> of {data.products.length}
          </p>
          <table>
            <thead>
              <tr><th>Cell</th><th>Before</th><th>After</th></tr>
            </thead>
            <tbody>
              {Object.keys(change.impact.after).map((key) => (
                <tr key={key}>
                  <td>{key}</td>
                  <td className={change.impact.before[key]}>{change.impact.before[key]}</td>
                  <td className={change.impact.after[key]}>{change.impact.after[key]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function statusRank(status: string) {
  return { PASS: 0, UNCERTAIN: 1, WARNING: 2, EXPERT_REVIEW_REQUIRED: 3, BLOCKED: 4 }[status] || 0;
}
