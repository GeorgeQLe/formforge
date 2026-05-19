import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const pageSource = readFileSync(
  join(process.cwd(), "src/app/(dashboard)/forms/[id]/edit/page.tsx"),
  "utf8"
);

describe("form editor AI regeneration wiring", () => {
  it("wires regeneration through the owner-scoped tRPC mutation", () => {
    expect(pageSource).toContain("trpc.form.regenerateWithAI.useMutation");
    expect(pageSource).toContain('dispatch({ type: "SET_FORM", form: result.form, fields: result.fields })');
    expect(pageSource).toContain("utils.field.list.invalidate");
  });

  it("requires explicit replacement confirmation before regenerating", () => {
    expect(pageSource).toContain("replaceConfirmed");
    expect(pageSource).toContain("Replace the current fields with the regenerated version");
    expect(pageSource).toContain("!replaceConfirmed");
  });
});
