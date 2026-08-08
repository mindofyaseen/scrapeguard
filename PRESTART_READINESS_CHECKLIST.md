# Prestart Readiness Checklist

Complete before implementation begins. Items marked PARTICIPANT require the user or team.

## Event and eligibility

- [ ] PARTICIPANT: Every team member registered.
- [ ] PARTICIPANT: Every person belongs to one team only.
- [ ] PARTICIPANT: Exact official start time and timezone confirmed.
- [ ] PARTICIPANT: Exact submission deadline/timezone confirmed.
- [ ] PARTICIPANT: Submission platform and demo-video limit confirmed.
- [ ] PARTICIPANT: Official community/support channel joined.
- [ ] Written confirmation/FAQ saved locally.
- [x] Main implementation deliberately not started.
- [x] Planning files are clearly dated and labeled pre-hackathon.

## Bright Data account

- [ ] PARTICIPANT: Bright Data account created and email verified.
- [ ] PARTICIPANT: Scraper Studio visible in dashboard.
- [ ] PARTICIPANT: CLI login tested on a non-project tutorial if desired.
- [ ] PARTICIPANT: API token creation/access understood.
- [ ] PARTICIPANT: Self-Healing/API availability confirmed for the account.
- [ ] PARTICIPANT: Billing/free-credit status checked.
- [ ] PARTICIPANT: Support asked about hackathon credits if unclear.
- [x] CLI/API/Self-Healing documentation mapped.

## Source compliance

- [ ] PARTICIPANT: Organizer approves low-volume WeMakeDevs-page collection or provides guidance.
- [ ] Robots/terms reviewed again on build day.
- [ ] Target URL list bounded and documented.
- [ ] No login, paywall, personal, private, or restricted data.
- [ ] Source-link attribution and removal process prepared.
- [x] Grants.gov identified as API-first supplemental source, not flagship scraper.
- [x] Synthetic fixture planned for deterministic repeated testing.

## Team readiness

- [ ] PARTICIPANT: Solo/team decision final.
- [ ] PARTICIPANT: Availability for 17-23 August written down.
- [ ] PARTICIPANT: Role ownership assigned.
- [ ] Daily standup/demo time agreed.
- [ ] Shared communication channel prepared.
- [ ] Every member reads the learning guide.
- [ ] Every member passes the readiness questions.

## Accounts and tooling

- [x] Public GitHub repository exists.
- [x] Pre-event planning commit is clearly labeled.
- [ ] PARTICIPANT: Deployment account ready.
- [ ] PARTICIPANT: Database provider account ready if used.
- [ ] PARTICIPANT: Screen recorder and microphone tested.
- [ ] PARTICIPANT: Backup recording location has space.
- [ ] Password manager/environment-secret workflow agreed.

## Day-zero evidence

Do after official start only:

- [ ] Screenshot/save official start announcement.
- [ ] Create first implementation issue/milestone.
- [ ] Commit README skeleton, license, AI disclosure, and `.env.example`.
- [ ] Create competition collector through Codex + Bright Data CLI.
- [ ] Save terminal evidence with secrets masked.
- [ ] Record Collector ID in environment/project configuration.
- [ ] Commit redacted sample output.
- [ ] Start decision log and daily progress log.

## Questions to send organizers

```text
Hi, we are planning a project for Into the Scrape-Verse and will begin all
implementation after the official start. Could you confirm:

1. Exact start and submission time, including timezone.
2. Submission platform and demo-video maximum length.
3. Whether each team member must register separately.
4. Whether low-volume collection of public WeMakeDevs hackathon pages is
   acceptable for our custom Scraper Studio collector.
5. Whether hackathon Bright Data credits or special Scraper Studio/API access
   will be provided.
6. Whether programmatic use of the AI Flow/Self-Healing API is expected or
   whether IDE/CLI healing is equally eligible.

We will retain source links, avoid private/login-protected/personal data, and
use a synthetic public fixture for repeated failure testing.
```
