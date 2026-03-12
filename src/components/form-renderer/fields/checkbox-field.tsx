"use client";

import type { FieldComponentProps } from "../form-renderer";

export function CheckboxField({ field, value, onChange, error, readonly }: FieldComponentProps) {
  const selectedValues = value ? value.split(",").map((v) => v.trim()).filter(Boolean) : [];

  const handleToggle = (optionValue: string) => {
    if (readonly) return;
    const newValues = selectedValues.includes(optionValue)
      ? selectedValues.filter((v) => v !== optionValue)
      : [...selectedValues, optionValue];
    onChange(newValues.join(","));
  };

  return (
    <fieldset>
      <legend className="block text-sm font-medium mb-1.5">
        {field.label}
        {field.required && <span className="text-red-500 ml-1">*</span>}
      </legend>
      {field.helpText && (
        <p className="text-xs text-gray-500 mb-2">{field.helpText}</p>
      )}
      <div className="space-y-2" role="group" aria-required={field.required}>
        {(field.options ?? []).map((option) => (
          <label
            key={option.value}
            className="flex items-center gap-3 p-2.5 rounded-lg border cursor-pointer hover:bg-gray-50 transition-colors"
          >
            <input
              type="checkbox"
              value={option.value}
              checked={selectedValues.includes(option.value)}
              onChange={() => handleToggle(option.value)}
              disabled={readonly}
              className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
            />
            <span className="text-sm">{option.label}</span>
          </label>
        ))}
      </div>
      {error && (
        <p id={`${field.id}-error`} className="text-xs text-red-500 mt-1">
          {error}
        </p>
      )}
    </fieldset>
  );
}
