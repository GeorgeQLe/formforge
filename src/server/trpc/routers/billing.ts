import { z } from "zod";
import { eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { router, protectedProcedure } from "../trpc";
import { users } from "@/server/db/schema";
import {
  stripe,
  PLANS,
  getOrCreateStripeCustomer,
  getStripePriceForPlan,
  createCheckoutSession,
  createPortalSession,
  type PlanKey,
  type PaidPlanKey,
} from "@/server/billing/stripe";

export const billingRouter = router({
  // -----------------------------------------------------------------------
  // Get current subscription info
  // -----------------------------------------------------------------------
  getSubscription: protectedProcedure.query(async ({ ctx }) => {
    let subscription = null;

    if (ctx.user.stripeSubscriptionId) {
      try {
        subscription = await stripe.subscriptions.retrieve(
          ctx.user.stripeSubscriptionId
        );
      } catch {
        // Subscription may have been deleted
      }
    }

    return {
      plan: ctx.user.plan as PlanKey,
      subscription: subscription
        ? {
            id: subscription.id,
            status: subscription.status,
            currentPeriodEnd: new Date(
              subscription.items.data[0].current_period_end * 1000
            ).toISOString(),
            cancelAtPeriodEnd: subscription.cancel_at_period_end,
          }
        : null,
    };
  }),

  // -----------------------------------------------------------------------
  // Create checkout session for upgrading
  // -----------------------------------------------------------------------
  createCheckout: protectedProcedure
    .input(z.object({ plan: z.enum(["pro", "business"]) }))
    .mutation(async ({ ctx, input }) => {
      // Resolve price from Stripe via lookup key
      const stripePrice = await getStripePriceForPlan(input.plan as PaidPlanKey);
      const planConfig = PLANS[input.plan];

      // Get or create Stripe customer
      let customerId = ctx.user.stripeCustomerId;
      if (!customerId) {
        const customer = await getOrCreateStripeCustomer(
          ctx.user.email,
          ctx.user.name
        );
        customerId = customer.id;

        await ctx.db
          .update(users)
          .set({ stripeCustomerId: customerId })
          .where(eq(users.id, ctx.user.id));
      }

      const appUrl = process.env.NEXT_PUBLIC_APP_URL!;
      const session = await createCheckoutSession({
        customerId,
        priceId: stripePrice.id,
        userId: ctx.user.id,
        lookupKey: planConfig.lookupKey!,
        successUrl: `${appUrl}/billing?success=true`,
        cancelUrl: `${appUrl}/billing?canceled=true`,
      });

      return { url: session.url };
    }),

  // -----------------------------------------------------------------------
  // Create billing portal session
  // -----------------------------------------------------------------------
  createPortalSession: protectedProcedure.mutation(async ({ ctx }) => {
    if (!ctx.user.stripeCustomerId) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "No billing account found",
      });
    }

    const session = await createPortalSession({
      customerId: ctx.user.stripeCustomerId,
      returnUrl: `${process.env.NEXT_PUBLIC_APP_URL!}/billing`,
    });

    return { url: session.url };
  }),
});
