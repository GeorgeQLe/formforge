import { describe, expect, it } from "vitest";
import { checkRateLimit, getClientIp, type RateLimitStore } from "../rate-limit";

describe("checkRateLimit", () => {
  it("allows requests within the limit and reports remaining quota", () => {
    const store: RateLimitStore = new Map();

    expect(
      checkRateLimit({
        key: "submit:form-1:203.0.113.10",
        limit: 2,
        windowMs: 60_000,
        store,
        now: () => 1_000,
      })
    ).toMatchObject({ allowed: true, remaining: 1, resetAt: 61_000 });

    expect(
      checkRateLimit({
        key: "submit:form-1:203.0.113.10",
        limit: 2,
        windowMs: 60_000,
        store,
        now: () => 2_000,
      })
    ).toMatchObject({ allowed: true, remaining: 0, resetAt: 61_000 });
  });

  it("blocks requests after the limit", () => {
    const store: RateLimitStore = new Map();
    const options = {
      key: "ai-generate:user-1",
      limit: 1,
      windowMs: 60_000,
      store,
      now: () => 1_000,
    };

    expect(checkRateLimit(options).allowed).toBe(true);
    expect(checkRateLimit(options)).toMatchObject({
      allowed: false,
      remaining: 0,
      resetAt: 61_000,
    });
  });

  it("resets after the window expires", () => {
    const store: RateLimitStore = new Map();

    expect(
      checkRateLimit({
        key: "submit:form-1:203.0.113.10",
        limit: 1,
        windowMs: 60_000,
        store,
        now: () => 1_000,
      }).allowed
    ).toBe(true);
    expect(
      checkRateLimit({
        key: "submit:form-1:203.0.113.10",
        limit: 1,
        windowMs: 60_000,
        store,
        now: () => 61_000,
      }).allowed
    ).toBe(true);
  });

  it("tracks separate keys independently", () => {
    const store: RateLimitStore = new Map();

    expect(
      checkRateLimit({
        key: "submit:form-1:203.0.113.10",
        limit: 1,
        windowMs: 60_000,
        store,
        now: () => 1_000,
      }).allowed
    ).toBe(true);
    expect(
      checkRateLimit({
        key: "submit:form-1:203.0.113.11",
        limit: 1,
        windowMs: 60_000,
        store,
        now: () => 1_000,
      }).allowed
    ).toBe(true);
  });
});

describe("getClientIp", () => {
  it("prefers the first forwarded IP and falls back to x-real-ip", () => {
    const forwarded = new Request("https://formforge.test", {
      headers: { "x-forwarded-for": "203.0.113.10, 198.51.100.1" },
    });
    const realIp = new Request("https://formforge.test", {
      headers: { "x-real-ip": "203.0.113.11" },
    });

    expect(getClientIp(forwarded)).toBe("203.0.113.10");
    expect(getClientIp(realIp)).toBe("203.0.113.11");
  });
});
