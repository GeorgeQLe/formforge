import { t, type Locale } from "@/lib/i18n";

export const GDPR_CONSENT_ERROR =
  "You must accept the data processing consent before submitting.";

export function validateGdprConsent(
  enabled: boolean,
  accepted: boolean,
  locale: Locale = "en"
) {
  if (!enabled) return null;
  return accepted ? null : t(locale, "gdpr.consentError");
}
