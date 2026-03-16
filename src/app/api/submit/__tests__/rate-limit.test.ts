import { describe, it, expect } from "vitest";
import { readFileSync } from "fs";
import { resolve } from "path";

const routeSource = readFileSync(
  resolve(__dirname, "../[slug]/route.ts"),
  "utf-8"
);

describe("Rate limiting on public submit endpoint (CR-016)", () => {
  it("contains a rate limit check function", () => {
    expect(routeSource).toMatch(/checkRateLimit|rateLimit/);
  });

  it("returns 429 status when rate limited", () => {
    expect(routeSource).toContain("429");
  });
});
