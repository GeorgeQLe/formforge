import { z } from "zod";
import { eq, and, asc } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { router, protectedProcedure } from "../trpc";
import { forms, formFields } from "@/server/db/schema";

const fieldInputSchema = z.object({
  type: z.enum([
    "text",
    "email",
    "number",
    "dropdown",
    "radio",
    "checkbox",
    "textarea",
    "date",
    "rating",
    "file_upload",
  ]),
  label: z.string().min(1).max(200),
  placeholder: z.string().max(200).optional(),
  helpText: z.string().max(500).optional(),
  required: z.boolean().optional(),
  options: z
    .array(z.object({ label: z.string(), value: z.string() }))
    .optional(),
  validation: z
    .object({
      min: z.number().optional(),
      max: z.number().optional(),
      pattern: z.string().optional(),
      fileTypes: z.array(z.string()).optional(),
      maxFileSize: z.number().optional(),
    })
    .optional(),
  conditionalLogic: z
    .object({
      showWhen: z.array(
        z.object({
          fieldId: z.string(),
          operator: z.enum([
            "equals",
            "not_equals",
            "contains",
            "greater_than",
            "less_than",
            "is_empty",
            "is_not_empty",
          ]),
          value: z.string().optional(),
        })
      ),
      logic: z.enum(["AND", "OR"]),
      action: z.enum(["show", "hide"]),
    })
    .optional(),
  sortOrder: z.number().int().optional(),
});

/** Verify the form belongs to the current user */
async function verifyFormOwnership(
  db: any,
  formId: string,
  userId: string
) {
  const [form] = await db
    .select({ id: forms.id })
    .from(forms)
    .where(and(eq(forms.id, formId), eq(forms.userId, userId)))
    .limit(1);

  if (!form) {
    throw new TRPCError({ code: "NOT_FOUND", message: "Form not found" });
  }
}

export const fieldRouter = router({
  // -----------------------------------------------------------------------
  // List fields for a form
  // -----------------------------------------------------------------------
  list: protectedProcedure
    .input(z.object({ formId: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      await verifyFormOwnership(ctx.db, input.formId, ctx.user.id);

      return ctx.db
        .select()
        .from(formFields)
        .where(eq(formFields.formId, input.formId))
        .orderBy(asc(formFields.sortOrder));
    }),

  // -----------------------------------------------------------------------
  // Create
  // -----------------------------------------------------------------------
  create: protectedProcedure
    .input(z.object({ formId: z.string().uuid() }).merge(fieldInputSchema))
    .mutation(async ({ ctx, input }) => {
      await verifyFormOwnership(ctx.db, input.formId, ctx.user.id);

      const { formId, ...fieldData } = input;

      const [field] = await ctx.db
        .insert(formFields)
        .values({
          formId,
          type: fieldData.type,
          label: fieldData.label,
          placeholder: fieldData.placeholder ?? null,
          helpText: fieldData.helpText ?? null,
          required: fieldData.required ?? false,
          options: fieldData.options ?? null,
          validation: fieldData.validation ?? null,
          conditionalLogic: fieldData.conditionalLogic ?? null,
          sortOrder: fieldData.sortOrder ?? 0,
        })
        .returning();

      return field!;
    }),

  // -----------------------------------------------------------------------
  // Update
  // -----------------------------------------------------------------------
  update: protectedProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        formId: z.string().uuid(),
      }).merge(fieldInputSchema.partial())
    )
    .mutation(async ({ ctx, input }) => {
      await verifyFormOwnership(ctx.db, input.formId, ctx.user.id);

      const { id, formId, ...data } = input;
      const updateData: Record<string, unknown> = {};

      if (data.type !== undefined) updateData.type = data.type;
      if (data.label !== undefined) updateData.label = data.label;
      if (data.placeholder !== undefined) updateData.placeholder = data.placeholder;
      if (data.helpText !== undefined) updateData.helpText = data.helpText;
      if (data.required !== undefined) updateData.required = data.required;
      if (data.options !== undefined) updateData.options = data.options;
      if (data.validation !== undefined) updateData.validation = data.validation;
      if (data.conditionalLogic !== undefined) updateData.conditionalLogic = data.conditionalLogic;
      if (data.sortOrder !== undefined) updateData.sortOrder = data.sortOrder;

      const [updated] = await ctx.db
        .update(formFields)
        .set(updateData)
        .where(eq(formFields.id, id))
        .returning();

      if (!updated) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Field not found" });
      }

      return updated;
    }),

  // -----------------------------------------------------------------------
  // Delete
  // -----------------------------------------------------------------------
  delete: protectedProcedure
    .input(z.object({ id: z.string().uuid(), formId: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      await verifyFormOwnership(ctx.db, input.formId, ctx.user.id);

      await ctx.db.delete(formFields).where(eq(formFields.id, input.id));
      return { success: true };
    }),

  // -----------------------------------------------------------------------
  // Reorder (bulk update sortOrder)
  // -----------------------------------------------------------------------
  reorder: protectedProcedure
    .input(
      z.object({
        formId: z.string().uuid(),
        fieldIds: z.array(z.string().uuid()),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await verifyFormOwnership(ctx.db, input.formId, ctx.user.id);

      // Update each field's sortOrder to match its index in the array
      const updates = input.fieldIds.map((fieldId, index) =>
        ctx.db
          .update(formFields)
          .set({ sortOrder: index })
          .where(eq(formFields.id, fieldId))
      );

      await Promise.all(updates);
      return { success: true };
    }),
});
