import type { ReactNode } from "react";
import {
  Alert,
  ArrowRight,
  ArrowUpRight,
  Check,
  Clock,
  Grid,
  LinkIcon,
  Pulse,
  Shield,
  Terminal,
  Wand,
} from "@/components/icons";

const stages = [
  { icon: LinkIcon, label: "Collect", title: "Pull public web data", detail: "One custom Scraper Studio collector turns changing pages into a stable opportunity schema." },
  { icon: Pulse, label: "Validate", title: "Score every output", detail: "Schema, completeness, semantics, volume and freshness gates evaluate each run." },
  { icon: Alert, label: "Isolate", title: "Contain the breach", detail: "Broken runs open an incident while users continue receiving the last-known-good snapshot." },
  { icon: Wand, label: "Heal", title: "Repair with evidence", detail: "A narrow Bright Data prompt fixes only the failed behavior on the same Collector ID." },
  { icon: Shield, label: "Promote", title: "Canaries make the call", detail: "Both layouts must pass the complete contract before the candidate can be trusted." },
];

const timeline = [
  { code: "RUN 01", title: "Baseline established", detail: "Layout A · 4 records · 13 required fields", tone: "pass" },
  { code: "RUN 02", title: "Silent regression caught", detail: "Layout B · command succeeded · output []", tone: "fail" },
  { code: "HEAL 01", title: "Candidate rejected", detail: "Count restored, but 2 contract fields were missing", tone: "warn" },
  { code: "HEAL 02", title: "Narrow repair approved", detail: "summary + opportunity_type restored", tone: "active" },
  { code: "CANARY", title: "Dual-layout verification", detail: "Layout A 4/4 · Layout B 4/4 · promoted", tone: "pass" },
];

export function StorySections() {
  return (
    <>
      <section className="story-section section-wrap">
        <SectionHeading
          kicker="The recovery loop"
          title={<>One pipeline. Five decisions.<br /><span>Zero silent failures.</span></>}
          copy="ScrapeGuard is not another scraper UI. It is the control plane between an unstable website and every product that depends on its data."
        />
        <div className="process-grid">
          {stages.map((stage, index) => {
            const StageIcon = stage.icon;
            return (
              <article className="process-card" key={stage.label}>
                <div className="process-index">0{index + 1}</div>
                <span className="process-icon"><StageIcon /></span>
                <span className="card-label">{stage.label}</span>
                <h3>{stage.title}</h3>
                <p>{stage.detail}</p>
                {index < stages.length - 1 && <span className="process-connector"><ArrowRight /></span>}
              </article>
            );
          })}
        </div>
      </section>

      <section className="failure-showcase">
        <div className="failure-inner">
          <div className="failure-copy">
            <span className="inverse-kicker"><Alert /> A real failure, not a mock response</span>
            <h2>Same data.<br />Different DOM.<br /><span>Nothing returned.</span></h2>
            <p>The collector command completed successfully after the page redesign—but returned an empty array. ScrapeGuard treated that successful command as a failed data product.</p>
            <div className="failure-facts">
              <div><small>Collector</small><code>c_mt2azieh279l3xt9lt</code></div>
              <div><small>Observed output</small><code>[]</code></div>
              <div><small>Volume gate</small><code>4 → 0</code></div>
            </div>
          </div>

          <div className="layout-stage" aria-label="Visual comparison of the two fixture layouts">
            <div className="mock-window baseline-window">
              <div className="mock-bar"><i /><i /><i /><span>Layout A · baseline</span></div>
              <div className="mock-page">
                <small>WEMAKEDEVS × BRIGHT DATA</small>
                <strong>Into the Scrape-Verse</strong>
                <p>Build a self-healing web scraper.</p>
                <dl><div><dt>Deadline</dt><dd>23 Aug 2026</dd></div><div><dt>Location</dt><dd>Online</dd></div></dl>
                <code>.opportunity-card .deadline</code>
              </div>
              <span className="window-result pass"><Check /> 4 records</span>
            </div>

            <div className="layout-shift-arrow"><ArrowRight /><span>DOM shift</span></div>

            <div className="mock-window shifted-window">
              <div className="mock-bar"><i /><i /><i /><span>Layout B · redesigned</span></div>
              <div className="mock-page shifted-page">
                <div><small>WEMAKEDEVS × BRIGHT DATA</small><strong>Into the Scrape-Verse</strong><p>Build a self-healing web scraper.</p></div>
                <aside><span>Applications close</span><b>23 Aug 2026</b><small>Online</small></aside>
                <code>[data-field=&quot;closing-date&quot;]</code>
              </div>
              <span className="window-result fail"><Alert /> 0 records</span>
            </div>
          </div>

          <div className="recovery-rail">
            <div className="rail-stage complete"><span><Check /></span><div><small>Baseline</small><strong>4 records</strong></div></div>
            <i />
            <div className="rail-stage failed"><span><Alert /></span><div><small>Regression</small><strong>0 records</strong></div></div>
            <i />
            <div className="rail-stage repaired"><span><Wand /></span><div><small>Self-Healing</small><strong>2 reviewed repairs</strong></div></div>
            <i />
            <div className="rail-stage complete"><span><Shield /></span><div><small>Recovered</small><strong>4 + 4 canaries</strong></div></div>
          </div>
        </div>
      </section>

      <section className="evidence-section section-wrap">
        <SectionHeading
          kicker="Proof over promises"
          title={<>Every repair leaves<br /><span>a verification receipt.</span></>}
          copy="The first repair looked convincing and still failed the full contract. ScrapeGuard rejected it, narrowed the evidence, and tested again."
        />
        <div className="evidence-layout">
          <div className="incident-timeline">
            {timeline.map((item, index) => (
              <article className={`timeline-event ${item.tone}`} key={item.code}>
                <div className="timeline-marker"><span>{index + 1}</span></div>
                <div><code>{item.code}</code><h3>{item.title}</h3><p>{item.detail}</p></div>
                <span className="timeline-state">{item.tone === "pass" ? <Check /> : item.tone === "fail" ? <Alert /> : item.tone === "warn" ? <Clock /> : <Wand />}</span>
              </article>
            ))}
          </div>

          <aside className="receipt-card">
            <div className="receipt-top"><div><i /><i /><i /></div><span>verification-receipt.json</span><Shield /></div>
            <pre><code>{`{
  "collector_id": "c_mt2azieh279l3xt9lt",
  "same_collector": true,
  "classic": {
    "records": 4,
    "missing_fields": []
  },
  "shifted": {
    "records": 4,
    "missing_fields": []
  },
  "title_sets_equal": true,
  "deadline_complete": true,
  "promotion": "approved"
}`}</code></pre>
            <div className="receipt-seal"><Check /><div><strong>Contract verified</strong><span>13 fields · two layouts · one Collector ID</span></div></div>
          </aside>
        </div>
      </section>

      <section className="architecture-section section-wrap">
        <div className="architecture-heading">
          <span className="card-label">System architecture</span>
          <h2>Built around the contract,<br />not around a selector.</h2>
          <p>Bright Data handles collection and repair. ScrapeGuard owns validation, continuity and promotion. ChanceMesh proves the output remains useful.</p>
        </div>
        <div className="architecture-map">
          <div className="arch-node source-node"><span>01</span><LinkIcon /><small>Public sources</small><strong>Changing HTML</strong></div>
          <div className="arch-line"><i /><ArrowRight /></div>
          <div className="arch-node bright-node"><span>02</span><Terminal /><small>Bright Data</small><strong>Custom collector</strong><code>c_mt2…lt</code></div>
          <div className="arch-line"><i /><ArrowRight /></div>
          <div className="arch-node core-node"><span>03</span><Shield /><small>ScrapeGuard</small><strong>Five gates</strong><em>Schema · Meaning · Volume</em></div>
          <div className="arch-line"><i /><ArrowRight /></div>
          <div className="arch-node product-node"><span>04</span><Grid /><small>ChanceMesh</small><strong>Trusted feed</strong><em>Last-known-good continuity</em></div>
          <div className="repair-loop"><Wand /><span>Evidence-bound repair loop</span><i /></div>
        </div>
      </section>

      <section className="tracks-section section-wrap">
        <div className="tracks-intro">
          <span className="card-label">One project · three tracks</span>
          <h2>Designed to be judged<br />from every angle.</h2>
        </div>
        <div className="track-cards">
          <article className="track-card web-slinger">
            <div className="track-number">01</div><Terminal />
            <span>Web-Slinger</span><h3>Best use of Bright Data</h3>
            <ul><li><Check /> Custom Scraper Studio collector</li><li><Check /> Driven from Codex through CLI</li><li><Check /> Real failure + reviewed Self-Healing</li></ul>
            <strong>Platform depth</strong>
          </article>
          <article className="track-card suit-up">
            <div className="track-number">02</div><Grid />
            <span>Suit-Up</span><h3>Best UI</h3>
            <ul><li><Check /> State-aware 3D contract core</li><li><Check /> Responsive product dashboard</li><li><Check /> Visual failure and recovery story</li></ul>
            <strong>Finished product</strong>
          </article>
          <article className="track-card spider-sense">
            <div className="track-number">03</div><Shield />
            <span>Spider-Sense</span><h3>Best clean code</h3>
            <ul><li><Check /> Strict TypeScript + Zod contract</li><li><Check /> Deterministic tests + CI</li><li><Check /> Secure server boundary + docs</li></ul>
            <strong>Monday-ready repo</strong>
          </article>
        </div>
      </section>

      <section className="closing-section section-wrap">
        <div className="closing-orbit"><i /><i /><i /><Shield /></div>
        <span className="card-label">Try the failure yourself</span>
        <h2>Break the page.<br /><span>Keep the contract.</span></h2>
        <p>Both layouts are public, deterministic and ready for inspection. The evidence is in the repo, not hidden behind a demo video.</p>
        <div className="closing-actions">
          <a className="button button-primary" href="/lab?layout=classic" target="_blank">Open Layout A <ArrowUpRight /></a>
          <a className="button button-secondary" href="/lab?layout=shifted" target="_blank">Open Layout B <ArrowUpRight /></a>
          <a className="button button-secondary" href="https://github.com/mindofyaseen/scrapeguard" target="_blank" rel="noreferrer">Inspect the code <ArrowUpRight /></a>
        </div>
      </section>
    </>
  );
}

function SectionHeading({ kicker, title, copy }: { kicker: string; title: ReactNode; copy: string }) {
  return (
    <div className="section-heading">
      <span className="card-label">{kicker}</span>
      <h2>{title}</h2>
      <p>{copy}</p>
    </div>
  );
}
