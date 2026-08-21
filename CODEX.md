# ScrapeGuard agent context

The project uses one custom Bright Data Scraper Studio collector. Reuse it across sessions.

```text
SCRAPER_STUDIO_COLLECTOR_ID=<set after `bdata scraper create`>
SCRAPER_STUDIO_USAGE=npx -p @brightdata/cli bdata scraper run <collector_id> <url> --pretty
```

Never commit Bright Data API tokens or unredacted terminal output. The Collector ID is safe to document after creation.
