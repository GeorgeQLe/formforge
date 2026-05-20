import { describe, expect, it } from "vitest";
import * as fs from "fs";
import * as path from "path";
import {
  GDPR_CONSENT_ERROR,
  validateGdprConsent,
} from "@/components/form-renderer/gdpr-consent";

const rendererSource = fs.readFileSync(
  path.resolve(__dirname, "../form-renderer.tsx"),
  "utf-8"
);

describe("GDPR consent validation", () => {
  it("does not require consent when the form setting is disabled", () => {
    expect(validateGdprConsent(false, false)).toBeNull();
  });

  it("accepts submissions when required consent has been checked", () => {
    expect(validateGdprConsent(true, true)).toBeNull();
  });

  it("returns a user-facing error when required consent is missing", () => {
    expect(validateGdprConsent(true, false)).toBe(GDPR_CONSENT_ERROR);
    expect(validateGdprConsent(true, false, "es")).toBe(
      "Debes aceptar el consentimiento de procesamiento de datos antes de enviar."
    );
  });

  it("wires the required checkbox to form settings in the renderer", () => {
    expect(rendererSource).toContain("form.settings.gdprConsentEnabled === true");
    expect(rendererSource).toContain("validateGdprConsent(");
    expect(rendererSource).toContain('t(locale, "gdpr.consentLabel")');
    expect(rendererSource).toContain('type="checkbox"');
    expect(rendererSource).toContain("_gdprConsent");
  });
});
