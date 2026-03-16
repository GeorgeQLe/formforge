import { describe, it, expect } from "vitest";
import { readFileSync } from "fs";
import { resolve } from "path";

const routeSource = readFileSync(
  resolve(__dirname, "../[slug]/route.ts"),
  "utf-8"
);

describe("Turnstile skip-path logging (CR-010)", () => {
  // Extract the !secret block for targeted assertions
  const secretBlockMatch = routeSource.match(
    /if\s*\(\s*!secret\s*\)\s*\{([^}]+)\}/s
  );
  const secretBlock = secretBlockMatch?.[1] ?? "";

  it("logs a console.warn when TURNSTILE_SECRET_KEY is not set", () => {
    expect(secretBlock).toContain("console.warn");
  });

  it("warn message describes the missing key", () => {
    expect(secretBlock).toMatch(/TURNSTILE_SECRET_KEY/);
  });
});
