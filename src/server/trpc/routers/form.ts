import { z } from "zod";
import { eq, and, desc, sql, count } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { nanoid } from "nanoid";
import { router, protectedProcedure, publicProcedure } from "../trpc";
import { forms, formFields, formResponses, users } from "@/server/db/schema";
import { getPlanLimits } from "@/server/billing/stripe";

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
      // Check plan limits
      const limits = getPlanLimits(ctx.user.plan);
      if (limits.maxForms !== Infinity) {
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
  // Update
  // -----------------------------------------------------------------------
  update: protectedProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        title: z.string().min(1).max(200).optional(),
        description: z.string().max(2000).optional(),
        settings: z.any().optional(),
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
