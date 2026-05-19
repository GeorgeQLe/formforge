import { z } from "zod";
import { eq, and, desc, count, asc } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { nanoid } from "nanoid";
import { router, protectedProcedure, publicProcedure } from "../trpc";
import { forms, formFields, formResponses } from "@/server/db/schema";
import { getPlanLimits } from "@/server/billing/stripe";
import { generateAIFormDefinition, resolveAIConditionalLogic } from "@/server/ai/generate-form";
import type { Context } from "../context";

function slugify(text: string): string {
  return (
    text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_]+/g, "-")
      .replace(/-+/g, "-")
      .substring(0, 50) +
    "-" +
    nanoid(6)
  );
}

async function enforceFormLimit(ctx: {
  db: Context["db"];
  user: { id: string; plan: string };
}) {
  const limits = getPlanLimits(ctx.user.plan);
  if (limits.maxForms === Infinity) return;

  const [{ formCount }] = await ctx.db
    .select({ formCount: count() })
    .from(forms)
    .where(eq(forms.userId, ctx.user.id));

  if (formCount >= limits.maxForms) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: `You have reached the maximum of ${limits.maxForms} forms on your plan. Please upgrade.`,
    });
  }
}

export const formRouter = router({
  // -----------------------------------------------------------------------
  // List all forms for the authenticated user
  // -----------------------------------------------------------------------
  list: protectedProcedure.query(async ({ ctx }) => {
    const userForms = await ctx.db
      .select({
        id: forms.id,
        title: forms.title,
        slug: forms.slug,
        status: forms.status,
        createdAt: forms.createdAt,
        updatedAt: forms.updatedAt,
        responseCount: count(formResponses.id),
      })
      .from(forms)
      .leftJoin(formResponses, eq(forms.id, formResponses.formId))
      .where(eq(forms.userId, ctx.user.id))
      .groupBy(forms.id)
      .orderBy(desc(forms.updatedAt));

    return userForms;
  }),

  // -----------------------------------------------------------------------
  // Get form by ID (authenticated, for editor)
  // -----------------------------------------------------------------------
  getById: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const [form] = await ctx.db
        .select()
        .from(forms)
        .where(and(eq(forms.id, input.id), eq(forms.userId, ctx.user.id)))
        .limit(1);

      if (!form) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Form not found" });
      }

      return form;
    }),

  // -----------------------------------------------------------------------
  // Get form by slug (public, for filling out)
  // -----------------------------------------------------------------------
  getBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ ctx, input }) => {
      const [form] = await ctx.db
        .select()
        .from(forms)
        .where(eq(forms.slug, input.slug))
        .limit(1);

      if (!form) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Form not found" });
      }

      return form;
    }),

  // -----------------------------------------------------------------------
  // Create
  // -----------------------------------------------------------------------
  create: protectedProcedure
    .input(
      z.object({
        title: z.string().min(1).max(200),
        description: z.string().max(2000).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await enforceFormLimit(ctx);
      const slug = slugify(input.title);

      const [form] = await ctx.db
        .insert(forms)
        .values({
          userId: ctx.user.id,
          title: input.title,
          description: input.description ?? null,
          slug,
        })
        .returning();

      return form!;
    }),

  // -----------------------------------------------------------------------
  // Duplicate
  // -----------------------------------------------------------------------
  duplicate: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const [source] = await ctx.db
        .select()
        .from(forms)
        .where(and(eq(forms.id, input.id), eq(forms.userId, ctx.user.id)))
        .limit(1);

      if (!source) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Form not found" });
      }

      await enforceFormLimit(ctx);

      const copiedTitle = `${source.title} copy`;
      const [copiedForm] = await ctx.db
        .insert(forms)
        .values({
          userId: ctx.user.id,
          title: copiedTitle,
          description: source.description,
          slug: slugify(copiedTitle),
          status: "draft",
          settings: source.settings,
          themeId: source.themeId,
        })
        .returning();

      const sourceFields = await ctx.db
        .select()
        .from(formFields)
        .where(eq(formFields.formId, source.id))
        .orderBy(asc(formFields.sortOrder));

      if (sourceFields.length > 0) {
        await ctx.db.insert(formFields).values(
          sourceFields.map((field) => ({
            formId: copiedForm!.id,
            type: field.type,
            label: field.label,
            placeholder: field.placeholder,
            helpText: field.helpText,
            required: field.required,
            options: field.options,
            validation: field.validation,
            conditionalLogic: field.conditionalLogic,
            sortOrder: field.sortOrder,
          }))
        );
      }

      return copiedForm!;
    }),

  // -----------------------------------------------------------------------
  // Update
  // -----------------------------------------------------------------------
  update: protectedProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        title: z.string().min(1).max(200).optional(),
        description: z.string().max(2000).optional(),
        settings: z.object({
          notificationEmails: z.array(z.string().email()).optional(),
          responseLimit: z.number().int().positive().optional(),
          closeDate: z.string().datetime().optional(),
          redirectUrl: z.string().url().optional(),
          successMessage: z.string().max(500).optional(),
          gdprConsentEnabled: z.boolean().optional(),
        }).strict().optional(),
        themeId: z.string().uuid().nullable().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;

      const [existing] = await ctx.db
        .select()
        .from(forms)
        .where(and(eq(forms.id, id), eq(forms.userId, ctx.user.id)))
        .limit(1);

      if (!existing) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Form not found" });
      }

      const updateData: Record<string, unknown> = { updatedAt: new Date() };
      if (data.title !== undefined) updateData.title = data.title;
      if (data.description !== undefined) updateData.description = data.description;
      if (data.settings !== undefined) updateData.settings = data.settings;
      if (data.themeId !== undefined) updateData.themeId = data.themeId;

      const [updated] = await ctx.db
        .update(forms)
        .set(updateData)
        .where(eq(forms.id, id))
        .returning();

      return updated!;
    }),

  // -----------------------------------------------------------------------
  // Regenerate an existing form with AI
  // -----------------------------------------------------------------------
  regenerateWithAI: protectedProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        prompt: z.string().min(1).max(2000),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const [existing] = await ctx.db
        .select()
        .from(forms)
        .where(and(eq(forms.id, input.id), eq(forms.userId, ctx.user.id)))
        .limit(1);

      if (!existing) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Form not found" });
      }

      const currentFields = await ctx.db
        .select()
        .from(formFields)
        .where(eq(formFields.formId, input.id))
        .orderBy(asc(formFields.sortOrder));

      const generated = await generateAIFormDefinition(input.prompt, {
        title: existing.title,
        description: existing.description,
        fields: currentFields.map((field) => ({
          type: field.type,
          label: field.label,
          required: field.required,
          options: field.options,
          validation: field.validation,
        })),
      });

      const [updatedForm] = await ctx.db
        .update(forms)
        .set({
          title: generated.title,
          description: generated.description,
          updatedAt: new Date(),
        })
        .where(eq(forms.id, input.id))
        .returning();

      await ctx.db.delete(formFields).where(eq(formFields.formId, input.id));

      const insertedFields: (typeof formFields.$inferSelect)[] = [];
      for (let i = 0; i < generated.fields.length; i++) {
        const field = generated.fields[i]!;
        const [inserted] = await ctx.db
          .insert(formFields)
          .values({
            formId: input.id,
            type: field.type,
            label: field.label,
            placeholder: field.placeholder ?? null,
            helpText: field.helpText ?? null,
            required: field.required,
            options: field.options ?? null,
            validation: field.validation ?? null,
            conditionalLogic: null,
            sortOrder: i,
          })
          .returning();

        insertedFields.push(inserted!);
      }

      const conditionalUpdates = resolveAIConditionalLogic(generated.fields, insertedFields);
      for (const update of conditionalUpdates) {
        if (!update) continue;
        await ctx.db
          .update(formFields)
          .set({ conditionalLogic: update.conditionalLogic })
          .where(eq(formFields.id, update.fieldId));

        const fieldIndex = insertedFields.findIndex((field) => field.id === update.fieldId);
        if (fieldIndex >= 0) {
          insertedFields[fieldIndex] = {
            ...insertedFields[fieldIndex]!,
            conditionalLogic: update.conditionalLogic,
          };
        }
      }

      return { form: updatedForm!, fields: insertedFields };
    }),

  // -----------------------------------------------------------------------
  // Delete
  // -----------------------------------------------------------------------
  delete: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const [existing] = await ctx.db
        .select()
        .from(forms)
        .where(and(eq(forms.id, input.id), eq(forms.userId, ctx.user.id)))
        .limit(1);

      if (!existing) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Form not found" });
      }

      await ctx.db.delete(forms).where(eq(forms.id, input.id));
      return { success: true };
    }),

  // -----------------------------------------------------------------------
  // Publish
  // -----------------------------------------------------------------------
  publish: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const [existing] = await ctx.db
        .select()
        .from(forms)
        .where(and(eq(forms.id, input.id), eq(forms.userId, ctx.user.id)))
        .limit(1);

      if (!existing) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      // Make sure form has at least one field
      const [{ fieldCount }] = await ctx.db
        .select({ fieldCount: count() })
        .from(formFields)
        .where(eq(formFields.formId, input.id));

      if (fieldCount === 0) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Cannot publish a form with no fields",
        });
      }

      const [updated] = await ctx.db
        .update(forms)
        .set({ status: "published", updatedAt: new Date() })
        .where(eq(forms.id, input.id))
        .returning();

      return updated!;
    }),

  // -----------------------------------------------------------------------
  // Close
  // -----------------------------------------------------------------------
  close: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const [existing] = await ctx.db
        .select()
        .from(forms)
        .where(and(eq(forms.id, input.id), eq(forms.userId, ctx.user.id)))
        .limit(1);

      if (!existing) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      const [updated] = await ctx.db
        .update(forms)
        .set({ status: "closed", updatedAt: new Date() })
        .where(eq(forms.id, input.id))
        .returning();

      return updated!;
    }),
});
