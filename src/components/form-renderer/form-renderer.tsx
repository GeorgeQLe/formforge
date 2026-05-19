"use client";

import { useState, useCallback, type ComponentType } from "react";
import { ThemeProvider } from "./theme-provider";
import { validateGdprConsent } from "./gdpr-consent";
import { evaluateConditionalLogic } from "@/lib/conditional-logic";
import { buildFormValidator, type FieldDef, type FieldType } from "@/lib/field-types";
import { Button } from "@/components/ui/button";
import type {
  forms,
  formFields,
  FieldOption,
  FieldValidation,
  FormVersionFieldSnapshot,
  ThemeColors,
} from "@/server/db/schema";

// ---------------------------------------------------------------------------
// Field component props type (exported for individual field components)
// ---------------------------------------------------------------------------
export interface FieldComponentProps {
  field: {
    id: string;
    type: string;
    label: string;
    placeholder: string | null;
    helpText: string | null;
    required: boolean;
    options: FieldOption[] | null;
    validation: FieldValidation | null;
  };
  value: string;
  onChange: (value: string) => void;
  error: string | undefined;
  readonly: boolean;
}

// ---------------------------------------------------------------------------
// Field component registry (lazy imports)
// ---------------------------------------------------------------------------
import { TextField } from "./fields/text-field";
import { EmailField } from "./fields/email-field";
import { NumberField } from "./fields/number-field";
import { TextareaField } from "./fields/textarea-field";
import { DropdownField } from "./fields/dropdown-field";
import { RadioField } from "./fields/radio-field";
import { CheckboxField } from "./fields/checkbox-field";
import { DateField } from "./fields/date-field";
import { RatingField } from "./fields/rating-field";
import { FileUploadField } from "./fields/file-upload-field";

const FIELD_COMPONENTS: Record<string, ComponentType<FieldComponentProps>> = {
  text: TextField,
  email: EmailField,
  number: NumberField,
  textarea: TextareaField,
  dropdown: DropdownField,
  radio: RadioField,
  checkbox: CheckboxField,
  date: DateField,
  rating: RatingField,
  file_upload: FileUploadField,
};

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------
type FormData = typeof forms.$inferSelect;
type FieldData = typeof formFields.$inferSelect | FormVersionFieldSnapshot;

interface FormRendererProps {
  mode: "preview" | "fill" | "readonly";
  form: FormData;
  fields: FieldData[];
  formVersionId?: string;
  themeColors?: ThemeColors | null;
  onSubmitSuccess?: (data: { message: string; redirectUrl?: string | null }) => void;
  turnstileToken?: string;
  completionStartTime?: number;
  initialValues?: Record<string, string>;
}

export function FormRenderer({
  mode,
  form,
  fields,
  formVersionId,
  themeColors,
  onSubmitSuccess,
  turnstileToken,
  completionStartTime,
  initialValues,
}: FormRendererProps) {
  const [values, setValues] = useState<Record<string, string>>(
    initialValues ?? {}
  );
  const [gdprConsentAccepted, setGdprConsentAccepted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const readonly = mode === "readonly" || mode === "preview";
  const requiresGdprConsent = mode === "fill" && form.settings.gdprConsentEnabled === true;

  const handleChange = useCallback((fieldId: string, value: string) => {
    setValues((prev) => ({ ...prev, [fieldId]: value }));
    // Clear error on change
    setErrors((prev) => {
      if (prev[fieldId]) {
        const next = { ...prev };
        delete next[fieldId];
        return next;
      }
      return prev;
    });
  }, []);

  const handleGdprConsentChange = useCallback((accepted: boolean) => {
    setGdprConsentAccepted(accepted);
    if (accepted) {
      setErrors((prev) => {
        if (!prev._gdprConsent) return prev;
        const next = { ...prev };
        delete next._gdprConsent;
        return next;
      });
    }
  }, []);

  // Determine visible fields based on conditional logic
  const visibleFields = fields.filter((field) =>
    evaluateConditionalLogic(field.conditionalLogic, values)
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (readonly) return;

    // Client-side validation
    const fieldDefs: FieldDef[] = visibleFields.map((f) => ({
      id: f.id,
      type: f.type as FieldType,
      label: f.label,
      required: f.required,
      options: f.options,
      validation: f.validation,
    }));

    const validator = buildFormValidator(fieldDefs);
    const validationData: Record<string, string> = {};
    for (const field of visibleFields) {
      validationData[field.id] = values[field.id] ?? "";
    }

    const result = validator.safeParse(validationData);
    const gdprConsentError = validateGdprConsent(
      requiresGdprConsent,
      gdprConsentAccepted
    );
    if (!result.success) {
      const newErrors: Record<string, string> = {};
      for (const issue of result.error.issues) {
        const fieldId = String(issue.path[0]);
        if (!newErrors[fieldId]) {
          newErrors[fieldId] = issue.message;
        }
      }
      if (gdprConsentError) {
        newErrors._gdprConsent = gdprConsentError;
      }
      setErrors(newErrors);
      return;
    }
    if (gdprConsentError) {
      setErrors({ _gdprConsent: gdprConsentError });
      return;
    }

    // Submit
    setIsSubmitting(true);
    try {
      const completionTime = completionStartTime
        ? Math.round((Date.now() - completionStartTime) / 1000)
        : null;

      const body: Record<string, unknown> = { ...values };
      if (formVersionId) body._formVersionId = formVersionId;
      if (turnstileToken) body._turnstileToken = turnstileToken;
      if (completionTime) body._completionTime = String(completionTime);

      const response = await fetch(`/api/submit/${form.slug}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        setSubmitResult({ success: false, message: data.error ?? "Submission failed" });
        return;
      }

      setSubmitResult({ success: true, message: data.message });
      onSubmitSuccess?.({ message: data.message, redirectUrl: data.redirectUrl });
    } catch {
      setSubmitResult({ success: false, message: "Network error. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitResult?.success) {
    return (
      <ThemeProvider colors={themeColors}>
        <div className="text-center py-12" role="status" aria-live="polite">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold mb-2">Thank you!</h2>
          <p className="text-gray-500">{submitResult.message}</p>
        </div>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider colors={themeColors}>
      <div>
        {/* Form header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold">{form.title}</h1>
          {form.description && (
            <p className="text-gray-500 mt-1">{form.description}</p>
          )}
        </div>

        {submitResult && !submitResult.success && (
          <div
            className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700"
            role="alert"
            aria-live="assertive"
          >
            {submitResult.message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {visibleFields.map((field) => {
            const Component = FIELD_COMPONENTS[field.type];
            if (!Component) return null;

            return (
              <Component
                key={field.id}
                field={field}
                value={values[field.id] ?? ""}
                onChange={(value) => handleChange(field.id, value)}
                error={errors[field.id]}
                readonly={readonly}
              />
            );
          })}

          {mode === "fill" && visibleFields.length > 0 && (
            <div className="pt-4">
              {requiresGdprConsent && (
                <div className="mb-4">
                  <label className="flex items-start gap-3 text-sm text-gray-700">
                    <input
                      type="checkbox"
                      checked={gdprConsentAccepted}
                      onChange={(event) =>
                        handleGdprConsentChange(event.target.checked)
                      }
                      className="mt-1 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      aria-required="true"
                      aria-invalid={!!errors._gdprConsent}
                      aria-describedby={
                        errors._gdprConsent ? "gdpr-consent-error" : undefined
                      }
                    />
                    <span>
                      I consent to this form collecting and processing my
                      submitted information.
                    </span>
                  </label>
                  {errors._gdprConsent && (
                    <p
                      id="gdpr-consent-error"
                      className="mt-2 text-sm text-red-600"
                    >
                      {errors._gdprConsent}
                    </p>
                  )}
                </div>
              )}
              <Button
                type="submit"
                disabled={isSubmitting}
                data-primary
                className="w-full"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Submitting...
                  </>
                ) : (
                  "Submit"
                )}
              </Button>
            </div>
          )}
        </form>

        {mode === "fill" && (
          <p className="text-center text-xs text-gray-400 mt-6">
            Powered by FormForge
          </p>
        )}
      </div>
    </ThemeProvider>
  );
}
