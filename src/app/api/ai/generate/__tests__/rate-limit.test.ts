import { describe, expect, it } from "vitest";
import { readFileSync } from "fs";
import { resolve } from "path";

const routeSource = readFileSync(resolve(__dirname, "../route.ts"), "utf-8");

describe("AI generation rate limiting", () => {
  it("uses the shared rate-limit helper with the authenticated app user", () => {
    expect(routeSource).toContain("@/server/security/rate-limit");
    expect(routeSource).toContain("key: `ai-generate:${user.id}`");
    expect(routeSource).toContain("limit: 5");
    expect(routeSource).toContain("windowMs: 60_000");
  });

  it("returns a user-facing 429 before parsing the prompt or calling OpenAI", () => {
    const rateLimitIndex = routeSource.indexOf("checkRateLimit({");
    const responseIndex = routeSource.indexOf("status: 429");
    const bodyIndex = routeSource.indexOf("await request.json()");
    const aiIndex = routeSource.indexOf("generateFormFromAI(prompt, user.id)");

    expect(responseIndex).toBeGreaterThan(rateLimitIndex);
    expect(responseIndex).toBeLessThan(bodyIndex);
    expect(responseIndex).toBeLessThan(aiIndex);
    expect(routeSource).toContain(
      "Too many AI generation requests. Please try again shortly."
    );
  });
});
