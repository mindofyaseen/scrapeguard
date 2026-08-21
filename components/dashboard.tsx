"use client";

import { useMemo, useRef, useState } from "react";
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
    detail: "Deadline completeness collapsed after the source moved its application panel.",
  },
  repairing: {
    label: "Repairing",
    eyebrow: "Bright Data Self-Healing",
    detail: "The collector is being refactored against the same stable output contract.",
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
          <code>c_pending</code>
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
                <Wand /> Heal with Bright Data
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
        </div>

        <aside className={`health-card ${state}`}>
          <div className="health-card-top">
            <div>
              <span className="card-label">Pipeline health</span>
              <strong>{stateCopy[state].eyebrow}</strong>
            </div>
            <HealthRing score={report.score} />
          </div>
          <p>{stateCopy[state].detail}</p>
          <div className="metric-row">
            <Metric label="Records" value={state === "degraded" ? "0 / 4" : "4 / 4"} />
            <Metric label="Critical fields" value={state === "degraded" ? "67%" : "100%"} />
            <Metric label="Recovery" value={state === "recovered" ? "2m 41s" : "—"} />
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
        {state === "degraded" && <button className="button button-danger full" onClick={onRepair}><Wand /> Start Self-Healing</button>}
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

function HealthRing({ score }: { score: number }) {
  return <div className="health-ring" style={{ "--score": `${score * 3.6}deg` } as React.CSSProperties}><span>{score}</span><small>/100</small></div>;
}

function Metric({ label, value }: { label: string; value: string }) { return <div><span>{label}</span><strong>{value}</strong></div>; }

function terminalCopy(state: PipelineState) {
  if (state === "healthy") return `$ bdata scraper run c_pending https://…/lab?layout=classic --pretty\n\n✓ Collector completed · 4 records\n✓ Contract score · 100/100\n✓ Snapshot persisted · source provenance intact`;
  if (state === "degraded") return `$ bdata scraper run c_pending https://…/lab?layout=shifted --pretty\n\n⚠ 4 records rejected by output schema\n✕ deadline · expected ISO date, received undefined\n✕ Health score · 0/100\n→ Incident SG-0042 opened · last-known-good retained`;
  if (state === "repairing") return `$ bdata scraper heal c_pending "Fix deadline extraction…"\n\n◌ collector_maintainer · running\n◌ code_generator · polling\n◌ preview_runner · waiting\n\nSame Collector ID · downstream contract locked`;
  return `$ bdata scraper run c_pending https://…/lab?layout=shifted --pretty\n\n✓ Candidate preview · 4 / 4 records\n✓ Canary contract · 100/100\n✓ Same Collector ID · c_pending\n✓ Failed inputs replayed · incident recovered`;
}

function formatDate(value: string) { return new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" }).format(new Date(value)); }

function Icon({ children, viewBox = "0 0 24 24" }: { children: React.ReactNode; viewBox?: string }) { return <svg aria-hidden="true" viewBox={viewBox} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{children}</svg>; }
const Logo = () => <svg aria-hidden="true" className="logo" viewBox="0 0 38 38"><path d="M19 2 34 10.5v17L19 36 4 27.5v-17L19 2Z" fill="currentColor"/><path d="m13 19 4 4 8-9" fill="none" stroke="var(--ink)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>;
const ArrowUpRight = () => <Icon><path d="M7 17 17 7M7 7h10v10" /></Icon>;
const ArrowRight = () => <Icon><path d="M5 12h14m-5-5 5 5-5 5" /></Icon>;
const Spark = () => <Icon><path d="m12 3 1.4 4.6L18 9l-4.6 1.4L12 15l-1.4-4.6L6 9l4.6-1.4L12 3Zm6 11 .8 2.2L21 17l-2.2.8L18 20l-.8-2.2L15 17l2.2-.8L18 14Z" /></Icon>;
const Pulse = () => <Icon><path d="M3 12h4l2-7 4 14 2-7h6" /></Icon>;
const Wand = () => <Icon><path d="m15 4 5 5L9 20H4v-5L15 4Zm-2-2v3M21 11h-3M19 3l-2 2" /></Icon>;
const Check = () => <Icon><path d="m6 12 4 4 8-9" /></Icon>;
const Alert = () => <Icon><path d="M12 9v4m0 4h.01M10 3 2.5 18a2 2 0 0 0 1.8 3h15.4a2 2 0 0 0 1.8-3L14 3a2.2 2.2 0 0 0-4 0Z" /></Icon>;
const Terminal = () => <Icon><path d="m5 7 4 4-4 4m6 0h7" /><rect x="2" y="3" width="20" height="18" rx="2" /></Icon>;
const Grid = () => <Icon><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></Icon>;
const Shield = () => <Icon><path d="M12 3 20 6v6c0 5-3.4 8-8 10-4.6-2-8-5-8-10V6l8-3Z"/><path d="m8 12 2.5 2.5L16 9"/></Icon>;
const LinkIcon = () => <Icon><path d="M10 13a5 5 0 0 0 7.5.5l2-2a5 5 0 0 0-7-7l-1.2 1.2M14 11a5 5 0 0 0-7.5-.5l-2 2a5 5 0 0 0 7 7l1.2-1.2" /></Icon>;
const Clock = () => <Icon><circle cx="12" cy="12" r="9"/><path d="M12 7v6l4 2"/></Icon>;
const Lock = () => <Icon><rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></Icon>;
const Search = () => <Icon><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></Icon>;
const Calendar = () => <Icon><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18"/></Icon>;
const MapPin = () => <Icon><path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/></Icon>;
const Spinner = () => <Icon><path d="M21 12a9 9 0 1 1-6.2-8.6"/></Icon>;
