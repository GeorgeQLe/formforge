import { describe, expect, it } from "vitest";
import { createFormVersionSnapshot } from "../versioning";
import type { formFields, forms } from "@/server/db/schema";

type FormRow = typeof forms.$inferSelect;
type FieldRow = typeof formFields.$inferSelect;

const now = new Date("2026-05-19T12:00:00.000Z");

function form(overrides: Partial<FormRow> = {}): FormRow {
  return {
    id: "10000000-0000-4000-8000-000000000001",
    userId: "00000000-0000-4000-8000-000000000001",
    title: "Contact",
    description: "Public contact form",
    slug: "contact",
    status: "draft",
    settings: { gdprConsentEnabled: true, successMessage: "Thanks" },
    themeId: "30000000-0000-4000-8000-000000000001",
    createdAt: now,
    updatedAt: now,
    ...overrides,
  };
}

function field(overrides: Partial<FieldRow> = {}): FieldRow {
  return {
    id: "20000000-0000-4000-8000-000000000001",
    formId: "10000000-0000-4000-8000-000000000001",
    type: "text",
    label: "Name",
    placeholder: null,
    helpText: null,
    required: false,
    options: null,
    validation: null,
    conditionalLogic: null,
    sortOrder: 0,
    createdAt: now,
    ...overrides,
  };
}

describe("createFormVersionSnapshot", () => {
  it("copies form metadata and ordered field definitions into an immutable snapshot shape", () => {
    const snapshot = createFormVersionSnapshot(form(), [
      field({
        id: "20000000-0000-4000-8000-000000000002",
        label: "Email",
        type: "email",
        required: true,
        validation: { pattern: ".+@.+" },
        sortOrder: 2,
      }),
      field({
        id: "20000000-0000-4000-8000-000000000001",
        label: "Name",
        placeholder: "Ada",
        helpText: "Use your full name",
        options: [{ label: "A", value: "a" }],
        conditionalLogic: {
          action: "show",
          logic: "AND",
          showWhen: [{ fieldId: "x", operator: "is_not_empty" }],
        },
        sortOrder: 1,
      }),
    ]);

    expect(snapshot).toMatchObject({
      formId: "10000000-0000-4000-8000-000000000001",
      title: "Contact",
      description: "Public contact form",
      settings: { gdprConsentEnabled: true, successMessage: "Thanks" },
      themeId: "30000000-0000-4000-8000-000000000001",
    });
    expect(snapshot.fieldsSnapshot).toEqual([
      {
        id: "20000000-0000-4000-8000-000000000001",
        type: "text",
        label: "Name",
        placeholder: "Ada",
        helpText: "Use your full name",
        required: false,
        options: [{ label: "A", value: "a" }],
        validation: null,
        conditionalLogic: {
          action: "show",
          logic: "AND",
          showWhen: [{ fieldId: "x", operator: "is_not_empty" }],
        },
        sortOrder: 1,
      },
      {
        id: "20000000-0000-4000-8000-000000000002",
        type: "email",
        label: "Email",
        placeholder: null,
        helpText: null,
        required: true,
        options: null,
        validation: { pattern: ".+@.+" },
        conditionalLogic: null,
        sortOrder: 2,
      },
    ]);
  });
});
