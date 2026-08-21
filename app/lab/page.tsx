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
                <p className="listing-v2-provider">{item.provider}</p>
                <h2 data-field="opportunity-title">{item.title}</h2>
                <p data-field="opportunity-summary">{item.summary}</p>
                <div className="listing-v2-tags">
                  {item.tags.map((tag) => <span key={tag}>{tag}</span>)}
                </div>
              </div>
              <aside className="application-panel">
                <span>Applications close</span>
                <strong data-field="closing-date">{formatDate(item.deadline)}</strong>
                <span>{item.location}</span>
                <a data-field="source-link" href={item.source_url}>View source</a>
              </aside>
            </article>
          ) : (
            <article className="opportunity-card" data-opportunity-id={item.id} key={item.id}>
              <p className="provider">{item.provider}</p>
              <h2 className="opportunity-title">{item.title}</h2>
              <p className="opportunity-summary">{item.summary}</p>
              <dl>
                <div><dt>Deadline</dt><dd className="deadline">{formatDate(item.deadline)}</dd></div>
                <div><dt>Location</dt><dd className="location">{item.location}</dd></div>
                <div><dt>Support</dt><dd className="amount">{item.amount_text}</dd></div>
              </dl>
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
