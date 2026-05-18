import { describe, expect, it } from "vitest";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { formatTRPCErrorShape } from "@/server/trpc/error-formatting";

const baseShape = {
  message: "Raw database error",
  code: -32603,
  data: {
    code: "INTERNAL_SERVER_ERROR",
    httpStatus: 500,
    path: "form.create",
  },
};

describe("formatTRPCErrorShape", () => {
  it("masks unexpected server errors", () => {
    const formatted = formatTRPCErrorShape({
      shape: baseShape,
      error: new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Raw database error",
      }),
    });

    expect(formatted.message).toBe("Something went wrong. Try again.");
    expect(formatted.data.code).toBe("INTERNAL_SERVER_ERROR");
    expect(formatted.data.validationErrors).toBeNull();
  });

  it("returns user-facing messages for known client errors", () => {
    const formatted = formatTRPCErrorShape({
      shape: baseShape,
      error: new TRPCError({
        code: "UNAUTHORIZED",
        message: "Clerk user id missing",
      }),
    });

    expect(formatted.message).toBe("Sign in to continue.");
    expect(formatted.data.code).toBe("UNAUTHORIZED");
  });

  it("preserves flattened Zod validation details for bad requests", () => {
    const schema = z.object({
      title: z.string().min(3),
    });
    const parsed = schema.safeParse({ title: "" });
    if (parsed.success) throw new Error("Expected schema parse to fail");

    const formatted = formatTRPCErrorShape({
      shape: baseShape,
      error: new TRPCError({
        code: "BAD_REQUEST",
        message: "Validation failed",
        cause: parsed.error,
      }),
    });

    expect(formatted.message).toBe(
      "Some fields need attention before this can be saved."
    );
    expect(formatted.data.code).toBe("BAD_REQUEST");
    expect(formatted.data.validationErrors).toMatchObject({
      fieldErrors: {
        title: expect.arrayContaining([expect.any(String)]),
      },
    });
  });
});
