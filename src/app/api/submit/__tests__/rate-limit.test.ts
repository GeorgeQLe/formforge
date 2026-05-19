import { describe, it, expect } from "vitest";
import { readFileSync } from "fs";
import { resolve } from "path";

const routeSource = readFileSync(
  resolve(__dirname, "../[slug]/route.ts"),
  "utf-8"
);

describe("Rate limiting on public submit endpoint (CR-016)", () => {
  it("uses the shared rate-limit helper with a form and client-IP key", () => {
    expect(routeSource).toContain("@/server/security/rate-limit");
    expect(routeSource).toContain("getClientIp(request)");
    expect(routeSource).toContain("key: `submit:${slug}:${ip}`");
    expect(routeSource).toContain("limit: 10");
    expect(routeSource).toContain("windowMs: 60_000");
  });

  it("returns a user-facing 429 before Turnstile and persistence work", () => {
    const rateLimitIndex = routeSource.indexOf("checkRateLimit({");
    const responseIndex = routeSource.indexOf("status: 429");
    const bodyIndex = routeSource.indexOf("await request.json()");
    const turnstileIndex = routeSource.indexOf("getTurnstileToken(body)");
    const formSelectIndex = routeSource.indexOf(".from(forms)");

    expect(responseIndex).toBeGreaterThan(rateLimitIndex);
    expect(responseIndex).toBeLessThan(bodyIndex);
    expect(responseIndex).toBeLessThan(turnstileIndex);
    expect(responseIndex).toBeLessThan(formSelectIndex);
    expect(routeSource).toContain(
      "Too many submissions. Please try again shortly."
    );
  });
});
