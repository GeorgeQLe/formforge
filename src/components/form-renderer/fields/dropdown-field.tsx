"use client";

import type { FieldComponentProps } from "../form-renderer";

export function DropdownField({ field, value, onChange, error, readonly }: FieldComponentProps) {
  return (
    <div>
      <label htmlFor={field.id} className="block text-sm font-medium mb-1.5">
        {field.label}
        {field.required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {field.helpText && (
        <p className="text-xs text-gray-500 mb-1.5">{field.helpText}</p>
      )}
      <select
        id={field.id}
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        disabled={readonly}
        aria-required={field.required}
        aria-invalid={!!error}
        aria-describedby={error ? `${field.id}-error` : undefined}
        className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        <option value="">{field.placeholder ?? "Select an option..."}</option>
        {(field.options ?? []).map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p id={`${field.id}-error`} className="text-xs text-red-500 mt-1">
          {error}
        </p>
      )}
    </div>
  );
}
