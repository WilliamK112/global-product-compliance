import { createHash } from "crypto";
import rawRegulations from "@/data/regulations.json";
import rawPlatforms from "@/data/platforms.json";
import { DEMO_CATALOG_CSV } from "@/lib/demo-catalog";

export type Status = "PASS" | "WARNING" | "BLOCKED" | "UNCERTAIN" | "EXPERT_REVIEW_REQUIRED";

export type Evidence = {
  authority: string;
  document: string;
  article: string;
  source_url: string;
  retrieved_at: string;
  hash?: string;
  excerpt: string;
  language?: string;
  verification_level: string;
};

export type Requirement = {
  requirement_id: string;
  regulation_id: string;
  title: string;
  requirement_type: string;
  product_scope: Record<string, unknown>;
  missing_if_unmet: string;
  default_status_if_unmet: Status | string;
  satisfied_by: string[];
  actions: string[];
  evidence: Evidence[];
};

export type ProductTwin = {
  sku: string;
  name: string;
  description: string;
  category: string;
  origin: string;
  certifications: string[];
  labels: string[];
  materials: string[];
  ingredients: string[];
  has_battery: boolean;
  has_wireless: boolean;
  wireless_tech: string[];
  mains_powered: boolean;
  target_countries: string[];
  target_platforms: string[];
  [key: string]: unknown;
};

export type Finding = {
  requirement_id: string;
  regulation_id: string;
  title: string;
  status: Status;
  reason: string;
  missing_item: string | null;
  required_actions: string[];
  confidence: number;
  evidence_quality: string;
  last_verified: string;
  source_authority: string;
  evidence: Evidence[];
};

export type Cell = {
  sku: string;
  country: string;
  platform: string;
  status: Status;
  findings: Finding[];
  confidence: number;
  evidence_quality: string;
  last_verified: string;
  why: string;
  applicable_rules: string[];
  missing_items: string[];
  required_actions: string[];
};

const COUNTRIES = ["EU", "US", "ID"];
const PLATFORMS = ["Alibaba.com", "Amazon"];
const RANK: Record<Status, number> = {
  PASS: 0,
  UNCERTAIN: 1,
  WARNING: 2,
  EXPERT_REVIEW_REQUIRED: 3,
  BLOCKED: 4,
};
const LEVELS = [
  "official_regulation",
  "official_authority_guidance",
  "platform_rule",
  "accredited_standard",
  "cross_source_verification",
  "llm_interpretation",
  "human_expert",
];

function hashEvidence(item: Evidence): Evidence {
  if (item.hash) return item;
  const raw = JSON.stringify({
    authority: item.authority,
    document: item.document,
    article: item.article,
    source_url: item.source_url,
    excerpt: item.excerpt,
  });
  return { ...item, hash: createHash("sha256").update(raw).digest("hex") };
}

function attr(product: ProductTwin, key: string) {
  return product[key];
}

function matchesClause(product: ProductTwin, clause: Record<string, unknown>): boolean {
  if (clause.all) return (clause.all as Record<string, unknown>[]).every((item) => matchesClause(product, item));
  if (clause.any) return (clause.any as Record<string, unknown>[]).some((item) => matchesClause(product, item));
  if (clause.not) return !matchesClause(product, clause.not as Record<string, unknown>);
  const value = attr(product, String(clause.attr ?? ""));
  if ("eq" in clause) return value === clause.eq;
  if ("in" in clause) {
    const options = clause.in as unknown[];
    if (Array.isArray(value)) return value.some((item) => options.includes(item));
    return options.includes(value);
  }
  if ("truthy" in clause) return Boolean(value) === Boolean(clause.truthy);
  return false;
}

function applies(product: ProductTwin, requirement: Requirement) {
  const scope = requirement.product_scope || {};
  if (!Object.keys(scope).length) return false;
  return matchesClause(product, scope);
}

function satisfied(product: ProductTwin, requirement: Requirement) {
  const available = new Set([...product.certifications, ...product.labels].map((item) => item.toUpperCase()));
  return requirement.satisfied_by.some((token) => available.has(token.toUpperCase()));
}

function evidenceQuality(levels: string[]) {
  if (!levels.length) return "none";
  const best = Math.min(...levels.map((level) => (LEVELS.includes(level) ? LEVELS.indexOf(level) : 99)));
  if (best <= LEVELS.indexOf("official_regulation")) return "high";
  if (best <= LEVELS.indexOf("accredited_standard")) return "medium";
  return "low";
}

function canAssert(levels: string[]) {
  return levels.some((level) => level !== "llm_interpretation");
}

function confidence(requirement: Requirement, ok: boolean) {
  const levels = requirement.evidence.map((item) => item.verification_level);
  const quality = evidenceQuality(levels);
  if (!canAssert(levels)) return 0.35;
  if (quality === "high") return ok ? 0.86 : 0.84;
  if (quality === "medium") return 0.72;
  return 0.48;
}

function worst(statuses: Status[]): Status {
  if (!statuses.length) return "UNCERTAIN";
  return statuses.reduce((a, b) => (RANK[a] > RANK[b] ? a : b));
}

function assessRequirement(product: ProductTwin, requirement: Requirement): Finding | null {
  if (!applies(product, requirement)) return null;
  const levels = requirement.evidence.map((item) => item.verification_level);
  const ok = satisfied(product, requirement);
  let status: Status;
  let reason: string;
  let missing: string | null;
  if (!canAssert(levels)) {
    status = "EXPERT_REVIEW_REQUIRED";
    reason = "Only LLM-level interpretation is available; expert review required.";
    missing = requirement.missing_if_unmet;
  } else if (ok) {
    status = "PASS";
    reason = "Product evidence matches the requirement tokens.";
    missing = null;
  } else {
    status = requirement.default_status_if_unmet as Status;
    reason = `Applicable requirement is not evidenced on this SKU: ${requirement.title}`;
    missing = requirement.missing_if_unmet;
  }
  return {
    requirement_id: requirement.requirement_id,
    regulation_id: requirement.regulation_id,
    title: requirement.title,
    status,
    reason,
    missing_item: missing,
    required_actions: status === "PASS" ? [] : requirement.actions,
    confidence: confidence(requirement, ok),
    evidence_quality: evidenceQuality(levels),
    last_verified: requirement.evidence[0]?.retrieved_at || "",
    source_authority: requirement.evidence[0]?.authority || "unknown",
    evidence: requirement.evidence.map(hashEvidence),
  };
}

function assessCell(
  product: ProductTwin,
  country: string,
  platform: string,
  regulations: Array<{ jurisdiction: string; requirements: Requirement[]; status?: string }>,
  extras: Requirement[],
): Cell {
  const findings: Finding[] = [];
  for (const regulation of regulations) {
    if (regulation.jurisdiction !== country && regulation.jurisdiction !== "GLOBAL") continue;
    for (const requirement of regulation.requirements) {
      const finding = assessRequirement(product, requirement);
      if (finding) findings.push(finding);
    }
  }
  for (const requirement of extras) {
    const finding = assessRequirement(product, requirement);
    if (finding) findings.push(finding);
  }
  const status = findings.length ? worst(findings.map((item) => item.status)) : "UNCERTAIN";
  const qualities = findings.map((item) => item.evidence_quality);
  const quality = qualities.includes("high") ? "high" : qualities.includes("medium") ? "medium" : qualities.length ? "low" : "none";
  return {
    sku: product.sku,
    country,
    platform,
    status,
    findings,
    confidence: Number((findings.length ? Math.min(...findings.map((item) => item.confidence)) : 0.2).toFixed(2)),
    evidence_quality: quality,
    last_verified: findings.map((item) => item.last_verified).sort().at(-1) || "",
    why:
      status === "UNCERTAIN" && !findings.length
        ? "No encoded official requirement matched this product in this market; refusing to mark PASS."
        : findings.filter((item) => item.status === status).map((item) => item.reason).join("; "),
    applicable_rules: findings.map((item) => item.requirement_id),
    missing_items: findings.filter((item) => item.missing_item && item.status !== "PASS").map((item) => item.missing_item as string),
    required_actions: findings.flatMap((item) => item.required_actions),
  };
}

function split(value: string) {
  if (!value) return [];
  return value.replaceAll(";", ",").split(",").map((part) => part.trim()).filter(Boolean);
}

function truthy(value: string) {
  return ["1", "true", "yes", "y", "是"].includes(value.trim().toLowerCase());
}

function parseCsv(text: string): ProductTwin[] {
  const lines = text.replaceAll("\r\n", "\n").trim().split("\n");
  const headers = parseLine(lines[0]);
  const rows = lines.slice(1).map((line) => {
    const cols = parseLine(line);
    const row: Record<string, string> = {};
    headers.forEach((header, index) => {
      row[header] = cols[index] || "";
    });
    return row;
  });
  return rows.map((data) => {
    const wireless = split(data.wireless_tech || data.wireless || "");
    return {
      sku: data.sku,
      name: data.name || data.sku,
      description: data.description || "",
      category: (data.category || "").toLowerCase().replaceAll(" ", "_"),
      origin: data.origin || "CN",
      certifications: split(data.certifications || "").map((item) => item.toUpperCase()),
      labels: split(data.labels || ""),
      materials: split(data.materials || ""),
      ingredients: split(data.ingredients || ""),
      claims: split(data.claims || ""),
      has_battery: truthy(data.has_battery || "") || split(data.materials || "").join(" ").toLowerCase().includes("battery"),
      battery_type: data.battery_type || "",
      has_wireless: truthy(data.has_wireless || "") || Boolean(wireless.length),
      wireless_tech: wireless,
      mains_powered: truthy(data.mains_powered || ""),
      hs_code: data.hs_code || "",
      manufacturer: data.manufacturer || "",
      target_countries: split(data.target_country || data.target_countries || "").map((item) => item.toUpperCase()),
      target_platforms: split(data.target_platform || data.target_platforms || ""),
    };
  });
}

function parseLine(line: string) {
  const out: string[] = [];
  let current = "";
  let quoted = false;
  for (let i = 0; i < line.length; i += 1) {
    const ch = line[i];
    if (ch === '"') {
      quoted = !quoted;
    } else if (ch === "," && !quoted) {
      out.push(current);
      current = "";
    } else {
      current += ch;
    }
  }
  out.push(current);
  return out.map((item) => item.trim());
}

function loadGraphs(includeUpcoming = false) {
  const regulations = rawRegulations.regulations.filter((item) => includeUpcoming || item.status !== "upcoming");
  const upcoming = rawRegulations.regulations.filter((item) => item.status === "upcoming");
  const platforms: Record<string, Requirement[]> = {};
  for (const [name, value] of Object.entries(rawPlatforms.platforms as unknown as Record<string, { requirements: Requirement[] }>)) {
    platforms[name] = value.requirements;
  }
  return { regulations, upcoming, platforms };
}

function matrix(products: ProductTwin[], includeUpcoming = false) {
  const { regulations, platforms } = loadGraphs(includeUpcoming);
  const cells: Cell[] = [];
  for (const product of products) {
    const countries = product.target_countries.length ? product.target_countries : COUNTRIES;
    const plats = product.target_platforms.length ? product.target_platforms : PLATFORMS;
    for (const country of countries) {
      for (const platform of plats) {
        const extras = (platforms[platform] || []).filter((req) => {
          const scoped = (req.product_scope as { countries?: string[] }).countries;
          return !scoped || scoped.includes(country);
        });
        cells.push(assessCell(product, country, platform, regulations, extras));
      }
    }
  }
  return cells;
}

function actions(cells: Cell[]) {
  return cells
    .filter((cell) => cell.required_actions.length)
    .map((cell) => ({
      sku: cell.sku,
      country: cell.country,
      platform: cell.platform,
      current_status: cell.status,
      steps: cell.required_actions.slice(0, 4).map((action, index) => ({ step: index + 1, action, status: cell.status })),
    }));
}

export function demoProducts() {
  return parseCsv(DEMO_CATALOG_CSV);
}

export function runPortfolio(products?: ProductTwin[], includeUpcoming = false) {
  const catalog = products || demoProducts();
  const cells = matrix(catalog, includeUpcoming);
  return {
    products: catalog,
    matrix: cells,
    countries: COUNTRIES,
    platforms: PLATFORMS,
    actions: actions(cells),
    disclaimer: "Not a legal opinion. Automated interpretation bound to encoded official sources.",
  };
}

export function parseCatalog(text: string) {
  const products = parseCsv(text);
  if (!products.length) throw new Error("Catalog CSV produced zero products");
  return runPortfolio(products);
}

export function recheck(sku: string, extra: string[], csvText?: string) {
  const catalog = (csvText ? parseCsv(csvText) : demoProducts()).map((item) => ({ ...item, certifications: [...item.certifications] }));
  const target = catalog.find((item) => item.sku === sku);
  if (!target) throw new Error(`Unknown SKU ${sku}`);
  const before = runPortfolio(catalog);
  const merged = new Set(target.certifications.map((item) => item.toUpperCase()));
  extra.filter(Boolean).forEach((item) => merged.add(item.toUpperCase()));
  target.certifications = [...merged];
  const after = runPortfolio(catalog);
  const moved: Record<string, { before: string; after: string }> = {};
  for (const cell of after.matrix.filter((item) => item.sku === sku)) {
    const prev = before.matrix.find((item) => item.sku === sku && item.country === cell.country && item.platform === cell.platform);
    if (prev && prev.status !== cell.status) {
      moved[`${sku}|${cell.country}|${cell.platform}`] = { before: prev.status, after: cell.status };
    }
  }
  return { sku, added_certifications: extra.map((item) => item.toUpperCase()), certifications: target.certifications, moved, portfolio: after };
}

export function changeDemo(csvText?: string) {
  const products = csvText ? parseCsv(csvText) : demoProducts();
  const before = runPortfolio(products, false);
  const after = runPortfolio(products, true);
  const impactAfter: Record<string, string> = {};
  const impactBefore: Record<string, string> = {};
  const affected = new Set<string>();
  for (const cell of after.matrix) {
    const prev = before.matrix.find((item) => item.sku === cell.sku && item.country === cell.country && item.platform === cell.platform);
    if (prev && prev.status !== cell.status) {
      const key = `${cell.sku}|${cell.country}|${cell.platform}`;
      impactBefore[key] = prev.status;
      impactAfter[key] = cell.status;
      affected.add(cell.sku);
    }
  }
  return {
    before: before.matrix,
    after: after.matrix,
    impact: {
      change_id: "id-sni-luminaires-2026-monitor",
      jurisdiction: "ID",
      effective_date: "2026-10-01",
      summary: "Monitored update to Indonesian luminaire SNI/IEC 60598 evidence. Lighting SKUs are re-evaluated; other categories are unchanged.",
      affected_skus: [...affected],
      before: impactBefore,
      after: impactAfter,
    },
  };
}
