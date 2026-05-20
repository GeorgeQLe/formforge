import { describe, expect, it } from "vitest";
import { buildLocalizedFormValidator } from "@/lib/field-types";
import { resolveLocale, t } from "@/lib/i18n";

describe("i18n catalog", () => {
  it("resolves supported locales and falls back to English", () => {
    expect(resolveLocale("es-MX")).toBe("es");
    expect(resolveLocale("fr")).toBe("en");
    expect(resolveLocale(undefined)).toBe("en");
  });

  it("translates system messages with replacement values", () => {
    expect(t("es", "form.submit")).toBe("Enviar");
    expect(t("es", "validation.mustBeOneOf", { values: "a, b" })).toBe(
      "Debe ser uno de: a, b"
    );
    expect(t("fr", "form.submit")).toBe("Submit");
  });

  it("uses localized validation messages for generated field validators", () => {
    const validator = buildLocalizedFormValidator(
      [
        {
          id: "email",
          type: "email",
          label: "Email",
          required: true,
        },
        {
          id: "choice",
          type: "dropdown",
          label: "Choice",
          required: true,
          options: [{ label: "A", value: "a" }],
        },
      ],
      "es"
    );

    const result = validator.safeParse({ email: "bad", choice: "b" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.map((issue) => issue.message)).toEqual([
        "Ingresa un correo electronico valido",
        "Debe ser uno de: a",
      ]);
    }
  });
});
