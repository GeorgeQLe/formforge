export type RateLimitEntry = {
  count: number;
  resetAt: number;
};

export type RateLimitStore = Map<string, RateLimitEntry>;

export type RateLimitOptions = {
  key: string;
  limit: number;
  windowMs: number;
  store?: RateLimitStore;
  now?: () => number;
};

export type RateLimitResult = {
  allowed: boolean;
  limit: number;
  remaining: number;
  resetAt: number;
};

const defaultStore: RateLimitStore = new Map();

export function checkRateLimit({
  key,
  limit,
  windowMs,
  store = defaultStore,
  now = Date.now,
}: RateLimitOptions): RateLimitResult {
  const currentTime = now();
  const entry = store.get(key);

  if (!entry || currentTime >= entry.resetAt) {
    const resetAt = currentTime + windowMs;
    store.set(key, { count: 1, resetAt });

    return {
      allowed: true,
      limit,
      remaining: Math.max(limit - 1, 0),
      resetAt,
    };
  }

  const nextCount = entry.count + 1;
  entry.count = nextCount;

  return {
    allowed: nextCount <= limit,
    limit,
    remaining: Math.max(limit - nextCount, 0),
    resetAt: entry.resetAt,
  };
}

export function getClientIp(request: Request): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip")?.trim() ||
    "unknown"
  );
}

export function resetRateLimitStore(store: RateLimitStore = defaultStore) {
  store.clear();
}
