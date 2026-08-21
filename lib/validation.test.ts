import { describe, expect, it } from "vitest";
import { opportunities } from "./sample-data";
import { breakDeadlineExtraction, validateOpportunities } from "./validation";

const now = new Date("2026-08-21T12:00:00.000Z");

describe("validateOpportunities", () => {
  it("accepts a healthy dataset", () => {
    const report = validateOpportunities(opportunities, {
      baselineCount: opportunities.length,
      now,
    });

    expect(report.passed).toBe(true);
    expect(report.score).toBe(100);
    expect(report.invalidRecords).toBe(0);
  });

  it("detects a silent deadline extraction regression", () => {
    const report = validateOpportunities(breakDeadlineExtraction(opportunities), {
      baselineCount: opportunities.length,
      now,
    });

    expect(report.passed).toBe(false);
    expect(report.checks.find((check) => check.id === "schema")?.passed).toBe(false);
    expect(report.invalidRecords).toBe(opportunities.length);
  });

  it("rejects stale data even when its shape is valid", () => {
    const stale = opportunities.map((record) => ({
      ...record,
      collected_at: "2026-08-01T10:00:00.000Z",
    }));
    const report = validateOpportunities(stale, { now });

    expect(report.checks.find((check) => check.id === "freshness")?.passed).toBe(false);
  });
});
