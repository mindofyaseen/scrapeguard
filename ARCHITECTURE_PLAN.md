# ScrapeGuard Architecture Plan

Status: pre-event architecture and diagrams only. Implementation begins after the official start.

## 1. System context

```mermaid
flowchart LR
    Student["Student / developer"] --> ChanceMesh["ChanceMesh opportunity feed"]
    Operator["Data operator"] --> Console["ScrapeGuard reliability console"]
    Codex["Codex coding agent"] --> CLI["Bright Data CLI"]
    CLI --> Studio["Bright Data Scraper Studio"]
    Sources["Approved public websites"] --> Studio
    Studio --> Core["ScrapeGuard application"]
    Core --> ChanceMesh
    Core --> Console
    Core --> Heal["Bright Data Self-Healing API"]
    Heal --> Studio
```

The opportunity feed proves downstream value. The reliability console proves why Bright Data's custom collector and Self-Healing are central.

## 2. Container architecture

```mermaid
flowchart TB
    subgraph Client["Browser"]
        Feed["ChanceMesh feed"]
        Ops["Reliability console"]
    end

    subgraph App["ScrapeGuard application"]
        Web["Next.js web/API"]
        Jobs["Persisted job orchestrator"]
        Validator["Contract validator"]
        Prompt["Repair prompt builder"]
        Canary["Canary evaluator"]
    end

    subgraph Data["Application data"]
        DB[("PostgreSQL")]
        Evidence[("Redacted evidence/output store")]
    end

    subgraph Bright["Bright Data"]
        Collector["Custom Scraper Studio collector"]
        Collection["Collection API"]
        SelfHeal["AI Flow / Self-Healing API"]
    end

    Public["Approved public pages"] --> Collector
    Feed --> Web
    Ops --> Web
    Web --> DB
    Web --> Jobs
    Jobs --> Collection
    Collection --> Collector
    Collection --> Jobs
    Jobs --> Validator
    Validator --> DB
    Validator -->|breach| Prompt
    Prompt --> SelfHeal
    SelfHeal --> Jobs
    Jobs --> Canary
    Canary -->|pass| Collection
    Jobs --> Evidence
```

## 3. Golden collection sequence

```mermaid
sequenceDiagram
    actor O as Operator
    participant A as ScrapeGuard
    participant B as Bright Data Collection API
    participant C as Custom Collector
    participant D as Contract Validator
    participant DB as Database

    O->>A: Start collection
    A->>B: Trigger collector with bounded inputs
    B-->>A: Snapshot/job ID
    B->>C: Execute custom scraper
    C-->>B: Structured records
    A->>B: Poll/fetch dataset
    B-->>A: Dataset and errors
    A->>D: Validate run against contract/baseline
    D-->>A: Pass with metrics
    A->>DB: Persist records, run, metrics, provenance
    A-->>O: Healthy run
```

## 4. Break-to-heal sequence

```mermaid
sequenceDiagram
    participant S as Source site
    participant C as Bright Data collector
    participant A as ScrapeGuard
    participant V as Validator
    participant H as Self-Healing API
    participant O as Operator

    S-->>C: Layout B with moved deadline field
    C-->>A: Records with missing deadline
    A->>V: Validate output
    V-->>A: Critical completeness regression
    A->>A: Open incident and preserve last-known-good data
    A->>H: Trigger refactor with field-level evidence
    loop asynchronous progress
        A->>H: Poll progress
        H-->>A: running / pending_answer / done
    end
    alt approval requested
        A-->>O: Show proposed diff and evidence
        O->>A: Approve or reject
        A->>H: Resume decision
    end
    A->>C: Run repaired collector on canaries
    C-->>A: Candidate output
    A->>V: Compare candidate with contract and baseline
    alt canaries pass
        V-->>A: Safe to promote
        A->>C: Replay failed inputs
        A-->>O: Recovered with audit trail
    else canaries fail
        V-->>A: Reject repair
        A-->>O: Human review; last-known-good remains active
    end
```

## 5. Repair state machine

```mermaid
stateDiagram-v2
    [*] --> Healthy
    Healthy --> Running: trigger
    Running --> Validating: dataset ready
    Running --> TimedOut: timeout
    Running --> RateLimited: 429
    Validating --> Healthy: contract pass
    Validating --> Degraded: contract breach
    Degraded --> RepairRequested: policy permits
    Degraded --> HumanReview: repair not permitted
    RepairRequested --> Repairing
    Repairing --> AwaitingApproval: pending_answer
    AwaitingApproval --> Repairing: approve/resume
    AwaitingApproval --> HumanReview: reject
    Repairing --> CanaryTesting: candidate ready
    Repairing --> RepairFailed: terminal error
    CanaryTesting --> Replaying: all gates pass
    CanaryTesting --> HumanReview: any gate fails
    Replaying --> Recovered: failed inputs restored
    Recovered --> Healthy
    RepairFailed --> HumanReview
    TimedOut --> Running: bounded retry
    RateLimited --> Running: backoff
```

## 6. Data model

```mermaid
erDiagram
    SOURCE ||--o{ COLLECTOR : uses
    COLLECTOR ||--o{ COLLECTOR_VERSION : has
    COLLECTOR_VERSION ||--o{ COLLECTION_RUN : executes
    COLLECTION_RUN ||--o{ RECORD : produces
    COLLECTION_RUN ||--|| HEALTH_REPORT : evaluated_by
    HEALTH_REPORT ||--o| INCIDENT : opens
    INCIDENT ||--o{ REPAIR_ATTEMPT : has
    REPAIR_ATTEMPT ||--o{ CANARY_RESULT : verifies
    SOURCE ||--o{ OPPORTUNITY : publishes
    RECORD }o--|| OPPORTUNITY : normalizes_to

    SOURCE {
      uuid id PK
      string name
      string base_url
      string compliance_status
      datetime checked_at
    }
    COLLECTOR {
      uuid id PK
      string bright_data_collector_id
      uuid source_id FK
      string status
    }
    COLLECTOR_VERSION {
      uuid id PK
      uuid collector_id FK
      string remote_version
      boolean last_known_good
      datetime created_at
    }
    COLLECTION_RUN {
      uuid id PK
      uuid collector_version_id FK
      string snapshot_id
      string status
      datetime started_at
      datetime completed_at
    }
    HEALTH_REPORT {
      uuid id PK
      uuid collection_run_id FK
      number score
      json checks
      boolean passed
    }
    INCIDENT {
      uuid id PK
      uuid health_report_id FK
      string state
      string reason
      datetime opened_at
      datetime recovered_at
    }
    REPAIR_ATTEMPT {
      uuid id PK
      uuid incident_id FK
      string bright_data_job_id
      string status
      string prompt_hash
      datetime started_at
    }
    CANARY_RESULT {
      uuid id PK
      uuid repair_attempt_id FK
      string input_hash
      number before_score
      number after_score
      boolean passed
    }
    RECORD {
      uuid id PK
      uuid collection_run_id FK
      string source_url
      string fingerprint
      json raw_normalized
    }
    OPPORTUNITY {
      uuid id PK
      uuid source_id FK
      string source_url
      string title
      datetime deadline
      string type
      datetime collected_at
    }
```

## 7. Deployment options

### Preferred

```mermaid
flowchart LR
    User["User browser"] --> Vercel["Next.js on Vercel"]
    Vercel --> Postgres[("Managed PostgreSQL")]
    Vercel --> Worker["Small background worker"]
    Worker --> Bright["Bright Data APIs"]
    Worker --> Postgres
    Bright --> Public["Public sources"]
```

Use when Self-Healing polling and replay exceed normal request duration.

### Simplified fallback

```mermaid
flowchart LR
    User["User/operator"] --> App["Next.js serverless app"]
    App --> DB[("SQLite/PostgreSQL")]
    App --> Bright["Bright Data APIs"]
    User -->|refresh/resume| App
```

Use persisted state and operator-triggered progress checks. This is acceptable for a hackathon if the whole recovery loop remains genuine and auditable.

## 8. Module boundaries

| Module | Owns | Must not own |
|---|---|---|
| Bright Data client | Authenticated API calls, response mapping, backoff | Business validation thresholds |
| Run orchestrator | Idempotent workflow transitions | HTML extraction logic |
| Contract validator | Deterministic checks and score | API polling |
| Repair policy | Whether/when to heal and approve | Rendering UI |
| Prompt builder | Concise evidence-based prompt | Deciding that output is correct |
| Repository layer | Persistence and transactions | HTTP calls |
| Feed service | Querying trusted opportunity records | Triggering repairs |
| UI | Status, evidence, actions | Hidden workflow state |

## 9. Validation gates

```mermaid
flowchart LR
    A["Candidate dataset"] --> B{"Schema valid?"}
    B -->|no| R["Reject"]
    B -->|yes| C{"Critical completeness >= threshold?"}
    C -->|no| R
    C -->|yes| D{"Record count within tolerance?"}
    D -->|no| R
    D -->|yes| E{"Semantic checks pass?"}
    E -->|no| R
    E -->|yes| F{"All canaries improve or remain stable?"}
    F -->|no| R
    F -->|yes| P["Promote and replay"]
```

No LLM score can bypass these gates.

## 10. Security boundaries

- API tokens stay server-side and are read from environment variables.
- Logs store masked IDs/tokens; UI receives only safe identifiers.
- Public source HTML is untrusted input.
- Extracted text is data, never executable prompt instructions.
- Repair prompts are built from bounded fields and sanitized evidence.
- Never expose arbitrary target URL execution to unauthenticated users in the MVP.
- Allowlist approved domains and cap inputs/page loads.
- Store prompt hashes and redacted prompts for audit, not secrets.
- Apply server-side authorization to repair approval actions if authentication is added.

## 11. Observability

Minimum structured events:

- `collection.triggered`
- `collection.completed`
- `collection.failed`
- `validation.completed`
- `incident.opened`
- `repair.triggered`
- `repair.progressed`
- `repair.awaiting_approval`
- `canary.completed`
- `repair.rejected`
- `replay.completed`
- `incident.recovered`

Every event includes correlation ID, source ID, safe collector ID, snapshot/job ID where applicable, state, duration, and reason.

## 12. Architecture acceptance criteria

- Bright Data is required for the golden path.
- Last-known-good data survives a failed run.
- Repeated webhook/poll responses do not duplicate records or transitions.
- A repair cannot auto-promote without deterministic canaries.
- All external calls have timeout, retry/backoff policy, and structured errors.
- The demo can recover after refresh/restart because workflow state is persisted.
- Every displayed opportunity retains source URL and collection provenance.
