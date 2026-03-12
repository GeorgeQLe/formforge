"use client";

import { useEditor } from "./editor-provider";
import { ConditionalLogicBuilder } from "./conditional-logic-builder";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { FIELD_TYPES, type FieldType } from "@/lib/field-types";
import type { FieldOption, ConditionalLogic } from "@/server/db/schema";

export function FieldProperties() {
  const { state, dispatch } = useEditor();

  const field = state.fields.find((f) => f.id === state.selectedFieldId);

  if (!field) {
    return (
      <div className="w-72 shrink-0 border-l border-gray-200 bg-white p-6 flex items-center justify-center">
        <div className="text-center">
          <svg className="w-10 h-10 text-gray-300 mx-auto mb-2" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
          </svg>
          <p className="text-sm text-gray-400">Select a field to edit its properties</p>
        </div>
      </div>
    );
  }

  const fieldMeta = FIELD_TYPES[field.type as FieldType];
  const hasOptions = fieldMeta?.hasOptions ?? false;

  const update = (updates: Record<string, unknown>) => {
    dispatch({ type: "UPDATE_FIELD", fieldId: field.id, updates: updates as any });
  };

  const addOption = () => {
    const options = field.options ?? [];
    const newOption: FieldOption = {
      label: `Option ${options.length + 1}`,
      value: `option_${options.length + 1}`,
    };
    update({ options: [...options, newOption] });
  };

  const updateOption = (index: number, updates: Partial<FieldOption>) => {
    const options = [...(field.options ?? [])];
    options[index] = { ...options[index]!, ...updates };
    update({ options });
  };

  const removeOption = (index: number) => {
    const options = (field.options ?? []).filter((_, i) => i !== index);
    update({ options });
  };

  return (
    <div className="w-72 shrink-0 border-l border-gray-200 bg-white overflow-y-auto">
      <div className="p-4 border-b border-gray-200">
        <h3 className="font-semibold text-gray-900 text-sm">Field Properties</h3>
        <p className="text-xs text-gray-400 mt-0.5">
          {fieldMeta?.label ?? field.type}
        </p>
      </div>

      <div className="p-4 space-y-5">
        {/* Label */}
        <div>
          <Label htmlFor="field-label">Label</Label>
          <Input
            id="field-label"
            value={field.label}
            onChange={(e) => update({ label: e.target.value })}
            className="mt-1.5"
          />
        </div>

        {/* Placeholder */}
        {["text", "email", "number", "textarea", "dropdown"].includes(field.type) && (
          <div>
            <Label htmlFor="field-placeholder">Placeholder</Label>
            <Input
              id="field-placeholder"
              value={field.placeholder ?? ""}
              onChange={(e) => update({ placeholder: e.target.value || null })}
              className="mt-1.5"
            />
          </div>
        )}

        {/* Help Text */}
        <div>
          <Label htmlFor="field-helptext">Help Text</Label>
          <Input
            id="field-helptext"
            value={field.helpText ?? ""}
            onChange={(e) => update({ helpText: e.target.value || null })}
            placeholder="Optional help text"
            className="mt-1.5"
          />
        </div>

        {/* Required */}
        <div className="flex items-center justify-between">
          <Label htmlFor="field-required">Required</Label>
          <button
            id="field-required"
            role="switch"
            aria-checked={field.required}
            onClick={() => update({ required: !field.required })}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              field.required ? "bg-indigo-600" : "bg-gray-200"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                field.required ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>

        {/* Options (for dropdown, radio, checkbox) */}
        {hasOptions && (
          <div>
            <Label>Options</Label>
            <div className="space-y-2 mt-2">
              {(field.options ?? []).map((option, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    value={option.label}
                    onChange={(e) => {
                      const label = e.target.value;
                      updateOption(index, {
                        label,
                        value: label.toLowerCase().replace(/\s+/g, "_"),
                      });
                    }}
                    placeholder={`Option ${index + 1}`}
                    className="flex-1"
                  />
                  <button
                    onClick={() => removeOption(index)}
                    className="text-gray-400 hover:text-red-500 shrink-0"
                    aria-label="Remove option"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
              <Button variant="ghost" size="sm" onClick={addOption}>
                <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                Add Option
              </Button>
            </div>
          </div>
        )}

        {/* Validation */}
        {["text", "textarea", "number"].includes(field.type) && (
          <div>
            <Label>Validation</Label>
            <div className="space-y-2 mt-2">
              {field.type === "number" ? (
                <>
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <Label className="text-xs">Min</Label>
                      <Input
                        type="number"
                        value={field.validation?.min ?? ""}
                        onChange={(e) =>
                          update({
                            validation: {
                              ...field.validation,
                              min: e.target.value ? Number(e.target.value) : undefined,
                            },
                          })
                        }
                        className="mt-1"
                      />
                    </div>
                    <div className="flex-1">
                      <Label className="text-xs">Max</Label>
                      <Input
                        type="number"
                        value={field.validation?.max ?? ""}
                        onChange={(e) =>
                          update({
                            validation: {
                              ...field.validation,
                              max: e.target.value ? Number(e.target.value) : undefined,
                            },
                          })
                        }
                        className="mt-1"
                      />
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <Label className="text-xs">Min Length</Label>
                      <Input
                        type="number"
                        value={field.validation?.min ?? ""}
                        onChange={(e) =>
                          update({
                            validation: {
                              ...field.validation,
                              min: e.target.value ? Number(e.target.value) : undefined,
                            },
                          })
                        }
                        className="mt-1"
                      />
                    </div>
                    <div className="flex-1">
                      <Label className="text-xs">Max Length</Label>
                      <Input
                        type="number"
                        value={field.validation?.max ?? ""}
                        onChange={(e) =>
                          update({
                            validation: {
                              ...field.validation,
                              max: e.target.value ? Number(e.target.value) : undefined,
                            },
                          })
                        }
                        className="mt-1"
                      />
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs">Pattern (RegExp)</Label>
                    <Input
                      value={field.validation?.pattern ?? ""}
                      onChange={(e) =>
                        update({
                          validation: {
                            ...field.validation,
                            pattern: e.target.value || undefined,
                          },
                        })
                      }
                      placeholder="e.g. ^[A-Za-z]+$"
                      className="mt-1"
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Rating settings */}
        {field.type === "rating" && (
          <div>
            <Label>Rating Scale</Label>
            <div className="flex gap-2 mt-2">
              <div className="flex-1">
                <Label className="text-xs">Min</Label>
                <Input
                  type="number"
                  value={field.validation?.min ?? 1}
                  onChange={(e) =>
                    update({
                      validation: {
                        ...field.validation,
                        min: Number(e.target.value),
                      },
                    })
                  }
                  className="mt-1"
                />
              </div>
              <div className="flex-1">
                <Label className="text-xs">Max</Label>
                <Input
                  type="number"
                  value={field.validation?.max ?? 5}
                  onChange={(e) =>
                    update({
                      validation: {
                        ...field.validation,
                        max: Number(e.target.value),
                      },
                    })
                  }
                  className="mt-1"
                />
              </div>
            </div>
          </div>
        )}

        {/* File upload settings */}
        {field.type === "file_upload" && (
          <div>
            <Label>File Upload Settings</Label>
            <div className="space-y-2 mt-2">
              <div>
                <Label className="text-xs">Allowed Types (comma-separated)</Label>
                <Input
                  value={field.validation?.fileTypes?.join(", ") ?? ""}
                  onChange={(e) =>
                    update({
                      validation: {
                        ...field.validation,
                        fileTypes: e.target.value
                          .split(",")
                          .map((t) => t.trim())
                          .filter(Boolean),
                      },
                    })
                  }
                  placeholder="pdf, jpg, png"
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="text-xs">Max File Size (MB)</Label>
                <Input
                  type="number"
                  value={
                    field.validation?.maxFileSize
                      ? field.validation.maxFileSize / (1024 * 1024)
                      : ""
                  }
                  onChange={(e) =>
                    update({
                      validation: {
                        ...field.validation,
                        maxFileSize: e.target.value
                          ? Number(e.target.value) * 1024 * 1024
                          : undefined,
                      },
                    })
                  }
                  placeholder="10"
                  className="mt-1"
                />
              </div>
            </div>
          </div>
        )}

        {/* Conditional Logic */}
        <div className="pt-4 border-t border-gray-100">
          <Label className="mb-2 block">Conditional Logic</Label>
          <ConditionalLogicBuilder
            fieldId={field.id}
            conditionalLogic={field.conditionalLogic ?? null}
            onChange={(logic) => update({ conditionalLogic: logic })}
          />
        </div>
      </div>
    </div>
  );
}
