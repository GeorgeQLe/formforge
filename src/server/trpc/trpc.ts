import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import { eq } from "drizzle-orm";
import { users } from "@/server/db/schema";
import { PLAN_LIMITS } from "@/server/billing/stripe";
import type { Context } from "./context";

const t = initTRPC.context<Context>().create({
  transformer: superjson,
});

export const router = t.router;
export const publicProcedure = t.procedure;
export const middleware = t.middleware;

// ---------------------------------------------------------------------------
// Auth middleware – requires a Clerk userId and resolves the DB user row
// ---------------------------------------------------------------------------
const isAuthed = middleware(async ({ ctx, next }) => {
  if (!ctx.clerkUserId) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: "Not signed in" });
  }

  const [user] = await ctx.db
    .select()
    .from(users)
    .where(eq(users.clerkUserId, ctx.clerkUserId))
    .limit(1);

  if (!user) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: "User not found" });
  }

  return next({ ctx: { ...ctx, user } });
});

export const protectedProcedure = publicProcedure.use(isAuthed);

// ---------------------------------------------------------------------------
// Plan enforcement middleware
// ---------------------------------------------------------------------------
export function requirePlan(minPlan: "free" | "pro" | "business") {
  const planHierarchy = { free: 0, pro: 1, business: 2 } as const;

  return middleware(async ({ ctx, next }) => {
    if (!ctx.clerkUserId) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }

    const [user] = await ctx.db
      .select()
      .from(users)
      .where(eq(users.clerkUserId, ctx.clerkUserId))
      .limit(1);

    if (!user) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }

    const userPlanLevel = planHierarchy[user.plan as keyof typeof planHierarchy] ?? 0;
    const requiredLevel = planHierarchy[minPlan];

    if (userPlanLevel < requiredLevel) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: `This feature requires the ${minPlan} plan or higher. Current plan: ${user.plan}`,
      });
    }

    return next({ ctx: { ...ctx, user } });
  });
}

export { PLAN_LIMITS };
