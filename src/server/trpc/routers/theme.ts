import { z } from "zod";
import { and, count, desc, eq, or } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { router, protectedProcedure } from "../trpc";
import { forms, themes } from "@/server/db/schema";
import { themeColorsSchema, themeNameSchema } from "@/server/themes/validation";

function visibleThemesWhere(userId: string) {
  return or(eq(themes.isSystem, true), eq(themes.userId, userId));
}

export const themeRouter = router({
  list: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db
      .select()
      .from(themes)
      .where(visibleThemesWhere(ctx.user.id))
      .orderBy(desc(themes.isSystem), desc(themes.createdAt));
  }),

  create: protectedProcedure
    .input(
      z.object({
        name: themeNameSchema,
        colors: themeColorsSchema,
      })
    )
    .mutation(async ({ ctx, input }) => {
      const [theme] = await ctx.db
        .insert(themes)
        .values({
          userId: ctx.user.id,
          name: input.name,
          colors: input.colors,
          isSystem: false,
        })
        .returning();

      return theme!;
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        name: themeNameSchema,
        colors: themeColorsSchema,
      })
    )
    .mutation(async ({ ctx, input }) => {
      const [existing] = await ctx.db
        .select()
        .from(themes)
        .where(and(eq(themes.id, input.id), eq(themes.userId, ctx.user.id)))
        .limit(1);

      if (!existing) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Theme not found" });
      }

      if (existing.isSystem) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "System themes cannot be edited",
        });
      }

      const [theme] = await ctx.db
        .update(themes)
        .set({ name: input.name, colors: input.colors })
        .where(and(eq(themes.id, input.id), eq(themes.userId, ctx.user.id)))
        .returning();

      return theme!;
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const [existing] = await ctx.db
        .select()
        .from(themes)
        .where(and(eq(themes.id, input.id), eq(themes.userId, ctx.user.id)))
        .limit(1);

      if (!existing) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Theme not found" });
      }

      if (existing.isSystem) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "System themes cannot be deleted",
        });
      }

      const [{ formCount }] = await ctx.db
        .select({ formCount: count() })
        .from(forms)
        .where(and(eq(forms.userId, ctx.user.id), eq(forms.themeId, input.id)));

      if (formCount > 0) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Theme is assigned to one or more forms",
        });
      }

      await ctx.db
        .delete(themes)
        .where(and(eq(themes.id, input.id), eq(themes.userId, ctx.user.id)));

      return { success: true };
    }),
});

