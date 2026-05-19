"use client";

import type { FieldComponentProps } from "../form-renderer";
import { getDescribedBy, getFieldAccessibilityIds } from "../accessibility";

export function TextField({ field, value, onChange, error, readonly }: FieldComponentProps) {
  const { helpId, errorId } = getFieldAccessibilityIds(field.id);
  const describedBy = getDescribedBy({
    helpText: field.helpText,
    helpId,
    error,
    errorId,
  });

  return (
    <div>
      <label htmlFor={field.id} className="block text-sm font-medium mb-1.5">
        {field.label}
        {field.required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {field.helpText && (
        <p id={helpId} className="text-xs text-gray-500 mb-1.5">{field.helpText}</p>
      )}
      <input
        id={field.id}
        type="text"
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={field.placeholder ?? ""}
        disabled={readonly}
        aria-required={field.required}
        aria-invalid={!!error}
        aria-describedby={describedBy}
        className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 disabled:opacity-60 disabled:cursor-not-allowed"
      />
      {error && (
        <p id={errorId} className="text-xs text-red-500 mt-1">
          {error}
        </p>
      )}
    </div>
  );
}
