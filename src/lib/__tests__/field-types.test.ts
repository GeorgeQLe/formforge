import { describe, expect, it } from "vitest";
import { buildFormValidator, getFieldValidator, type FieldDef } from "../field-types";

function field(overrides: Partial<FieldDef>): FieldDef {
  return {
    id: "field-1",
    type: "text",
    label: "Question",
    required: true,
    ...overrides,
  };
}

describe("getFieldValidator", () => {
  it("enforces text length and pattern validation", () => {
    const validator = getFieldValidator(
      field({
        validation: { min: 3, max: 5, pattern: "^[A-Z]+$" },
      })
    );

    expect(validator.safeParse("ABC").success).toBe(true);
    expect(validator.safeParse("AB").success).toBe(false);
    expect(validator.safeParse("ABCDEF").success).toBe(false);
    expect(validator.safeParse("abc").success).toBe(false);
  });

  it("allows optional fields to be omitted or submitted as an empty string", () => {
    const validator = getFieldValidator(field({ required: false }));

    expect(validator.safeParse(undefined).success).toBe(true);
    expect(validator.safeParse("").success).toBe(true);
  });

  it("validates email, number, date, rating, and file upload field values", () => {
    expect(getFieldValidator(field({ type: "email" })).safeParse("person@example.com").success).toBe(true);
    expect(getFieldValidator(field({ type: "email" })).safeParse("not-email").success).toBe(false);

    const numberValidator = getFieldValidator(
      field({ type: "number", validation: { min: 2, max: 4 } })
    );
    expect(numberValidator.safeParse("3").success).toBe(true);
    expect(numberValidator.safeParse("1").success).toBe(false);

    expect(getFieldValidator(field({ type: "date" })).safeParse("2026-05-18").success).toBe(true);
    expect(getFieldValidator(field({ type: "date" })).safeParse("not-a-date").success).toBe(false);

    const ratingValidator = getFieldValidator(
      field({ type: "rating", validation: { min: 1, max: 10 } })
    );
    expect(ratingValidator.safeParse("7").success).toBe(true);
    expect(ratingValidator.safeParse("11").success).toBe(false);

    expect(getFieldValidator(field({ type: "file_upload" })).safeParse("https://example.com/file.pdf").success).toBe(true);
    expect(getFieldValidator(field({ type: "file_upload" })).safeParse("not-a-url").success).toBe(false);
  });

  it("restricts dropdown and radio values to configured options", () => {
    const options = [
      { label: "Alpha", value: "alpha" },
      { label: "Beta", value: "beta" },
    ];

    expect(getFieldValidator(field({ type: "dropdown", options })).safeParse("alpha").success).toBe(true);
    expect(getFieldValidator(field({ type: "dropdown", options })).safeParse("gamma").success).toBe(false);
    expect(getFieldValidator(field({ type: "radio", options })).safeParse("beta").success).toBe(true);
    expect(getFieldValidator(field({ type: "radio", options })).safeParse("gamma").success).toBe(false);
  });

  it("validates comma-separated checkbox selections against configured options", () => {
    const validator = getFieldValidator(
      field({
        type: "checkbox",
        options: [
          { label: "Alpha", value: "alpha" },
          { label: "Beta", value: "beta" },
        ],
      })
    );

    expect(validator.safeParse("alpha,beta").success).toBe(true);
    expect(validator.safeParse("alpha, gamma").success).toBe(false);
  });
});

describe("buildFormValidator", () => {
  it("builds a schema keyed by field id", () => {
    const validator = buildFormValidator([
      field({ id: "email", type: "email" }),
      field({ id: "age", type: "number", validation: { min: 18 } }),
      field({ id: "notes", required: false }),
    ]);

    expect(
      validator.safeParse({
        email: "person@example.com",
        age: "42",
        notes: "",
      }).success
    ).toBe(true);

    expect(
      validator.safeParse({
        email: "person@example.com",
        age: "17",
      }).success
    ).toBe(false);
  });
});
