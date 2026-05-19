import type {
  formFields,
  forms,
  FormVersionFieldSnapshot,
} from "@/server/db/schema";

type FormRow = typeof forms.$inferSelect;
type FieldRow = typeof formFields.$inferSelect;

export function createFormVersionSnapshot(form: FormRow, fields: FieldRow[]) {
  return {
    formId: form.id,
    title: form.title,
    description: form.description,
    settings: form.settings,
    themeId: form.themeId,
    fieldsSnapshot: fields
      .slice()
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map(fieldToVersionSnapshot),
  };
}

export function fieldToVersionSnapshot(
  field: FieldRow
): FormVersionFieldSnapshot {
  return {
    id: field.id,
    type: field.type,
    label: field.label,
    placeholder: field.placeholder,
    helpText: field.helpText,
    required: field.required,
    options: field.options,
    validation: field.validation,
    conditionalLogic: field.conditionalLogic,
    sortOrder: field.sortOrder,
  };
}
