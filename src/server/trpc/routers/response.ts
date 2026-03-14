import { z } from "zod";
import { eq, and, desc, sql, count, gte } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { router, protectedProcedure } from "../trpc";
import {
  forms,
  formFields,
  formResponses,
  fieldResponses,
} from "@/server/db/schema";

export const responseRouter = router({
  // -----------------------------------------------------------------------
  // List responses for a form (with pagination)
  // -----------------------------------------------------------------------
  list: protectedProcedure
    .input(
      z.object({
        formId: z.string().uuid(),
        page: z.number().int().min(1).default(1),
        pageSize: z.number().int().min(1).max(100).default(25),
        status: z.enum(["new", "read", "starred", "archived"]).optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      // Verify ownership
      const [form] = await ctx.db
        .select()
        .from(forms)
        .where(and(eq(forms.id, input.formId), eq(forms.userId, ctx.user.id)))
        .limit(1);

      if (!form) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      const offset = (input.page - 1) * input.pageSize;

      const whereConditions = input.status
        ? and(
            eq(formResponses.formId, input.formId),
            eq(formResponses.status, input.status)
          )
        : eq(formResponses.formId, input.formId);

      const [responses, [{ total }]] = await Promise.all([
        ctx.db
          .select()
          .from(formResponses)
          .where(whereConditions)
          .orderBy(desc(formResponses.submittedAt))
          .limit(input.pageSize)
          .offset(offset),
        ctx.db
          .select({ total: count() })
          .from(formResponses)
          .where(whereConditions),
      ]);

      // Fetch field responses for all listed responses
      const responseIds = responses.map((r) => r.id);
      let allFieldResponses: (typeof fieldResponses.$inferSelect)[] = [];

      if (responseIds.length > 0) {
        allFieldResponses = await ctx.db
          .select()
          .from(fieldResponses)
          .where(
            sql`${fieldResponses.responseId} IN (${sql.join(
              responseIds.map((id) => sql`${id}`),
              sql`, `
            )})`
          );
      }

      // Group field responses by response ID
      const fieldResponsesByResponseId = new Map<
        string,
        (typeof fieldResponses.$inferSelect)[]
      >();
      for (const fr of allFieldResponses) {
        const existing = fieldResponsesByResponseId.get(fr.responseId) ?? [];
        existing.push(fr);
        fieldResponsesByResponseId.set(fr.responseId, existing);
      }

      return {
        responses: responses.map((r) => ({
          ...r,
          fieldResponses: fieldResponsesByResponseId.get(r.id) ?? [],
        })),
        total,
        page: input.page,
        pageSize: input.pageSize,
        totalPages: Math.ceil(total / input.pageSize),
      };
    }),

  // -----------------------------------------------------------------------
  // Get response by ID
  // -----------------------------------------------------------------------
  getById: protectedProcedure
    .input(z.object({ id: z.string().uuid(), formId: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      // Verify ownership
      const [form] = await ctx.db
        .select()
        .from(forms)
        .where(and(eq(forms.id, input.formId), eq(forms.userId, ctx.user.id)))
        .limit(1);

      if (!form) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      const [response] = await ctx.db
        .select()
        .from(formResponses)
        .where(
          and(
            eq(formResponses.id, input.id),
            eq(formResponses.formId, input.formId)
          )
        )
        .limit(1);

      if (!response) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Response not found" });
      }

      const frs = await ctx.db
        .select()
        .from(fieldResponses)
        .where(eq(fieldResponses.responseId, response.id));

      return { ...response, fieldResponses: frs };
    }),

  // -----------------------------------------------------------------------
  // Stats
  // -----------------------------------------------------------------------
  stats: protectedProcedure
    .input(z.object({ formId: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const [form] = await ctx.db
        .select()
        .from(forms)
        .where(and(eq(forms.id, input.formId), eq(forms.userId, ctx.user.id)))
        .limit(1);

      if (!form) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const [
        [{ total }],
        [{ newCount }],
        [{ todayCount }],
        [{ avgTime }],
      ] = await Promise.all([
        ctx.db
          .select({ total: count() })
          .from(formResponses)
          .where(eq(formResponses.formId, input.formId)),
        ctx.db
          .select({ newCount: count() })
          .from(formResponses)
          .where(
            and(
              eq(formResponses.formId, input.formId),
              eq(formResponses.status, "new")
            )
          ),
        ctx.db
          .select({ todayCount: count() })
          .from(formResponses)
          .where(
            and(
              eq(formResponses.formId, input.formId),
              gte(formResponses.submittedAt, today)
            )
          ),
        ctx.db
          .select({
            avgTime: sql<number>`COALESCE(AVG(${formResponses.completionTime}), 0)`,
          })
          .from(formResponses)
          .where(eq(formResponses.formId, input.formId)),
      ]);

      return {
        total,
        new: newCount,
        today: todayCount,
        avgCompletionTime: Math.round(avgTime),
      };
    }),

  // -----------------------------------------------------------------------
  // Update status
  // -----------------------------------------------------------------------
  updateStatus: protectedProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        formId: z.string().uuid(),
        status: z.enum(["new", "read", "starred", "archived"]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const [form] = await ctx.db
        .select()
        .from(forms)
        .where(and(eq(forms.id, input.formId), eq(forms.userId, ctx.user.id)))
        .limit(1);

      if (!form) throw new TRPCError({ code: "NOT_FOUND" });

      const [updated] = await ctx.db
        .update(formResponses)
        .set({ status: input.status })
        .where(and(eq(formResponses.id, input.id), eq(formResponses.formId, input.formId)))
        .returning();

      return updated!;
    }),

  // -----------------------------------------------------------------------
  // Bulk update status
  // -----------------------------------------------------------------------
  bulkUpdateStatus: protectedProcedure
    .input(
      z.object({
        formId: z.string().uuid(),
        responseIds: z.array(z.string().uuid()),
        status: z.enum(["new", "read", "starred", "archived"]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const [form] = await ctx.db
        .select()
        .from(forms)
        .where(and(eq(forms.id, input.formId), eq(forms.userId, ctx.user.id)))
        .limit(1);

      if (!form) throw new TRPCError({ code: "NOT_FOUND" });

      await Promise.all(
        input.responseIds.map((id) =>
          ctx.db
            .update(formResponses)
            .set({ status: input.status })
            .where(and(eq(formResponses.id, id), eq(formResponses.formId, input.formId)))
        )
      );

      return { success: true };
    }),

  // -----------------------------------------------------------------------
  // Delete
  // -----------------------------------------------------------------------
  delete: protectedProcedure
    .input(z.object({ id: z.string().uuid(), formId: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const [form] = await ctx.db
        .select()
        .from(forms)
        .where(and(eq(forms.id, input.formId), eq(forms.userId, ctx.user.id)))
        .limit(1);

      if (!form) throw new TRPCError({ code: "NOT_FOUND" });

      await ctx.db
        .delete(formResponses)
        .where(and(eq(formResponses.id, input.id), eq(formResponses.formId, input.formId)));

      return { success: true };
    }),

  // -----------------------------------------------------------------------
  // Export CSV
  // -----------------------------------------------------------------------
  exportCsv: protectedProcedure
    .input(z.object({ formId: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const [form] = await ctx.db
        .select()
        .from(forms)
        .where(and(eq(forms.id, input.formId), eq(forms.userId, ctx.user.id)))
        .limit(1);

      if (!form) throw new TRPCError({ code: "NOT_FOUND" });

      // Get fields for column headers
      const fields = await ctx.db
        .select()
        .from(formFields)
        .where(eq(formFields.formId, input.formId))
        .orderBy(formFields.sortOrder);

      // Get all responses
      const responses = await ctx.db
        .select()
        .from(formResponses)
        .where(eq(formResponses.formId, input.formId))
        .orderBy(desc(formResponses.submittedAt));

      if (responses.length === 0) {
        return { csv: "" };
      }

      // Get all field responses
      const responseIds = responses.map((r) => r.id);
      const allFieldResponses = await ctx.db
        .select()
        .from(fieldResponses)
        .where(
          sql`${fieldResponses.responseId} IN (${sql.join(
            responseIds.map((id) => sql`${id}`),
            sql`, `
          )})`
        );

      // Build CSV
      const headers = [
        "Response ID",
        "Status",
        "Submitted At",
        "Completion Time (s)",
        ...fields.map((f) => f.label),
      ];

      const frMap = new Map<string, Map<string, string>>();
      for (const fr of allFieldResponses) {
        if (!frMap.has(fr.responseId)) frMap.set(fr.responseId, new Map());
        frMap.get(fr.responseId)!.set(fr.fieldId, fr.value ?? "");
      }

      const rows = responses.map((r) => {
        const values = frMap.get(r.id) ?? new Map();
        return [
          r.id,
          r.status,
          r.submittedAt.toISOString(),
          String(r.completionTime ?? ""),
          ...fields.map((f) => values.get(f.id) ?? ""),
        ];
      });

      const escapeCsv = (val: string) => {
        if (val.includes(",") || val.includes('"') || val.includes("\n")) {
          return `"${val.replace(/"/g, '""')}"`;
        }
        return val;
      };

      const csvLines = [
        headers.map(escapeCsv).join(","),
        ...rows.map((row) => row.map(escapeCsv).join(",")),
      ];

      return { csv: csvLines.join("\n") };
    }),
});
