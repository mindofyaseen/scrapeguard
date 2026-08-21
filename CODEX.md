# ScrapeGuard agent context

The project uses one custom Bright Data Scraper Studio collector. Reuse it across sessions.

```text
SCRAPER_STUDIO_COLLECTOR_ID=c_mt2azieh279l3xt9lt
SCRAPER_STUDIO_USAGE=npx -p @brightdata/cli bdata scraper run c_mt2azieh279l3xt9lt <url> --pretty
```

Never commit Bright Data API tokens or unredacted terminal output. The Collector ID is safe to document after creation.
