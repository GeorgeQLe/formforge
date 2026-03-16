import { describe, it, expect } from "vitest";
import * as fs from "fs";
import * as path from "path";

const routersDir = path.resolve(__dirname, "..");
const responseRouterSrc = fs.readFileSync(
  path.join(routersDir, "response.ts"),
  "utf-8"
);

describe("CR-007: CSV export has bounded response limit", () => {
  it("should include a .limit() on the formResponses query in exportCsv", () => {
    // Extract the exportCsv procedure block
    const exportCsvStart = responseRouterSrc.indexOf("exportCsv");
    expect(exportCsvStart).toBeGreaterThan(-1);

    const exportCsvBlock = responseRouterSrc.slice(
      exportCsvStart,
      exportCsvStart + 2000
    );

    // Find the formResponses query specifically (not the forms ownership check)
    // The pattern: .from(formResponses)...limit(N) before the next .select() or return
    const responsesQueryStart = exportCsvBlock.indexOf(".from(formResponses)");
    expect(responsesQueryStart).toBeGreaterThan(-1);

    // Get the text from the formResponses query to the next query or semicolon
    const afterResponsesQuery = exportCsvBlock.slice(responsesQueryStart, responsesQueryStart + 200);
    expect(afterResponsesQuery).toContain(".limit(");
  });

  it("should return a truncated field to indicate if results were capped", () => {
    const exportCsvStart = responseRouterSrc.indexOf("exportCsv");
    const exportCsvBlock = responseRouterSrc.slice(
      exportCsvStart,
      exportCsvStart + 3000
    );

    expect(exportCsvBlock).toContain("truncated");
  });
});
