export const GDPR_CONSENT_ERROR =
  "You must accept the data processing consent before submitting.";

export function validateGdprConsent(enabled: boolean, accepted: boolean) {
  if (!enabled) return null;
  return accepted ? null : GDPR_CONSENT_ERROR;
}
