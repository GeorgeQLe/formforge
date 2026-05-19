import { describe, expect, it } from "vitest";
import { resolveAIConditionalLogic, type AIFieldResponse } from "../generate-form";
import type { formFields } from "@/server/db/schema";

type InsertedField = typeof formFields.$inferSelect;

function insertedField(overrides: Partial<InsertedField> = {}): InsertedField {
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
    createdAt: new Date("2026-05-19T12:00:00.000Z"),
    ...overrides,
  };
}

describe("AI form generation helpers", () => {
  it("resolves conditional logic hints from labels to inserted field ids", () => {
    const parsedFields: AIFieldResponse[] = [
      {
        type: "radio",
        label: "Do you have a budget?",
        required: true,
        options: [
          { label: "Yes", value: "yes" },
          { label: "No", value: "no" },
        ],
      },
      {
        type: "number",
        label: "Budget amount",
        required: false,
        conditionalLogicHint: {
          dependsOnLabel: "Do you have a budget?",
          operator: "equals",
          value: "yes",
          action: "show",
        },
      },
    ];

    const insertedFields = [
      insertedField({
        id: "20000000-0000-4000-8000-000000000001",
        label: "Do you have a budget?",
      }),
      insertedField({
        id: "20000000-0000-4000-8000-000000000002",
        label: "Budget amount",
        type: "number",
        sortOrder: 1,
      }),
    ];

    expect(resolveAIConditionalLogic(parsedFields, insertedFields)).toEqual([
      null,
      {
        fieldId: "20000000-0000-4000-8000-000000000002",
        conditionalLogic: {
          action: "show",
          logic: "AND",
          showWhen: [
            {
              fieldId: "20000000-0000-4000-8000-000000000001",
              operator: "equals",
              value: "yes",
            },
          ],
        },
      },
    ]);
  });

  it("drops conditional hints when the referenced label is absent", () => {
    const parsedFields: AIFieldResponse[] = [
      {
        type: "text",
        label: "Details",
        required: false,
        conditionalLogicHint: {
          dependsOnLabel: "Missing field",
          operator: "is_not_empty",
          action: "show",
        },
      },
    ];

    expect(resolveAIConditionalLogic(parsedFields, [insertedField({ label: "Details" })])).toEqual([
      null,
    ]);
  });
});
