export function getFieldAccessibilityIds(fieldId: string) {
  return {
    helpId: `${fieldId}-help`,
    errorId: `${fieldId}-error`,
  };
}

export function getDescribedBy({
  helpText,
  helpId,
  error,
  errorId,
}: {
  helpText?: string | null;
  helpId: string;
  error?: string;
  errorId: string;
}) {
  return [helpText ? helpId : null, error ? errorId : null]
    .filter(Boolean)
    .join(" ") || undefined;
}
