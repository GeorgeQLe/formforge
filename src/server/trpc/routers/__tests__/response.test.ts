import { describe, it, expect } from "vitest";
import * as fs from "fs";
import * as path from "path";

const routersDir = path.resolve(__dirname, "..");
const responseRouterSrc = fs.readFileSync(
  path.join(routersDir, "response.ts"),
  "utf-8"
);

const presignedRouteSrc = fs.readFileSync(
  path.resolve(__dirname, "../../../../app/api/upload/presigned/route.ts"),
  "utf-8"
);

const middlewareSrc = fs.readFileSync(
  path.resolve(__dirname, "../../../../middleware.ts"),
  "utf-8"
);

describe("CR-003: Response mutations scope by formId", () => {
  it("should not have any .where(eq(formResponses.id, ...)) without and()", () => {
    // Match .where(eq(formResponses.id, ...)) that is NOT wrapped in and()
    // All mutations should use .where(and(eq(formResponses.id, ...), eq(formResponses.formId, ...)))
    const unscopedPattern =
      /\.where\(eq\(formResponses\.id,/g;
    const scopedPattern =
      /\.where\(and\(eq\(formResponses\.id,.*?eq\(formResponses\.formId,/g;

    const unscopedMatches = responseRouterSrc.match(unscopedPattern) ?? [];
    const scopedMatches = responseRouterSrc.match(scopedPattern) ?? [];

    // Every formResponses.id where clause should be scoped with formId via and()
    expect(unscopedMatches.length).toBe(0);
    expect(scopedMatches.length).toBeGreaterThanOrEqual(3);
  });
});

describe("CR-002: Presigned URL auth", () => {
  it("should require authentication in the presigned URL route", () => {
    expect(presignedRouteSrc).toContain("await auth()");
  });

  it("should not list presigned route as public in middleware", () => {
    expect(middlewareSrc).not.toContain("presigned");
  });
});
