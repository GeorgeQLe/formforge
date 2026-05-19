import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import {
  API_EXAMPLES,
  buildCurlExample,
  buildKeyPrefix,
  buildResponsePreview,
  describeScopes,
  maskApiKey,
  SCOPE_LABELS,
  validateKeyName,
} from "../api-access-prototype";

const currentDir = dirname(fileURLToPath(import.meta.url));
const experimentPage = join(currentDir, "../page.tsx");
const sidebar = join(currentDir, "../../../../../components/dashboard/sidebar.tsx");

describe("api access prototype helpers", () => {
  it("validates draft key names", () => {
    expect(validateKeyName("")).toBe("Name this key before previewing it.");
    expect(validateKeyName("ab")).toBe("Use at least 3 characters.");
    expect(validateKeyName(" Partner sync ")).toBeNull();
  });

  it("builds deterministic key prefixes and masked previews", () => {
    expect(buildKeyPrefix("Partner Sync", "test")).toBe("ff_test_partner_sync");
    expect(buildKeyPrefix("Data warehouse reporting", "live")).toBe("ff_live_data_warehou");
    expect(maskApiKey("ff_test_partner")).toBe("ff_test_partner_************************");
  });

  it("describes scopes and request examples", () => {
    const postExample = API_EXAMPLES.find((example) => example.method === "POST");

    expect(describeScopes([])).toBe("No scopes selected");
    expect(describeScopes(["forms:read", "responses:read"])).toBe("Read forms, Read responses");
    expect(SCOPE_LABELS["responses:write"]).toBe("Create responses");
    expect(postExample).toBeDefined();
    expect(buildCurlExample(postExample!, "ff_test_key_****")).toContain("-d '{\"fields\"");
    expect(buildResponsePreview(postExample!)).toContain('"status": "accepted"');
  });

  it("stays isolated from durable public API infrastructure", () => {
    const source = readFileSync(experimentPage, "utf8");

    expect(source).not.toContain("@/server/db");
    expect(source).not.toContain("@/server/trpc");
    expect(source).not.toContain("@/server/billing");
    expect(source).not.toContain("@clerk/nextjs");
    expect(source).not.toContain("trpc.");
    expect(source).not.toContain("crypto");
    expect(source).not.toContain("/api/");
  });

  it("is reachable from dashboard experiments navigation", () => {
    const source = readFileSync(sidebar, "utf8");

    expect(source).toContain('href: "/experiments/api-access"');
    expect(source).toContain("FlaskConical");
  });
});
