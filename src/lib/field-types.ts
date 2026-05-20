import { z } from "zod";
import type { FieldOption, FieldValidation } from "@/server/db/schema";
import { t, type Locale } from "@/lib/i18n";

// ---------------------------------------------------------------------------
// Field Type Registry
// ---------------------------------------------------------------------------
export const FIELD_TYPES = {
  text: { label: "Text", icon: "Type", category: "basic", hasOptions: false },
  email: { label: "Email", icon: "Mail", category: "basic", hasOptions: false },
  number: { label: "Number", icon: "Hash", category: "basic", hasOptions: false },
  textarea: { label: "Long Text", icon: "AlignLeft", category: "basic", hasOptions: false },
  dropdown: { label: "Dropdown", icon: "ChevronDown", category: "choice", hasOptions: true },
  radio: { label: "Radio", icon: "Circle", category: "choice", hasOptions: true },
  checkbox: { label: "Checkbox", icon: "CheckSquare", category: "choice", hasOptions: true },
  date: { label: "Date", icon: "Calendar", category: "special", hasOptions: false },
  rating: { label: "Rating", icon: "Star", category: "special", hasOptions: false },
  file_upload: { label: "File Upload", icon: "Upload", category: "special", hasOptions: false },
} as const;

export type FieldType = keyof typeof FIELD_TYPES;

export const FIELD_TYPE_KEYS = Object.keys(FIELD_TYPES) as FieldType[];

export const FIELD_CATEGORIES = {
  basic: { label: "Basic Fields", types: ["text", "email", "number", "textarea"] as FieldType[] },
  choice: { label: "Choice Fields", types: ["dropdown", "radio", "checkbox"] as FieldType[] },
  special: { label: "Special Fields", types: ["date", "rating", "file_upload"] as FieldType[] },
};

// ---------------------------------------------------------------------------
// Per-field Zod validator
// ---------------------------------------------------------------------------
export type FieldDef = {
  id: string;
  type: FieldType;
  label: string;
  required: boolean;
  options?: FieldOption[] | null;
  validation?: FieldValidation | null;
};

export function getFieldValidator(field: FieldDef): z.ZodType {
  return getLocalizedFieldValidator(field, "en");
}

export function getLocalizedFieldValidator(
  field: FieldDef,
  locale: Locale = "en"
): z.ZodType {
  const { type, required, options, validation } = field;

  let schema: z.ZodType;

  switch (type) {
    case "text":
    case "textarea": {
      let s = z.string();
      if (validation?.min) s = s.min(validation.min);
      if (validation?.max) s = s.max(validation.max);
      if (validation?.pattern) s = s.regex(new RegExp(validation.pattern));
      schema = s;
      break;
    }
    case "email": {
      schema = z.string().email(t(locale, "validation.email"));
      break;
    }
    case "number": {
      let n = z.coerce.number();
      if (validation?.min !== undefined) n = n.min(validation.min);
      if (validation?.max !== undefined) n = n.max(validation.max);
      schema = n;
      break;
    }
    case "dropdown":
    case "radio": {
      const values = (options ?? []).map((o) => o.value);
      if (values.length > 0) {
        schema = z.string().refine((v) => values.includes(v), {
          message: t(locale, "validation.mustBeOneOf", {
            values: values.join(", "),
          }),
        });
      } else {
        schema = z.string();
      }
      break;
    }
    case "checkbox": {
      // Checkbox stores comma-separated values or array
      const values = (options ?? []).map((o) => o.value);
      if (values.length > 0) {
        schema = z.string().refine(
          (v) => {
            const selected = v.split(",").map((s) => s.trim()).filter(Boolean);
            return selected.every((s) => values.includes(s));
          },
          { message: t(locale, "validation.invalidSelection") }
        );
      } else {
        schema = z.string();
      }
      break;
    }
    case "date": {
      schema = z.string().refine((v) => !isNaN(Date.parse(v)), {
        message: t(locale, "validation.invalidDate"),
      });
      break;
    }
    case "rating": {
      schema = z.coerce
        .number()
        .int()
        .min(validation?.min ?? 1)
        .max(validation?.max ?? 5);
      break;
    }
    case "file_upload": {
      // Value is the S3 URL stored after upload
      schema = z.string().url(t(locale, "validation.invalidUrl"));
      break;
    }
    default: {
      schema = z.string();
    }
  }

  if (!required) {
    schema = schema.optional().or(z.literal(""));
  }

  return schema;
}

// ---------------------------------------------------------------------------
// Build full-form validator from field list
// ---------------------------------------------------------------------------
export function buildFormValidator(fields: FieldDef[]) {
  return buildLocalizedFormValidator(fields, "en");
}

export function buildLocalizedFormValidator(
  fields: FieldDef[],
  locale: Locale = "en"
) {
  const shape: Record<string, z.ZodType> = {};
  for (const field of fields) {
    shape[field.id] = getLocalizedFieldValidator(field, locale);
  }
  return z.object(shape);
}
