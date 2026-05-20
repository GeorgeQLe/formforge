import { readFileSync } from "fs";
import { resolve } from "path";
import { describe, expect, it } from "vitest";

const routeSource = readFileSync(
  resolve(__dirname, "../[slug]/route.ts"),
  "utf-8"
);
const rendererSource = readFileSync(
  resolve(__dirname, "../../../../components/form-renderer/form-renderer.tsx"),
  "utf-8"
);
const publicPageSource = readFileSync(
  resolve(__dirname, "../../../f/[slug]/page.tsx"),
  "utf-8"
);

describe("public form i18n wiring", () => {
  it("passes a non-durable locale from the public form URL into the renderer", () => {
    expect(publicPageSource).toContain("resolveLocale(query.locale ?? query.lang)");
    expect(publicPageSource).toContain("locale={locale}");
    expect(rendererSource).toContain("locale?: Locale | string");
    expect(rendererSource).toContain("_locale: locale");
  });

  it("uses the catalog for renderer system strings", () => {
    expect(rendererSource).toContain('t(locale, "form.submit")');
    expect(rendererSource).toContain('t(locale, "form.submitting")');
    expect(rendererSource).toContain('t(locale, "form.successTitle")');
    expect(rendererSource).toContain('t(locale, "error.network")');
  });

  it("uses localized submit-route system and validation messages", () => {
    expect(routeSource).toContain("const locale = resolveLocale(body._locale)");
    expect(routeSource).toContain("buildLocalizedFormValidator(fieldDefs, locale)");
    expect(routeSource).toContain('t(locale, "error.validationFailed")');
    expect(routeSource).toContain('t(locale, "form.defaultSuccess")');
  });
});
