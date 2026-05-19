import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import {
  canRemoveMember,
  describeFormAccess,
  PROTOTYPE_MEMBERS,
  ROLE_LABELS,
  ROLE_SUMMARIES,
  validateInviteEmail,
} from "../team-collaboration-prototype";

const currentDir = dirname(fileURLToPath(import.meta.url));
const experimentPage = join(currentDir, "../page.tsx");

describe("team collaboration prototype helpers", () => {
  it("validates invite email drafts", () => {
    expect(validateInviteEmail("")).toBe("Enter an email address.");
    expect(validateInviteEmail("invalid-email")).toBe("Enter a valid email address.");
    expect(validateInviteEmail(" teammate@example.com ")).toBeNull();
  });

  it("keeps the owner protected from local removal", () => {
    const owner = PROTOTYPE_MEMBERS.find((member) => member.role === "owner");
    const editor = PROTOTYPE_MEMBERS.find((member) => member.role === "editor");

    expect(owner).toBeDefined();
    expect(editor).toBeDefined();
    expect(canRemoveMember(owner!)).toBe(false);
    expect(canRemoveMember(editor!)).toBe(true);
  });

  it("describes form access from role fixtures", () => {
    expect(describeFormAccess([])).toBe("Private to owner");
    expect(describeFormAccess(["admin", "viewer"])).toBe("Admin, Viewer");
    expect(ROLE_LABELS.editor).toBe("Editor");
    expect(ROLE_SUMMARIES.viewer).toContain("View forms");
  });

  it("stays isolated from durable team infrastructure", () => {
    const source = readFileSync(experimentPage, "utf8");

    expect(source).not.toContain("@/server/db");
    expect(source).not.toContain("@/server/trpc");
    expect(source).not.toContain("@/server/billing");
    expect(source).not.toContain("@clerk/nextjs");
    expect(source).not.toContain("trpc.");
  });
});
