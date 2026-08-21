# Submission checklist

Deadline: **23 August 2026, 8:00 p.m. BST** — **24 August 2026, 12:00 a.m. PKT**. Do not plan to use the final hour.

## Required evidence

- [x] Public GitHub repository
- [x] Real, incremental commit history started during the hackathon
- [x] Clear README and architecture diagram
- [x] Example structured-output contract
- [x] Working responsive product UI
- [x] Repeatable layout-change fixture
- [x] Automated validation tests and production build
- [ ] Real Scraper Studio Collector ID (`c_…`) in the repo evidence
- [ ] Saved baseline and shifted-layout CLI outputs
- [ ] Accepted Self-Healing diff or clearly documented repair run
- [ ] Public deployment URL
- [ ] Demo video, maximum three minutes
- [ ] Final Google Form submission

## Three-minute recording shot list

| Time | Show | Say |
|---|---|---|
| 0:00–0:20 | Healthy dashboard + ChanceMesh | Scrapers often fail silently; ScrapeGuard protects the data contract. |
| 0:20–0:45 | Architecture in README | Scraper Studio extracts; deterministic gates decide; last-known-good keeps serving. |
| 0:45–1:15 | CLI baseline run + Collector ID | This is a custom collector created and driven from the coding agent. |
| 1:15–1:40 | Switch fixture A → B | The source layout changed; deadline disappeared; health fell and incident opened. |
| 1:40–2:15 | Self-Healing prompt/diff/run | Bright Data repaired the same collector; ScrapeGuard did not trust it automatically. |
| 2:15–2:40 | Canary passes + recovered feed | Contract is restored and failed inputs replay without changing downstream code. |
| 2:40–3:00 | Tests, repo, closing | Clean code, responsive UI, public data, and a reproducible failure story. |

## Form-ready draft

**Team name:** ScrapeGuard (replace if desired)

**Tracks:** Best Use of Bright Data; Best UI; Best Clean Code

**What does the project do?**

ScrapeGuard prevents silent web-scraping regressions from reaching users. It validates every structured output against schema, completeness, semantic, volume and freshness gates; retains the last-known-good snapshot when a run fails; supplies evidence to Bright Data Self-Healing; and promotes the repaired collector only after canary verification. ChanceMesh demonstrates the protected data powering a useful opportunity-discovery feed.

**How is Scraper Studio used?**

We created a custom Scraper Studio collector for public opportunity pages and drove it from Codex through the Bright Data CLI. The same collector runs against deterministic baseline and changed-layout fixtures. When deadline extraction breaks, its failure evidence becomes a narrow Self-Healing prompt; the repaired candidate must return the original structured schema on canaries before ScrapeGuard accepts it and replays failed inputs.

## Participant must be able to explain

- Why a successful HTTP/CLI run can still be a data failure.
- What each Zod field means and why `deadline` is critical.
- How the weighted health score is calculated and why 80 is the promotion threshold.
- Difference between Scraper Studio interaction code, parsing code and output schema.
- Why last-known-good data is safer than replacing the feed with a broken run.
- Why AI proposes a repair but deterministic gates make the promotion decision.
- Where the Bright Data token lives and why it is never client-visible.

## Final manual actions

1. Verify the deployed link in an incognito window.
2. Confirm the GitHub repository is public and the README images/links render.
3. Upload the video as public or unlisted YouTube and check its duration.
4. Submit the Google Form once; save a confirmation screenshot.
5. Optional: publish a LinkedIn build post tagging WeMakeDevs and Bright Data.
