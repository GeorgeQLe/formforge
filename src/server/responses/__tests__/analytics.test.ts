import { describe, expect, it } from "vitest";
import {
  buildResponseAnalytics,
  formatUtcDateKey,
  getAnalyticsRangeStart,
} from "@/server/responses/analytics";

describe("response analytics", () => {
  const now = new Date("2026-05-18T16:00:00.000Z");

  it("builds zero-filled UTC day buckets for the requested range", () => {
    const analytics = buildResponseAnalytics({
      now,
      rangeDays: 4,
      responses: [
        { submittedAt: new Date("2026-05-15T23:59:00.000Z"), completionTime: 20 },
        { submittedAt: new Date("2026-05-17T01:00:00.000Z"), completionTime: 40 },
        { submittedAt: new Date("2026-05-17T22:00:00.000Z"), completionTime: 60 },
      ],
    });

    expect(analytics.dailySubmissions).toEqual([
      { date: "2026-05-15", count: 1 },
      { date: "2026-05-16", count: 0 },
      { date: "2026-05-17", count: 2 },
      { date: "2026-05-18", count: 0 },
    ]);
  });

  it("ignores responses before the analytics range for day counts", () => {
    const analytics = buildResponseAnalytics({
      now,
      rangeDays: 2,
      responses: [
        { submittedAt: new Date("2026-05-15T12:00:00.000Z"), completionTime: 10 },
        { submittedAt: new Date("2026-05-18T12:00:00.000Z"), completionTime: 20 },
      ],
    });

    expect(analytics.dailySubmissions).toEqual([
      { date: "2026-05-17", count: 0 },
      { date: "2026-05-18", count: 1 },
    ]);
    expect(analytics.totalSubmissions).toBe(2);
  });

  it("averages positive completion times and returns null when none exist", () => {
    expect(
      buildResponseAnalytics({
        now,
        rangeDays: 7,
        responses: [
          { submittedAt: now, completionTime: 12 },
          { submittedAt: now, completionTime: 13 },
          { submittedAt: now, completionTime: null },
        ],
      }).averageCompletionTime
    ).toBe(13);

    expect(
      buildResponseAnalytics({
        now,
        rangeDays: 7,
        responses: [{ submittedAt: now, completionTime: null }],
      }).averageCompletionTime
    ).toBeNull();
  });

  it("documents completion-rate semantics from stored response data", () => {
    const empty = buildResponseAnalytics({ now, rangeDays: 7, responses: [] });
    const populated = buildResponseAnalytics({
      now,
      rangeDays: 7,
      responses: [{ submittedAt: now, completionTime: 30 }],
    });

    expect(empty.completionRate).toBe(0);
    expect(populated.completionRate).toBe(100);
    expect(populated.completionRateLabel).toContain(
      "started-but-abandoned visits are not tracked"
    );
  });

  it("uses stable UTC date boundaries", () => {
    expect(formatUtcDateKey(new Date("2026-05-18T23:59:59.000Z"))).toBe(
      "2026-05-18"
    );
    expect(getAnalyticsRangeStart(now, 7).toISOString()).toBe(
      "2026-05-12T00:00:00.000Z"
    );
  });
});
