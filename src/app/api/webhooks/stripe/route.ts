import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { stripe } from "@/server/billing/stripe";
import { db } from "@/server/db";
import { users } from "@/server/db/schema";
import type Stripe from "stripe";

// ---------------------------------------------------------------------------
// Map Stripe price IDs to plan names
// ---------------------------------------------------------------------------
function planFromPriceId(priceId: string): string {
  const proPriceId = process.env.STRIPE_PRO_PRICE_ID ?? "price_pro";
  const businessPriceId = process.env.STRIPE_BUSINESS_PRICE_ID ?? "price_business";

  if (priceId === proPriceId) return "pro";
  if (priceId === businessPriceId) return "business";
  return "free";
}

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature")!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json(
      { error: "Invalid signature" },
      { status: 400 }
    );
  }

  try {
    switch (event.type) {
      // -----------------------------------------------------------------
      // Checkout completed — activate subscription
      // -----------------------------------------------------------------
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const customerId = session.customer as string;
        const subscriptionId = session.subscription as string;

        // Get subscription details to determine plan
        const subscription = await stripe.subscriptions.retrieve(subscriptionId);
        const priceId = subscription.items.data[0]?.price?.id ?? "";
        const plan = planFromPriceId(priceId);

        await db
          .update(users)
          .set({
            plan,
            stripeCustomerId: customerId,
            stripeSubscriptionId: subscriptionId,
            updatedAt: new Date(),
          })
          .where(eq(users.stripeCustomerId, customerId));

        break;
      }

      // -----------------------------------------------------------------
      // Subscription updated (upgrade/downgrade, renewal)
      // -----------------------------------------------------------------
      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;
        const priceId = subscription.items.data[0]?.price?.id ?? "";
        const plan = planFromPriceId(priceId);

        if (subscription.status === "active") {
          await db
            .update(users)
            .set({
              plan,
              stripeSubscriptionId: subscription.id,
              updatedAt: new Date(),
            })
            .where(eq(users.stripeCustomerId, customerId));
        }

        break;
      }

      // -----------------------------------------------------------------
      // Subscription deleted — downgrade to free
      // -----------------------------------------------------------------
      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;

        await db
          .update(users)
          .set({
            plan: "free",
            stripeSubscriptionId: null,
            updatedAt: new Date(),
          })
          .where(eq(users.stripeCustomerId, customerId));

        break;
      }
    }
  } catch (error) {
    console.error("Webhook processing error:", error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }

  return NextResponse.json({ received: true });
}
