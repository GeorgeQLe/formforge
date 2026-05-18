import { TRPCError } from "@trpc/server";
import { ZodError } from "zod";

type ErrorShape = {
  message: string;
  data: Record<string, unknown>;
};

const PUBLIC_ERROR_MESSAGES: Partial<Record<TRPCError["code"], string>> = {
  BAD_REQUEST: "The request could not be completed. Check the highlighted fields and try again.",
  UNAUTHORIZED: "Sign in to continue.",
  FORBIDDEN: "You do not have access to this action.",
  NOT_FOUND: "The requested item could not be found.",
  CONFLICT: "This action conflicts with the current state. Refresh and try again.",
  TOO_MANY_REQUESTS: "Too many requests. Wait a moment and try again.",
  PRECONDITION_FAILED: "This action cannot be completed yet.",
  PAYLOAD_TOO_LARGE: "The submitted data is too large.",
  METHOD_NOT_SUPPORTED: "This action is not supported.",
  TIMEOUT: "The request timed out. Try again.",
  CLIENT_CLOSED_REQUEST: "The request was cancelled.",
};

function getZodError(cause: unknown): ZodError | null {
  if (cause instanceof ZodError) return cause;

  if (
    cause instanceof Error &&
    "cause" in cause &&
    cause.cause instanceof ZodError
  ) {
    return cause.cause;
  }

  return null;
}

export function formatTRPCErrorShape({
  shape,
  error,
}: {
  shape: ErrorShape;
  error: TRPCError;
}) {
  const zodError = getZodError(error.cause);
  const isValidationError = error.code === "BAD_REQUEST" && zodError;
  const publicMessage =
    isValidationError
      ? "Some fields need attention before this can be saved."
      : PUBLIC_ERROR_MESSAGES[error.code] ?? "Something went wrong. Try again.";

  return {
    ...shape,
    message: publicMessage,
    data: {
      ...shape.data,
      code: error.code,
      validationErrors: isValidationError ? zodError.flatten() : null,
    },
  };
}
