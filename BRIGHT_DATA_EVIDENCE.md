# Bright Data implementation evidence

This document records the real Scraper Studio workflow used by ScrapeGuard on 21 August 2026. Tokens and account identifiers are intentionally excluded.

## Collector

- Name: `scrapeguard-opportunity-contract`
- Collector ID: `c_mt2azieh279l3xt9lt`
- Public baseline: `https://scrapeguard-eight.vercel.app/lab?layout=classic`
- Public changed layout: `https://scrapeguard-eight.vercel.app/lab?layout=shifted`
- Created and driven from Codex with Bright Data CLI `0.3.5`

## Reproducible commands

```bash
npx -p @brightdata/cli bdata login

npx -p @brightdata/cli bdata scraper create \
  "https://scrapeguard-eight.vercel.app/lab?layout=classic" \
  "Extract one flat structured opportunity record per public card..." \
  --name scrapeguard-opportunity-contract --pretty

npx -p @brightdata/cli bdata scraper run c_mt2azieh279l3xt9lt \
  "https://scrapeguard-eight.vercel.app/lab?layout=classic" --pretty

npx -p @brightdata/cli bdata scraper run c_mt2azieh279l3xt9lt \
  "https://scrapeguard-eight.vercel.app/lab?layout=shifted" --pretty

npx -p @brightdata/cli bdata scraper heal c_mt2azieh279l3xt9lt \
  "Layout regression: the collector returns [] on the redesigned page although four public opportunities remain..." \
  --url "https://scrapeguard-eight.vercel.app/lab?layout=shifted" --pretty
```

The actual commands used full evidence-bound prompts. Local raw envelopes are stored under the gitignored `bright-data-output/` directory so account-adjacent run metadata is not published accidentally.

## What happened

| Stage | Layout A | Layout B | Decision |
|---|---:|---:|---|
| Generated collector | Wrong nested wrappers | Not tested | Reject output contract |
| Baseline contract repair | 4 records, 13 required fields | 0 records | Detect real layout regression |
| First layout repair | 4 records, 13 fields | 4 records, 11 fields | Reject: `summary` and `opportunity_type` missing |
| Narrow two-field repair | 4 records, 13 fields | 4 records, 13 fields | Promote |

This was not a prerecorded fake response. Bright Data returned a technically successful Layout B run with `[]`; ScrapeGuard's volume gate treated it as a failure. The first repair restored record count and deadlines but still failed the complete contract. A second narrow prompt repaired only the rejected fields.

## Final canary result

```json
{
  "shifted_count": 4,
  "classic_count": 4,
  "shifted_missing_required_fields": [],
  "classic_missing_required_fields": [],
  "title_sets_equal": true,
  "shifted_deadlines_complete": true,
  "classic_deadlines_complete": true
}
```

Required fields: `id`, `title`, `provider`, `summary`, `opportunity_type`, `deadline`, `location`, `remote`, `amount_text`, `eligibility`, `tags`, `source_url`, `collected_at`.

Bright Data also attaches an `input` metadata object to each collected record. Zod accepts the record and strips this extra transport field before downstream use.

## Self-Healing review discipline

Each heal stopped at `awaiting_approval`. The preview envelope was reviewed for field names, values and types before `bdata scraper approve --auto-save` was used. After saving, both changed-layout and original-layout runs were repeated. This is the concrete implementation of the product rule:

> AI proposes. Contracts decide.
