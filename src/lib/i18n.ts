export const SUPPORTED_LOCALES = ["en", "es"] as const;

export type Locale = (typeof SUPPORTED_LOCALES)[number];

type MessageKey =
  | "form.submit"
  | "form.submitting"
  | "form.successTitle"
  | "form.defaultSuccess"
  | "form.poweredBy"
  | "error.submissionFailed"
  | "error.network"
  | "error.tooManySubmissions"
  | "error.botRequired"
  | "error.botFailed"
  | "error.formNotFound"
  | "error.notAccepting"
  | "error.versionNotFound"
  | "error.responseLimit"
  | "error.formClosed"
  | "error.validationFailed"
  | "error.internal"
  | "gdpr.consentLabel"
  | "gdpr.consentError"
  | "validation.email"
  | "validation.invalidSelection"
  | "validation.invalidDate"
  | "validation.invalidUrl"
  | "validation.mustBeOneOf";

const CATALOG: Record<Locale, Record<MessageKey, string>> = {
  en: {
    "form.submit": "Submit",
    "form.submitting": "Submitting...",
    "form.successTitle": "Thank you!",
    "form.defaultSuccess": "Thank you for your response!",
    "form.poweredBy": "Powered by FormForge",
    "error.submissionFailed": "Submission failed",
    "error.network": "Network error. Please try again.",
    "error.tooManySubmissions": "Too many submissions. Please try again shortly.",
    "error.botRequired": "Bot verification is required",
    "error.botFailed": "Bot verification failed",
    "error.formNotFound": "Form not found",
    "error.notAccepting": "This form is not accepting responses",
    "error.versionNotFound": "Published form version not found",
    "error.responseLimit": "This form has reached its response limit",
    "error.formClosed": "This form is closed",
    "error.validationFailed": "Validation failed",
    "error.internal": "Internal server error",
    "gdpr.consentLabel":
      "I consent to this form collecting and processing my submitted information.",
    "gdpr.consentError":
      "You must accept the data processing consent before submitting.",
    "validation.email": "Enter a valid email address",
    "validation.invalidSelection": "Invalid selection",
    "validation.invalidDate": "Invalid date",
    "validation.invalidUrl": "Enter a valid URL",
    "validation.mustBeOneOf": "Must be one of: {values}",
  },
  es: {
    "form.submit": "Enviar",
    "form.submitting": "Enviando...",
    "form.successTitle": "Gracias!",
    "form.defaultSuccess": "Gracias por tu respuesta!",
    "form.poweredBy": "Creado con FormForge",
    "error.submissionFailed": "No se pudo enviar",
    "error.network": "Error de red. Intentalo de nuevo.",
    "error.tooManySubmissions":
      "Demasiados envios. Intentalo de nuevo en breve.",
    "error.botRequired": "La verificacion antibots es obligatoria",
    "error.botFailed": "La verificacion antibots fallo",
    "error.formNotFound": "Formulario no encontrado",
    "error.notAccepting": "Este formulario no acepta respuestas",
    "error.versionNotFound": "No se encontro la version publicada del formulario",
    "error.responseLimit": "Este formulario alcanzo su limite de respuestas",
    "error.formClosed": "Este formulario esta cerrado",
    "error.validationFailed": "La validacion fallo",
    "error.internal": "Error interno del servidor",
    "gdpr.consentLabel":
      "Acepto que este formulario recopile y procese la informacion enviada.",
    "gdpr.consentError":
      "Debes aceptar el consentimiento de procesamiento de datos antes de enviar.",
    "validation.email": "Ingresa un correo electronico valido",
    "validation.invalidSelection": "Seleccion no valida",
    "validation.invalidDate": "Fecha no valida",
    "validation.invalidUrl": "Ingresa una URL valida",
    "validation.mustBeOneOf": "Debe ser uno de: {values}",
  },
};

export function resolveLocale(locale: unknown): Locale {
  if (typeof locale !== "string") return "en";
  const normalized = locale.toLowerCase().split("-")[0];
  return SUPPORTED_LOCALES.includes(normalized as Locale)
    ? (normalized as Locale)
    : "en";
}

export function t(
  locale: unknown,
  key: MessageKey,
  replacements: Record<string, string> = {}
) {
  const resolvedLocale = resolveLocale(locale);
  let message = CATALOG[resolvedLocale][key] ?? CATALOG.en[key];

  for (const [name, value] of Object.entries(replacements)) {
    message = message.replaceAll(`{${name}}`, value);
  }

  return message;
}
