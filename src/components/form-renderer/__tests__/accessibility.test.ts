import { readFileSync } from "fs";
import { resolve } from "path";
import { describe, expect, it } from "vitest";
import {
  getDescribedBy,
  getFieldAccessibilityIds,
} from "@/components/form-renderer/accessibility";

const rendererSource = readFileSync(resolve(__dirname, "../form-renderer.tsx"), "utf-8");
const fieldSources = {
  text: readFileSync(resolve(__dirname, "../fields/text-field.tsx"), "utf-8"),
  email: readFileSync(resolve(__dirname, "../fields/email-field.tsx"), "utf-8"),
  number: readFileSync(resolve(__dirname, "../fields/number-field.tsx"), "utf-8"),
  textarea: readFileSync(resolve(__dirname, "../fields/textarea-field.tsx"), "utf-8"),
  dropdown: readFileSync(resolve(__dirname, "../fields/dropdown-field.tsx"), "utf-8"),
  date: readFileSync(resolve(__dirname, "../fields/date-field.tsx"), "utf-8"),
  radio: readFileSync(resolve(__dirname, "../fields/radio-field.tsx"), "utf-8"),
  checkbox: readFileSync(resolve(__dirname, "../fields/checkbox-field.tsx"), "utf-8"),
  rating: readFileSync(resolve(__dirname, "../fields/rating-field.tsx"), "utf-8"),
  fileUpload: readFileSync(resolve(__dirname, "../fields/file-upload-field.tsx"), "utf-8"),
};

describe("form renderer accessibility", () => {
  it("builds stable help and error description ids", () => {
    expect(getFieldAccessibilityIds("field-1")).toEqual({
      helpId: "field-1-help",
      errorId: "field-1-error",
    });
    expect(
      getDescribedBy({
        helpText: "Use your work email.",
        helpId: "email-help",
        error: "Email is required.",
        errorId: "email-error",
      })
    ).toBe("email-help email-error");
    expect(
      getDescribedBy({
        helpText: null,
        helpId: "email-help",
        error: undefined,
        errorId: "email-error",
      })
    ).toBeUndefined();
  });

  it("connects help and error text to input fields", () => {
    for (const source of [
      fieldSources.text,
      fieldSources.email,
      fieldSources.number,
      fieldSources.textarea,
      fieldSources.dropdown,
      fieldSources.date,
      fieldSources.fileUpload,
    ]) {
      expect(source).toContain("getFieldAccessibilityIds(field.id)");
      expect(source).toContain("getDescribedBy(");
      expect(source).toContain("id={helpId}");
      expect(source).toContain("id={errorId}");
      expect(source).toContain("aria-describedby={describedBy}");
      expect(source).toContain("aria-invalid={!!");
    }
  });

  it("uses grouped semantics for choice and rating controls", () => {
    for (const source of [fieldSources.radio, fieldSources.checkbox, fieldSources.rating]) {
      expect(source).toContain("<fieldset");
      expect(source).toContain("<legend");
      expect(source).toContain("aria-describedby={describedBy}");
      expect(source).toContain("aria-invalid={!!error}");
      expect(source).toContain("id={helpId}");
      expect(source).toContain("id={errorId}");
    }

    expect(fieldSources.rating).toContain('role="radiogroup"');
    expect(fieldSources.rating).toContain('role="radio"');
    expect(fieldSources.rating).toContain("aria-checked={currentValue === star}");
  });

  it("announces submit results and GDPR consent errors", () => {
    expect(rendererSource).toContain('role="status"');
    expect(rendererSource).toContain('role="alert"');
    expect(rendererSource).toContain('aria-live="polite"');
    expect(rendererSource).toContain('aria-live="assertive"');
    expect(rendererSource).toContain('aria-invalid={!!errors._gdprConsent}');
    expect(rendererSource).toContain('aria-required="true"');
  });
});
