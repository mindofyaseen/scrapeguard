# Judging and Demo Playbook

## 1. Judge memory sentence

> ScrapeGuard detects when a public-data collector silently stops honoring its contract, uses Bright Data Self-Healing to repair it, verifies the repair on canaries, and restores the downstream ChanceMesh feed without trusting AI blindly.

## 2. Rubric plan

| Criterion | Claim | Evidence |
|---|---|---|
| Potential impact | Missed deadlines can cost people real opportunities | Near-deadline item disappears during failure and returns after recovery |
| Creativity | Reliability control plane over self-healing collectors | Incident, repair policy, canary gate, replay, audit trail |
| Technical excellence | Safe asynchronous state machine | Typed contracts, idempotency, backoff, last-known-good, tests |
| Scraper Studio use | Bright Data is the indispensable execution/healing core | Custom collector, CLI from Codex, Collection API, AI Flow API |
| Reliability/self-healing | Failure is detected and actually repaired | Layout switch, broken output, refactor, canaries, restored snapshot |
| Presentation | Judges understand the story in two minutes | Tight narration, visible metrics, source provenance, backup recording |

## 3. Demo storyboard

### 0:00-0:15 - Hook

"This scholarship closes tomorrow. The source page is online, but a layout change made its deadline disappear from our data. That is worse than a crash because nobody knows the feed is wrong."

### 0:15-0:35 - Bright Data proof

- Show Codex terminal command invoking the custom Bright Data collector.
- Briefly show Collector ID and healthy JSON.
- Show the same opportunity in ChanceMesh.

### 0:35-0:55 - Break

- Switch the fixture from Layout A to Layout B.
- Re-run unchanged collector.
- Show deadline completeness collapse and health score breach.

### 0:55-1:25 - Heal

- Show incident evidence and precise repair prompt.
- Show genuine Self-Healing job/diff/progress evidence.
- Explain that last-known-good data remains available.

### 1:25-1:50 - Trust gate

- Show canary before/after scores.
- Demonstrate that schema, completeness, semantics, and record-count gates pass.
- State that AI output cannot promote itself.

### 1:50-2:10 - Recovery

- Replay failed inputs.
- Show restored feed with same downstream schema and audit timeline.

### 2:10-2:20 - Close

"Websites change. Your data contract should not. ScrapeGuard makes Bright Data collectors repairable, testable, and safe to trust."

If the official video limit is two minutes, shorten the hook and remove the separate architecture explanation. Put architecture in README.

## 4. Required visual evidence

- Bright Data branding only where attribution permits; do not imply endorsement.
- Collector ID (safe) and masked token.
- Real structured output.
- Health score with named failed checks.
- Repair prompt and progress/diff.
- Canary comparison.
- Recovery time and replayed record count.
- Source link and collection timestamp.

## 5. Backup plan

- Record one complete genuine recovery before final video production.
- Keep a local MP4 and cloud copy.
- Keep redacted JSON/evidence in the repository.
- Rehearse live flow three times.
- If Self-Healing is slow during judging, show the already-completed incident, then trigger a new job only as supplemental proof.
- Never mock a successful API response and present it as real.

## 6. Likely judge questions

### Is this just a wrapper around Bright Data?

No. Bright Data provides custom collection and AI-assisted refactoring. ScrapeGuard adds contract-based detection, repair policy, last-known-good continuity, deterministic canary approval, failed-input replay, and a useful downstream product.

### Why is Bright Data necessary?

Without Scraper Studio, the project loses custom collector generation/execution, managed access infrastructure, structured datasets, stable collector operation, and the Self-Healing refactor workflow. These are the core of the demonstrated loop.

### Why not use an API?

Use an official API when it provides the required data. The flagship source is chosen where a custom web scraper adds value. Grants.gov is deliberately supplemental because it already exposes appropriate APIs.

### How do you know a field is wrong rather than legitimately absent?

Checks are source-aware. They compare schema, source-specific required fields, completeness baseline, record distribution, and representative canaries. Ambiguous cases route to human review.

### Can Self-Healing damage good fields?

Yes, which is why the candidate runs on multiple canaries and must preserve or improve every critical gate before promotion. The last-known-good version remains available.

### How do you handle private data?

The system allows only approved public domains and fields. It does not accept login-protected, paywalled, personal, or restricted sources.

### What did AI build?

Disclose every AI tool. Bright Data's AI Agent generates/refactors collector logic. Codex assists development. Participants own the architecture, requirements, validation policy, integration, testing, verification, and final technical decisions.

## 7. README proof order

1. 15-second failure/recovery GIF.
2. One-sentence value proposition.
3. Problem and user.
4. Bright Data integration diagram.
5. Demo/video/deployment links.
6. Break-to-heal evidence.
7. Data contract and sample output.
8. Architecture and state machine.
9. Setup and tests.
10. Reliability/security/compliance.
11. AI disclosure.
12. Known limitations and future work.

## 8. Scoring self-review

Score each item 0-3 at end of every event day:

- 0: absent
- 1: planned/partial
- 2: working but weak evidence
- 3: working, polished, and clearly demonstrated

Do not add new stretch features while any grand-prize criterion remains below 2.
