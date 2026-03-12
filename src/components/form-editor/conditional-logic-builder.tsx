"use client";

import { useEditor } from "./editor-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import type { ConditionalLogic, ConditionalLogicCondition } from "@/server/db/schema";

const OPERATORS = [
  { value: "equals", label: "equals" },
  { value: "not_equals", label: "does not equal" },
  { value: "contains", label: "contains" },
  { value: "greater_than", label: "is greater than" },
  { value: "less_than", label: "is less than" },
  { value: "is_empty", label: "is empty" },
  { value: "is_not_empty", label: "is not empty" },
] as const;

const VALUE_FREE_OPERATORS = ["is_empty", "is_not_empty"];

interface ConditionalLogicBuilderProps {
  fieldId: string;
  conditionalLogic: ConditionalLogic | null;
  onChange: (logic: ConditionalLogic | null) => void;
}

export function ConditionalLogicBuilder({
  fieldId,
  conditionalLogic,
  onChange,
}: ConditionalLogicBuilderProps) {
  const { state } = useEditor();

  // Only show other fields as options (not self)
  const otherFields = state.fields.filter((f) => f.id !== fieldId);

  const logic: ConditionalLogic = conditionalLogic ?? {
    showWhen: [],
    logic: "AND",
    action: "show",
  };

  const addCondition = () => {
    if (otherFields.length === 0) return;
    const newCondition: ConditionalLogicCondition = {
      fieldId: otherFields[0]!.id,
      operator: "equals",
      value: "",
    };
    onChange({
      ...logic,
      showWhen: [...logic.showWhen, newCondition],
    });
  };

  const removeCondition = (index: number) => {
    const newShowWhen = logic.showWhen.filter((_, i) => i !== index);
    if (newShowWhen.length === 0) {
      onChange(null);
    } else {
      onChange({ ...logic, showWhen: newShowWhen });
    }
  };

  const updateCondition = (
    index: number,
    updates: Partial<ConditionalLogicCondition>
  ) => {
    const newShowWhen = logic.showWhen.map((c, i) =>
      i === index ? { ...c, ...updates } : c
    );
    onChange({ ...logic, showWhen: newShowWhen });
  };

  if (otherFields.length === 0) {
    return (
      <p className="text-xs text-gray-400">
        Add more fields to use conditional logic.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {/* Action */}
      <div className="flex items-center gap-2">
        <Select
          value={logic.action}
          onChange={(e) =>
            onChange({ ...logic, action: e.target.value as "show" | "hide" })
          }
          className="w-24"
        >
          <option value="show">Show</option>
          <option value="hide">Hide</option>
        </Select>
        <span className="text-sm text-gray-500">this field when</span>
      </div>

      {/* Conditions */}
      {logic.showWhen.map((condition, index) => {
        const targetField = otherFields.find((f) => f.id === condition.fieldId);
        const hasOptions =
          targetField?.type === "dropdown" ||
          targetField?.type === "radio" ||
          targetField?.type === "checkbox";
        const needsValue = !VALUE_FREE_OPERATORS.includes(condition.operator);

        return (
          <div key={index} className="space-y-2">
            {index > 0 && (
              <Select
                value={logic.logic}
                onChange={(e) =>
                  onChange({
                    ...logic,
                    logic: e.target.value as "AND" | "OR",
                  })
                }
                className="w-20"
              >
                <option value="AND">AND</option>
                <option value="OR">OR</option>
              </Select>
            )}

            <div className="flex items-center gap-2 flex-wrap">
              {/* Field selector */}
              <Select
                value={condition.fieldId}
                onChange={(e) =>
                  updateCondition(index, { fieldId: e.target.value })
                }
                className="flex-1 min-w-[120px]"
              >
                {otherFields.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.label}
                  </option>
                ))}
              </Select>

              {/* Operator */}
              <Select
                value={condition.operator}
                onChange={(e) =>
                  updateCondition(index, {
                    operator: e.target.value as ConditionalLogicCondition["operator"],
                  })
                }
                className="w-40"
              >
                {OPERATORS.map((op) => (
                  <option key={op.value} value={op.value}>
                    {op.label}
                  </option>
                ))}
              </Select>

              {/* Value */}
              {needsValue && (
                <>
                  {hasOptions && targetField?.options ? (
                    <Select
                      value={condition.value ?? ""}
                      onChange={(e) =>
                        updateCondition(index, { value: e.target.value })
                      }
                      className="flex-1 min-w-[120px]"
                    >
                      <option value="">Select...</option>
                      {targetField.options.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </Select>
                  ) : (
                    <Input
                      value={condition.value ?? ""}
                      onChange={(e) =>
                        updateCondition(index, { value: e.target.value })
                      }
                      placeholder="Value"
                      className="flex-1 min-w-[100px]"
                    />
                  )}
                </>
              )}

              {/* Remove */}
              <button
                onClick={() => removeCondition(index)}
                className="text-gray-400 hover:text-red-500 shrink-0"
                aria-label="Remove condition"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        );
      })}

      <Button variant="ghost" size="sm" onClick={addCondition}>
        <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
        Add Condition
      </Button>
    </div>
  );
}
