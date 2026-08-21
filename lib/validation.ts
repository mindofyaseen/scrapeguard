import { opportunitySchema, type HealthReport, type Opportunity, type ValidationCheck } from "./opportunity";

type ValidationOptions = {
  expectedMinimum?: number;
  baselineCount?: number;
  now?: Date;
};

const weights = {
  schema: 30,
  completeness: 25,
  semantics: 20,
  volume: 15,
  freshness: 10,
} as const;

export function validateOpportunities(
  input: unknown[],
  options: ValidationOptions = {},
): HealthReport {
  const now = options.now ?? new Date();
  const parsed = input.map((record) => opportunitySchema.safeParse(record));
  const validRecords = parsed.flatMap((result) => (result.success ? [result.data] : []));
  const schemaRatio = input.length === 0 ? 0 : validRecords.length / input.length;

  const criticalComplete = validRecords.filter(
    (record) => record.title && record.deadline && record.source_url,
  ).length;
  const completenessRatio = validRecords.length === 0 ? 0 : criticalComplete / validRecords.length;

  const semanticValid = validRecords.filter((record) => {
    const deadline = new Date(record.deadline);
    return deadline > now && record.source_url.startsWith("https://");
  }).length;
  const semanticRatio = validRecords.length === 0 ? 0 : semanticValid / validRecords.length;

  const expectedMinimum = options.expectedMinimum ?? 1;
  const baselineCount = options.baselineCount ?? Math.max(expectedMinimum, input.length);
  const volumeRatio = Math.min(1, validRecords.length / Math.max(expectedMinimum, baselineCount * 0.7));

  const freshRecords = validRecords.filter((record) => {
    const ageHours = (now.getTime() - new Date(record.collected_at).getTime()) / 3_600_000;
    return ageHours <= 48;
  }).length;
  const freshnessRatio = validRecords.length === 0 ? 0 : freshRecords / validRecords.length;

  const checks: ValidationCheck[] = [
    makeCheck("schema", "Schema integrity", schemaRatio, "records match the stable output contract"),
    makeCheck("completeness", "Critical completeness", completenessRatio, "title, deadline and source URL are present"),
    makeCheck("semantics", "Semantic validity", semanticRatio, "deadlines are upcoming and sources use HTTPS"),
    makeCheck("volume", "Volume baseline", volumeRatio, "record count remains within the expected range"),
    makeCheck("freshness", "Freshness", freshnessRatio, "records were collected in the last 48 hours"),
  ];

  const score = Math.round(
    checks.reduce((total, check) => total + (check.score / 100) * weights[check.id], 0),
  );

  return {
    score,
    passed: score >= 80 && checks.every((check) => check.id === "freshness" || check.passed),
    validRecords,
    invalidRecords: input.length - validRecords.length,
    checks,
  };
}

function makeCheck(
  id: ValidationCheck["id"],
  label: string,
  ratio: number,
  detail: string,
): ValidationCheck {
  const score = Math.round(Math.max(0, Math.min(1, ratio)) * 100);
  return { id, label, score, passed: score >= 80, detail };
}

export function breakDeadlineExtraction(records: Opportunity[]): unknown[] {
  return records.map(({ deadline: _deadline, ...record }) => ({
    ...record,
    applications_close: "Moved into a redesigned panel",
  }));
}
