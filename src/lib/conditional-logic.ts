import type { ConditionalLogic, ConditionalLogicCondition } from "@/server/db/schema";

/**
 * Evaluate a single condition against the current form values.
 */
function evaluateCondition(
  condition: ConditionalLogicCondition,
  allValues: Record<string, string | undefined>
): boolean {
  const fieldValue = allValues[condition.fieldId] ?? "";
  const compareValue = condition.value ?? "";

  switch (condition.operator) {
    case "equals":
      return fieldValue === compareValue;
    case "not_equals":
      return fieldValue !== compareValue;
    case "contains":
      return fieldValue.toLowerCase().includes(compareValue.toLowerCase());
    case "greater_than": {
      const numField = parseFloat(fieldValue);
      const numCompare = parseFloat(compareValue);
      return !isNaN(numField) && !isNaN(numCompare) && numField > numCompare;
    }
    case "less_than": {
      const numField = parseFloat(fieldValue);
      const numCompare = parseFloat(compareValue);
      return !isNaN(numField) && !isNaN(numCompare) && numField < numCompare;
    }
    case "is_empty":
      return fieldValue.trim() === "";
    case "is_not_empty":
      return fieldValue.trim() !== "";
    default:
      return true;
  }
}

/**
 * Determine whether a field should be visible based on its conditional logic
 * and all current form values.
 *
 * Returns `true` if the field should be shown (visible), `false` if hidden.
 * Fields without conditional logic are always visible.
 */
export function evaluateConditionalLogic(
  conditionalLogic: ConditionalLogic | null | undefined,
  allValues: Record<string, string | undefined>
): boolean {
  if (!conditionalLogic || !conditionalLogic.showWhen || conditionalLogic.showWhen.length === 0) {
    return true;
  }

  const { showWhen, logic, action } = conditionalLogic;

  const results = showWhen.map((condition) => evaluateCondition(condition, allValues));

  const conditionsMet =
    logic === "AND" ? results.every(Boolean) : results.some(Boolean);

  // If action is "show", field is visible when conditions are met.
  // If action is "hide", field is hidden when conditions are met.
  return action === "show" ? conditionsMet : !conditionsMet;
}
