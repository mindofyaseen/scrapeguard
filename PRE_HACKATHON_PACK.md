# Scrape-Verse Pre-Hackathon Pack

This document contains planning and research only. It is not implementation work.

## 1. Product definition

### Working identity

- Reliability engine: **ScrapeGuard**
- End-user showcase: **ChanceMesh**
- Tagline: **The web changes. Your data contract should not.**
- Category: autonomous scraper reliability plus public-opportunity discovery

The names are provisional. A final collision/domain check must be repeated before public launch. "Opportunity Radar" was rejected because several active products already use it.

### Problem

Public opportunities are scattered across websites with inconsistent layouts. A conventional scraper may continue reporting success while critical fields such as deadline, eligibility, or funding silently disappear. Users cannot distinguish "no opportunity" from "broken extraction."

### Solution

ScrapeGuard wraps a custom Bright Data Scraper Studio collector in explicit data contracts. It measures output health, opens a repair incident, uses Bright Data Self-Healing, verifies the repaired collector on canaries, and replays failed inputs. ChanceMesh shows the recovered data in a useful, source-linked feed.

### Primary user

A student or early-career developer looking for legitimate public hackathons, grants, scholarships, and programs without checking many websites every day.

### Operator user

A small community or program team that needs a reliable public-data feed without manually maintaining selectors.

## 2. Scope contract

### P0: required to submit

- Custom Bright Data Scraper Studio collector.
- Collector created/run from Codex using Bright Data CLI.
- Normalized structured output with source provenance.
- Useful ChanceMesh feed.
- Deterministic broken-layout fixture.
- Contract validation and incident timeline.
- Bright Data Self-Healing evidence.
- Canary validation and replay.
- Public repository, README, example JSON, deployment, demo video, AI disclosure.

### P1: important polish

- Before/after comparison.
- Responsive and accessible UI.
- Last-known-good dataset.
- Repair approval state machine.
- Cost and run statistics.
- Three consecutive successful demo rehearsals.

### P2: only if ahead of schedule

- Email digest.
- Saved searches.
- Multiple operator workspaces.
- Additional source types.
- AI summaries of opportunity descriptions.

### Cut order

Cut P2 first, then extra real sources, then automatic approval. Never cut the useful feed, custom collector, visible failure, self-heal evidence, deterministic validation, or presentation quality.

## 3. Source strategy

### Tier A: intended real source

**WeMakeDevs public hackathon pages**

- Strong thematic connection to the event.
- Public, structured event content: title, dates, format, prizes, themes, rules, and links.
- Listing-to-detail flow demonstrates a multi-stage custom collector.
- The organizer can immediately understand the extracted data.
- Before use, confirm robots/terms and ask the event support channel whether repeated demo collection is acceptable.

### Tier A: deterministic demonstration source

**Our synthetic public fixture site, created after the hackathon starts**

- Contains fictional opportunities only.
- Layout A matches the initial collector.
- Layout B changes nesting, labels, attributes, lazy loading, and a field location without changing meaning.
- Optional Layout C returns an HTTP 200 "not found" template to exercise dead-page detection.
- Guarantees a reproducible live demonstration without stressing a third-party source.

### Tier B: possible supplemental source

**Grants.gov public opportunity pages**

- Authoritative public source with clear provenance.
- However, Grants.gov already offers an unrestricted search API for some opportunity data. It should be a supplemental comparison or validation source, not the flagship Bright Data target; otherwise judges may reasonably ask why scraping is necessary.
- If its API data is displayed, include the required non-endorsement attribution and do not misrepresent modified content.

### Tier C: evaluate during kickoff

- Other official community or university opportunity pages.
- Use only pages with public access and acceptable terms/robots guidance.
- Avoid commercial aggregators, job boards, social networks, login flows, and sites containing personal profiles.

### Source approval checklist

- Public without authentication.
- No paywall or restricted content.
- No personal/sensitive fields.
- Collection purpose is compatible with published terms.
- Robots guidance reviewed.
- Low request volume and bounded URLs.
- Direct source link retained.
- Timestamp and collector/snapshot provenance retained.
- Removal/contact process documented.

## 4. Requirements and acceptance tests

### Collector

- Given a supported listing URL, returns at least five structured records where available.
- Follows listing-to-detail pages using stages where useful.
- Provides stable field names and types.
- Reports page-level failures instead of silently swallowing them.
- Uses Bright Data platform retries rather than a custom same-session retry loop.

### Validation

- Rejects a record without title or source URL.
- Flags missing deadline/funding according to source-specific expectations.
- Flags invalid URLs/dates and duplicate records.
- Detects a material record-count or critical-field completeness drop.
- Produces deterministic reasons and metrics, not only an LLM opinion.

### Healing

- Generates a prompt naming the broken fields, expected contract, representative URL, and observed error.
- Tracks Self-Healing job state.
- Does not promote a repair until canaries pass.
- Preserves the last known good version/data.
- Limits repair attempts and exposes human review when confidence is insufficient.

### Product

- Feed loads from real structured collector output.
- Every fact links back to its public source.
- Users can search/filter and sort by deadline.
- Freshness and source status are visible.
- A broken current run cannot erase the last known good feed without warning.

## 5. Architecture decisions already made

- TypeScript end to end to reduce seven-day context switching.
- Next.js for application and deployment speed.
- PostgreSQL plus Drizzle if setup is ready; SQLite fallback for a single-demo deployment.
- Zod for deterministic runtime contracts.
- Database-backed job state rather than adding Redis/queues prematurely.
- Bright Data CLI for the visible Codex workflow.
- Collection API for application runs.
- AI Flow/Self-Healing API for repairs.
- Vitest for contracts/state-machine tests.
- Playwright for the golden demo journey.

### Deferred decisions

- Exact hosting provider and background-worker placement.
- Automatic versus operator-approved promotion, depending on API behavior.
- Final real sources after kickoff/support confirmation.
- Authentication: omit unless essential.

## 6. Repair state machine

```text
HEALTHY
  -> RUNNING
  -> VALIDATING
  -> HEALTHY                         on pass
  -> DEGRADED                        on contract breach
  -> REPAIR_REQUESTED
  -> REPAIRING
  -> CANARY_TESTING
  -> AWAITING_APPROVAL               when human gate is enabled
  -> REPLAYING
  -> RECOVERED
  -> HEALTHY

Failure branches:
REPAIRING/CANARY_TESTING -> REPAIR_FAILED -> HUMAN_REVIEW
Any state -> RATE_LIMITED/TIMED_OUT -> bounded retry or HUMAN_REVIEW
```

Every transition must be idempotent and recorded with timestamp, reason, run ID, collector ID/version, and metrics.

## 7. Demo evidence to capture during the event

- Terminal recording of Codex invoking Bright Data CLI.
- Collector ID creation output.
- Scraper Studio custom interaction/parser code.
- Healthy structured output sample.
- Layout switch commit/deployment.
- Broken collection output.
- Contract failure metrics.
- Self-Healing request and progress.
- Proposed diff or repaired collector evidence.
- Canary comparison.
- Replayed snapshot and restored feed.
- Test run and deployed product.

## 8. Judge-question preparation

### Why not use CSS fallback selectors?

Fallbacks help with anticipated variations. They do not handle unanticipated redesigns, semantic movement, or entirely new extraction paths. ScrapeGuard detects contract failure and uses Bright Data to propose an updated collector, then verifies it.

### Why not scrape with Playwright directly?

The project relies on Scraper Studio for custom scraper generation, managed browser/proxy/unblocking infrastructure, job execution, structured datasets, and self-healing. Reimplementing those layers would weaken the product and the sponsor integration.

### Is the system truly automatic?

Detection, diagnosis, repair request, progress tracking, canary testing, and replay are automated. Promotion may intentionally require human approval when evidence is insufficient. Safety is a feature, not a missing automation step.

### How do you prevent hallucinated repairs?

The LLM-generated change is never trusted by itself. Deterministic schema, completeness, semantic, distribution, and canary checks decide whether it is safe.

### What if Bright Data Self-Healing is slow?

The product is asynchronous. It preserves last-known-good data, shows progress, and uses a completed real incident for the short judging video. The live demo has a deterministic backup recording.

### Is the fixture fake evidence?

No. It is a controlled public test source used to reproduce a real class of layout failure. The collector, failure, Self-Healing request, validation, and recovery are genuine. A real third-party source separately proves practical collection.

## 9. Risk register

| Risk | Probability | Impact | Mitigation |
|---|---:|---:|---|
| Self-Healing takes too long for live demo | High | High | Completed real incident plus short recording; never fake API results |
| API requires approval/manual acceptance | Medium | High | Human-gated promotion; automate surrounding workflow |
| Third-party source blocks or changes | Medium | High | Bounded real source plus controlled fixture |
| Seven-day over-scope | High | High | Enforce P0/P1/P2 and cut order |
| Silent bad values pass schema checks | Medium | High | Semantic and distribution checks plus provenance |
| Auto-repair worsens collector | Medium | High | Canaries, last-known-good version, bounded attempts |
| Serverless timeout | Medium | Medium | Persisted async state and external/small worker fallback |
| API token appears in logs/video | Medium | Critical | Redaction, secret scan, masked terminal, rehearsal review |
| Source terms are unclear | Medium | High | Ask organizer/source, switch to approved source/fixture |
| Brand name collision | Medium | Low | Repeat exact-name/domain check before launch |
| Team member cannot explain code | Medium | High | Daily architecture walkthrough and decision log |
| Submission rushed | Medium | High | Feature freeze Day 6, submit early Day 7 |

## 10. Seven-day operating rhythm

- Start each day with a 15-minute scope/risk check.
- Keep one golden end-to-end path working from Day 2 onward.
- Merge in small commits with meaningful messages.
- End every day with a recorded 60-second progress demo.
- Update README and decision log while building, not at the end.
- Freeze features by the end of Day 5.
- Day 6 is presentation and reliability.
- Day 7 is submission buffer only.

### Suggested roles for a four-person team

- Person A: Bright Data collector, CLI/API, Self-Healing.
- Person B: validation engine, state machine, database.
- Person C: ChanceMesh UI, accessibility, visual polish.
- Person D: testing, deployment, README, demo production, compliance.

For fewer people, combine A+B and C+D. Every member still reviews the whole architecture.

## 11. User-only prerequisites

These cannot be completed safely without the participant:

- Register every participant using accurate personal information.
- Confirm each person is on only one team.
- Join the official community/support channel.
- Create or verify the Bright Data account.
- Confirm Scraper Studio and Self-Healing/API access on the account.
- Confirm whether a payment method is required for the chosen API path.
- Decide solo versus team and record availability for 17-23 August.
- Ask organizers for the exact start/end time and timezone, submission platform, video-length limit, and whether the proposed real source is acceptable.

Suggested organizer message:

> Hi, we are planning a project for Into the Scrape-Verse and will begin all implementation after the official start. Could you confirm the exact start/end time and timezone, submission platform, demo-video time limit, and whether low-volume collection of public WeMakeDevs hackathon pages is acceptable for a custom Scraper Studio collector? We will retain source links, avoid personal/login-protected data, and use a synthetic public fixture for repeated failure testing.

## 12. Day-zero launch checklist

Run only after the official start is confirmed:

1. Record the official start timestamp/source.
2. Create public repository and initial rules-compliant commit.
3. Add license, README skeleton, AI disclosure, and environment example.
4. Authenticate Bright Data CLI.
5. Create the custom collector and save its ID.
6. Run it from Codex and commit redacted sample output.
7. Create application scaffold and CI.
8. Open the decision log with actual technical choices.

## 13. Research notes

- Grants.gov offers public search/fetch APIs. It is therefore not a strong flagship scraping target, but its public data and explicit attribution rules make it a possible supplemental source.
- Bright Data recommends platform-level retries rather than custom same-session retry loops.
- Bright Data Self-Healing produces a code diff that should be reviewed and previewed before saving to production.
- The Bright Data CLI runs through `npx -p @brightdata/cli` and works in Codex.
- The coding agent invokes the CLI; Bright Data's AI Agent generates/refactors the scraper. Our claims and AI disclosure must preserve this distinction.

## 14. Official research links

- https://www.wemakedevs.org/hackathons/scrape-verse
- https://www.wemakedevs.org/hackathons/scrape-verse/rules
- https://docs.brightdata.com/datasets/scraper-studio/build-with-the-cli
- https://docs.brightdata.com/datasets/scraper-studio/coding-agent-prompts
- https://docs.brightdata.com/datasets/scraper-studio/self-healing-tool
- https://docs.brightdata.com/datasets/scraper-studio/best-practices
- https://docs.brightdata.com/datasets/scraper-studio/quickstart
- https://docs.brightdata.com/api-reference/scraper-studio-api/ai-flow/overview
- https://www.grants.gov/api
- https://www.grants.gov/api/terms-conditions

