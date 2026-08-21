"use client";

import { useMemo, useRef, useState } from "react";
import { ContractCore } from "@/components/contract-core";
import { StorySections } from "@/components/story-sections";
import {
  Alert,
  ArrowRight,
  ArrowUpRight,
  Calendar,
  Check,
  Clock,
  Grid,
  LinkIcon,
  Lock,
  Logo,
  MapPin,
  Pulse,
  Search,
  Shield,
  Spark,
  Spinner,
  Terminal,
  Wand,
} from "@/components/icons";
import { opportunities } from "@/lib/sample-data";
import { breakDeadlineExtraction, validateOpportunities } from "@/lib/validation";
import type { Opportunity } from "@/lib/opportunity";

type PipelineState = "healthy" | "degraded" | "repairing" | "recovered";
type View = "command" | "feed" | "evidence";

const stateCopy: Record<PipelineState, { label: string; eyebrow: string; detail: string }> = {
  healthy: {
    label: "Healthy",
    eyebrow: "Contract intact",
    detail: "All critical fields are complete and the ChanceMesh feed is current.",
  },
  degraded: {
    label: "Degraded",
    eyebrow: "Layout change detected",
    detail: "The redesigned card selector returned zero records even though the page still held four.",
  },
  repairing: {
    label: "Repairing",
    eyebrow: "Self-Healing evidence replay",
    detail: "Replaying the reviewed Bright Data repair against the same stable output contract.",
  },
  recovered: {
    label: "Recovered",
    eyebrow: "Canaries passed",
    detail: "The same Collector ID is returning the original schema. Failed inputs were replayed.",
  },
};

export function Dashboard() {
  const [state, setState] = useState<PipelineState>("healthy");
  const [view, setView] = useState<View>("command");
  const [query, setQuery] = useState("");
  const [activeType, setActiveType] = useState("all");
  const repairTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const baseline = useMemo(
    () => validateOpportunities(opportunities, { now: new Date("2026-08-21T12:00:00.000Z") }),
    [],
  );
  const broken = useMemo(
    () => validateOpportunities(breakDeadlineExtraction(opportunities), {
      baselineCount: opportunities.length,
      now: new Date("2026-08-21T12:00:00.000Z"),
    }),
    [],
  );
  const report = state === "degraded" || state === "repairing" ? broken : baseline;

  const filtered = opportunities.filter((item) => {
    const matchesQuery = `${item.title} ${item.provider} ${item.tags.join(" ")}`
      .toLowerCase()
      .includes(query.toLowerCase());
    return matchesQuery && (activeType === "all" || item.opportunity_type === activeType);
  });

  function runFailureDemo() {
    if (repairTimer.current) clearTimeout(repairTimer.current);
    setState("degraded");
    setView("evidence");
  }

  function repair() {
    setState("repairing");
    setView("command");
    repairTimer.current = setTimeout(() => {
      setState("recovered");
      setView("evidence");
    }, 2400);
  }

  function reset() {
    if (repairTimer.current) clearTimeout(repairTimer.current);
    setState("healthy");
    setView("command");
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <a className="brand" href="#top" aria-label="ScrapeGuard home">
          <Logo />
          <span>ScrapeGuard</span>
        </a>
        <div className="topbar-center">
          <span className={`status-dot ${state}`} />
          <span>{stateCopy[state].label}</span>
          <span className="separator">/</span>
          <code>c_mt2azieh279l3xt9lt</code>
        </div>
        <a className="github-link" href="https://github.com/mindofyaseen/scrapeguard" target="_blank" rel="noreferrer">
          GitHub <ArrowUpRight />
        </a>
      </header>

      <section className="hero" id="top">
        <div className="hero-copy">
          <div className="eyebrow"><Spark /> Built with Bright Data Scraper Studio</div>
          <h1>The web changes.<br /><span>Your data contract shouldn&apos;t.</span></h1>
          <p>
            ScrapeGuard detects silent extraction failures, asks Bright Data to repair the collector,
            verifies the fix on canaries, and restores the feed before users see a gap.
          </p>
          <div className="hero-actions">
            {state === "healthy" || state === "recovered" ? (
              <button className="button button-primary" onClick={runFailureDemo}>
                <Pulse /> Simulate layout change
              </button>
            ) : state === "degraded" ? (
              <button className="button button-danger" onClick={repair}>
                <Wand /> Replay verified repair
              </button>
            ) : (
              <button className="button button-primary" disabled>
                <Spinner /> Refactoring collector…
              </button>
            )}
            <a className="button button-secondary" href="/lab?layout=classic" target="_blank">
              Open public fixture <ArrowUpRight />
            </a>
          </div>
          <div className="proof-strip" aria-label="Verified implementation evidence">
            <span><i /> Real collector <code>c_mt2…lt</code></span>
            <span><i /> Recovery <strong>4 → 0 → 4</strong></span>
            <span><i /> Contract <strong>13 fields</strong></span>
          </div>
        </div>

        <aside className={`health-card ${state}`}>
          <div className="health-card-top">
            <div>
              <span className="card-label">Pipeline health</span>
              <strong>{stateCopy[state].eyebrow}</strong>
            </div>
            <ContractCore score={report.score} state={state} />
          </div>
          <p>{stateCopy[state].detail}</p>
          <div className="metric-row">
            <Metric label="Records" value={state === "degraded" ? "0 / 4" : "4 / 4"} />
            <Metric label="Critical fields" value={state === "degraded" ? "0%" : "100%"} />
            <Metric label="Recovery" value={state === "recovered" ? "≈7 min" : "—"} />
          </div>
          <div className="run-track" aria-label="Pipeline stages">
            {[
              ["Collect", true],
              ["Validate", true],
              ["Heal", state === "repairing" || state === "recovered"],
              ["Canary", state === "recovered"],
              ["Replay", state === "recovered"],
            ].map(([label, active], index) => (
              <div className={`run-step ${active ? "active" : ""}`} key={String(label)}>
                <span>{active ? <Check /> : index + 1}</span><small>{label}</small>
              </div>
            ))}
          </div>
        </aside>
      </section>

      <section className="workspace">
        <nav className="tabs" aria-label="Product views">
          <button className={view === "command" ? "active" : ""} onClick={() => setView("command")}><Terminal /> Command center</button>
          <button className={view === "feed" ? "active" : ""} onClick={() => setView("feed")}><Grid /> ChanceMesh feed</button>
          <button className={view === "evidence" ? "active" : ""} onClick={() => setView("evidence")}><Shield /> Repair evidence</button>
          <div className="tab-spacer" />
          {state !== "healthy" && <button className="reset-button" onClick={reset}>Reset demo</button>}
        </nav>

        {view === "command" && <CommandCenter state={state} report={report} />}
        {view === "feed" && (
          <ChanceMesh
            records={filtered}
            query={query}
            setQuery={setQuery}
            activeType={activeType}
            setActiveType={setActiveType}
            stale={state === "degraded" || state === "repairing"}
          />
        )}
        {view === "evidence" && <Evidence state={state} onRepair={repair} />}
      </section>

      <StorySections />

      <section className="principles">
        <div><Shield /><strong>AI proposes. Contracts decide.</strong><span>No repair promotes itself.</span></div>
        <div><LinkIcon /><strong>One stable Collector ID.</strong><span>Downstream code never changes.</span></div>
        <div><Clock /><strong>Last-known-good continuity.</strong><span>Broken runs never erase trusted data.</span></div>
      </section>

      <footer>
        <span>ScrapeGuard · Into the Scrape-Verse 2026</span>
        <span>Public data only · Built from Codex with Bright Data</span>
      </footer>
    </main>
  );
}

function CommandCenter({ state, report }: { state: PipelineState; report: ReturnType<typeof validateOpportunities> }) {
  return (
    <div className="command-grid">
      <section className="panel checks-panel">
        <div className="panel-heading"><div><span className="card-label">Live contract</span><h2>Five deterministic gates</h2></div><span className={`mini-status ${report.passed ? "pass" : "fail"}`}>{report.passed ? "PASS" : "BREACH"}</span></div>
        <div className="check-list">
          {report.checks.map((check) => (
            <div className="check-row" key={check.id}>
              <span className={`check-icon ${check.passed ? "pass" : "fail"}`}>{check.passed ? <Check /> : <Alert />}</span>
              <div><strong>{check.label}</strong><small>{check.detail}</small></div>
              <span className="check-score">{check.score}%</span>
              <span className="score-track"><i style={{ width: `${check.score}%` }} /></span>
            </div>
          ))}
        </div>
      </section>

      <section className="panel terminal-panel">
        <div className="terminal-bar"><div><i /><i /><i /></div><span>Codex · Bright Data CLI</span><code>main</code></div>
        <pre aria-label="Bright Data command output"><code>{terminalCopy(state)}</code></pre>
      </section>
    </div>
  );
}

function Evidence({ state, onRepair }: { state: PipelineState; onRepair: () => void }) {
  const isBroken = state === "degraded" || state === "repairing";
  return (
    <div className="evidence-grid">
      <section className="panel incident-panel">
        <div className="panel-heading"><div><span className="card-label">Incident SG-0042</span><h2>Deadline extraction regression</h2></div><span className={`mini-status ${state === "recovered" ? "pass" : isBroken ? "fail" : "neutral"}`}>{state === "recovered" ? "RECOVERED" : isBroken ? "OPEN" : "READY"}</span></div>
        <div className="diff-block">
          <div><span>Before · Layout A</span><code>.opportunity-card .deadline</code><strong>23 Aug 2026</strong></div>
          <ArrowRight />
          <div className={isBroken ? "diff-broken" : ""}><span>After · Layout B</span><code>[data-field=&quot;closing-date&quot;]</code><strong>{isBroken ? "undefined" : "23 Aug 2026"}</strong></div>
        </div>
        <div className="prompt-box">
          <div><Wand /><strong>Evidence-bound repair prompt</strong><span>894 / 1000 chars</span></div>
          <p>Deadline completeness fell from 100% to 0%. The value moved under the label “Applications close” at <code>[data-field=&quot;closing-date&quot;]</code>. Preserve every existing output field name and type. Fix deadline extraction only.</p>
        </div>
        {state === "degraded" && <button className="button button-danger full" onClick={onRepair}><Wand /> Replay verified Self-Healing</button>}
      </section>

      <section className="panel canary-panel">
        <div className="panel-heading"><div><span className="card-label">Promotion policy</span><h2>Canary comparison</h2></div></div>
        <div className="canary-header"><span>Gate</span><span>Broken</span><span>Candidate</span></div>
        {[
          ["Schema", "0%", "100%"],
          ["Deadline completeness", "0%", "100%"],
          ["Record count", "4", "4"],
          ["Source provenance", "100%", "100%"],
        ].map(([label, before, after]) => (
          <div className="canary-row" key={label}><span>{label}</span><strong className="bad">{state === "healthy" ? after : before}</strong><strong className="good">{state === "recovered" ? after : "—"}</strong></div>
        ))}
        <div className={`promotion-box ${state === "recovered" ? "approved" : "waiting"}`}>
          {state === "recovered" ? <Check /> : <Lock />}
          <div><strong>{state === "recovered" ? "Candidate approved" : "Promotion locked"}</strong><span>{state === "recovered" ? "All gates passed · failed inputs replayed" : "A repair cannot promote until every canary passes"}</span></div>
        </div>
      </section>
    </div>
  );
}

function ChanceMesh({ records, query, setQuery, activeType, setActiveType, stale }: {
  records: Opportunity[];
  query: string;
  setQuery: (value: string) => void;
  activeType: string;
  setActiveType: (value: string) => void;
  stale: boolean;
}) {
  return (
    <section className="feed-view">
      <div className="feed-heading"><div><span className="card-label">Downstream product</span><h2>ChanceMesh</h2><p>Verified public opportunities, protected by a stable data contract.</p></div>{stale && <div className="stale-notice"><Clock /> Serving last-known-good data while repair runs</div>}</div>
      <div className="feed-controls">
        <label><Search /><input aria-label="Search opportunities" placeholder="Search opportunities…" value={query} onChange={(event) => setQuery(event.target.value)} /></label>
        <div className="type-filters">
          {["all", "hackathon", "grant", "scholarship", "program"].map((type) => <button className={activeType === type ? "active" : ""} key={type} onClick={() => setActiveType(type)}>{type}</button>)}
        </div>
      </div>
      <div className="opportunity-grid">
        {records.map((item) => <OpportunityCard item={item} key={item.id} />)}
      </div>
    </section>
  );
}

function OpportunityCard({ item }: { item: Opportunity }) {
  const days = Math.ceil((new Date(item.deadline).getTime() - new Date("2026-08-21T12:00:00.000Z").getTime()) / 86_400_000);
  return (
    <article className="chance-card">
      <div className="chance-top"><span className={`type-badge ${item.opportunity_type}`}>{item.opportunity_type}</span><span className="verified"><Check /> Source verified</span></div>
      <h3>{item.title}</h3><p className="chance-provider">{item.provider}</p><p>{item.summary}</p>
      <div className="chance-meta"><span><Calendar /> {formatDate(item.deadline)}</span><span><MapPin /> {item.location}</span></div>
      <div className="chance-footer"><strong>{days <= 3 ? `${days} days left` : item.amount_text}</strong><a href={item.source_url} target="_blank" rel="noreferrer">Source <ArrowUpRight /></a></div>
    </article>
  );
}

function Metric({ label, value }: { label: string; value: string }) { return <div><span>{label}</span><strong>{value}</strong></div>; }

function terminalCopy(state: PipelineState) {
  if (state === "healthy") return `$ bdata scraper run c_mt2azieh279l3xt9lt https://…/lab?layout=classic --pretty\n\n✓ Collector completed · 4 records\n✓ Contract score · 100/100\n✓ Snapshot persisted · source provenance intact`;
  if (state === "degraded") return `$ bdata scraper run c_mt2azieh279l3xt9lt https://…/lab?layout=shifted --pretty\n\n⚠ Run completed with 0 records\n✕ Volume baseline · expected 4, received 0\n✕ Health score · 0/100\n→ Incident SG-0042 opened · last-known-good retained`;
  if (state === "repairing") return `$ bdata scraper heal c_mt2azieh279l3xt9lt "Fix deadline extraction…"\n\n◌ collector_maintainer · running\n◌ code_generator · polling\n◌ preview_runner · waiting\n\nSame Collector ID · downstream contract locked`;
  return `$ bdata scraper run c_mt2azieh279l3xt9lt https://…/lab?layout=shifted --pretty\n\n✓ Candidate preview · 4 / 4 records\n✓ Canary contract · 100/100\n✓ Same Collector ID · c_mt2azieh279l3xt9lt\n✓ Failed inputs replayed · incident recovered`;
}

function formatDate(value: string) { return new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" }).format(new Date(value)); }
