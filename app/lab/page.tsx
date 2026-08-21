import { opportunities } from "@/lib/sample-data";

type LabPageProps = {
  searchParams: Promise<{ layout?: string }>;
};

export default async function LabPage({ searchParams }: LabPageProps) {
  const { layout = "classic" } = await searchParams;
  const shifted = layout === "shifted";

  return (
    <main className={`fixture-shell ${shifted ? "fixture-shifted" : "fixture-classic"}`}>
      <header className="fixture-header">
        <div>
          <span className="fixture-kicker">Public fixture · deterministic test source</span>
          <h1>Open opportunities</h1>
        </div>
        <span className="fixture-version">Layout {shifted ? "B · redesigned" : "A · baseline"}</span>
      </header>

      <section className="fixture-grid" data-layout-version={shifted ? "b" : "a"}>
        {opportunities.map((item) =>
          shifted ? (
            <article className="listing-v2" data-opportunity-id={item.id} key={item.id}>
              <div className="listing-v2-main">
                <p className="listing-v2-provider" data-field="provider">{item.provider}</p>
                <h2 data-field="opportunity-title">{item.title}</h2>
                <p data-field="opportunity-summary">{item.summary}</p>
                <div className="listing-v2-tags" data-field="tags">
                  {item.tags.map((tag) => <span key={tag}>{tag}</span>)}
                </div>
                <ul className="fixture-eligibility" data-field="eligibility">
                  {item.eligibility.map((rule) => <li key={rule}>{rule}</li>)}
                </ul>
              </div>
              <aside className="application-panel">
                <span data-field="opportunity-type">{item.opportunity_type}</span>
                <span>Applications close</span>
                <time data-field="closing-date" dateTime={item.deadline}>{formatDate(item.deadline)}</time>
                <span data-field="location">{item.location}</span>
                <strong data-field="support">{item.amount_text}</strong>
                <a data-field="source-link" href={item.source_url}>View source</a>
              </aside>
            </article>
          ) : (
            <article className="opportunity-card" data-opportunity-id={item.id} key={item.id}>
              <p className="provider" data-field="provider">{item.provider}</p>
              <h2 className="opportunity-title">{item.title}</h2>
              <p className="opportunity-summary">{item.summary}</p>
              <dl>
                <div><dt>Type</dt><dd className="opportunity-type">{item.opportunity_type}</dd></div>
                <div><dt>Deadline</dt><dd><time className="deadline" dateTime={item.deadline}>{formatDate(item.deadline)}</time></dd></div>
                <div><dt>Location</dt><dd className="location">{item.location}</dd></div>
                <div><dt>Support</dt><dd className="amount">{item.amount_text}</dd></div>
              </dl>
              <ul className="fixture-eligibility">
                {item.eligibility.map((rule) => <li key={rule}>{rule}</li>)}
              </ul>
              <div className="listing-v2-tags">
                {item.tags.map((tag) => <span key={tag}>{tag}</span>)}
              </div>
              <a className="source-link" href={item.source_url}>View source</a>
            </article>
          ),
        )}
      </section>
    </main>
  );
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(value));
}
