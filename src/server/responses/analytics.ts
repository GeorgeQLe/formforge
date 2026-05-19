export type AnalyticsResponse = {
  submittedAt: Date;
  completionTime: number | null;
};

export type DailySubmissionCount = {
  date: string;
  count: number;
};

export type ResponseAnalytics = {
  rangeDays: number;
  totalSubmissions: number;
  averageCompletionTime: number | null;
  completionRate: number;
  completionRateLabel: string;
  dailySubmissions: DailySubmissionCount[];
};

const MS_PER_DAY = 24 * 60 * 60 * 1000;

export function startOfUtcDay(date: Date) {
  return new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())
  );
}

export function formatUtcDateKey(date: Date) {
  return startOfUtcDay(date).toISOString().slice(0, 10);
}

export function getAnalyticsRangeStart(now: Date, rangeDays: number) {
  const today = startOfUtcDay(now);
  return new Date(today.getTime() - (rangeDays - 1) * MS_PER_DAY);
}

export function buildResponseAnalytics({
  responses,
  rangeDays,
  now = new Date(),
}: {
  responses: AnalyticsResponse[];
  rangeDays: number;
  now?: Date;
}): ResponseAnalytics {
  const rangeStart = getAnalyticsRangeStart(now, rangeDays);
  const countsByDate = new Map<string, number>();

  for (let index = 0; index < rangeDays; index += 1) {
    const date = new Date(rangeStart.getTime() + index * MS_PER_DAY);
    countsByDate.set(formatUtcDateKey(date), 0);
  }

  for (const response of responses) {
    const submittedDay = startOfUtcDay(response.submittedAt);
    if (submittedDay < rangeStart) continue;

    const key = formatUtcDateKey(submittedDay);
    if (!countsByDate.has(key)) continue;

    countsByDate.set(key, (countsByDate.get(key) ?? 0) + 1);
  }

  const completionTimes = responses
    .map((response) => response.completionTime)
    .filter((value): value is number => typeof value === "number" && value > 0);

  const averageCompletionTime =
    completionTimes.length > 0
      ? Math.round(
          completionTimes.reduce((total, value) => total + value, 0) /
            completionTimes.length
        )
      : null;

  return {
    rangeDays,
    totalSubmissions: responses.length,
    averageCompletionTime,
    completionRate: responses.length > 0 ? 100 : 0,
    completionRateLabel:
      "100% of stored responses are completed submissions; started-but-abandoned visits are not tracked yet.",
    dailySubmissions: Array.from(countsByDate, ([date, count]) => ({
      date,
      count,
    })),
  };
}
