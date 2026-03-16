import { describe, it, expect } from "vitest";
import * as fs from "fs";
import * as path from "path";

const routersDir = path.resolve(__dirname, "..");
const formRouterSrc = fs.readFileSync(
  path.join(routersDir, "form.ts"),
  "utf-8"
);

describe("CR-006: Settings validation rejects arbitrary JSON", () => {
  it("should not use z.any() for settings validation", () => {
    // z.any() accepts arbitrary JSON — settings should use a strict schema
    expect(formRouterSrc).not.toContain("z.any()");
  });

  it("should define a strict settings schema with known fields", () => {
    const knownFields = [
      "notificationEmails",
      "responseLimit",
      "closeDate",
      "redirectUrl",
      "successMessage",
      "gdprConsentEnabled",
    ];

    for (const field of knownFields) {
      expect(formRouterSrc).toContain(field);
    }
  });

  it("should reject unknown keys via .strict() on settings schema", () => {
    // The settings schema should use .strict() to reject unknown keys
    // .passthrough() would allow unknown keys through — we should NOT see it
    expect(formRouterSrc).not.toContain(".passthrough()");

    // Look for .strict() on an object schema near settings
    const strictPattern = /settings.*\.strict\(\)|\.strict\(\).*settings/s;
    expect(formRouterSrc).toMatch(strictPattern);
  });
});
