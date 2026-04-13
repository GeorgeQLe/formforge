import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

// ---------------------------------------------------------------------------
// Plan definitions
// ---------------------------------------------------------------------------
export type PaidPlanKey = "pro" | "business";

export const PAID_PLAN_LOOKUP_KEYS: Record<PaidPlanKey, string> = {
  pro: "formforge.pro.monthly",
  business: "formforge.business.monthly",
};

const LOOKUP_KEY_TO_PLAN = Object.fromEntries(
  Object.entries(PAID_PLAN_LOOKUP_KEYS).map(([plan, key]) => [key, plan as PaidPlanKey]),
) as Record<string, PaidPlanKey>;

export const PLANS = {
  free: {
    name: "Free",
    price: 0,
    lookupKey: null,
  },
  pro: {
    name: "Pro",
    price: 15,
    lookupKey: PAID_PLAN_LOOKUP_KEYS.pro,
  },
  business: {
    name: "Business",
    price: 39,
    lookupKey: PAID_PLAN_LOOKUP_KEYS.business,
  },
} as const;

export const PLAN_LIMITS = {
  free: {
    maxForms: 3,
    maxResponsesPerMonth: 100,
    conditionalLogic: false,
    fileUpload: false,
    removeBranding: false,
    teamMembers: 1,
    apiAccess: false,
  },
  pro: {
    maxForms: Infinity,
    maxResponsesPerMonth: Infinity,
    conditionalLogic: true,
    fileUpload: true,
    removeBranding: true,
    teamMembers: 1,
    apiAccess: false,
  },
  business: {
    maxForms: Infinity,
    maxResponsesPerMonth: Infinity,
    conditionalLogic: true,
    fileUpload: true,
    removeBranding: true,
    teamMembers: 10,
    apiAccess: true,
  },
} as const;

export type PlanKey = keyof typeof PLANS;

export function getPlanLimits(plan: string) {
  return PLAN_LIMITS[plan as PlanKey] ?? PLAN_LIMITS.free;
}

// ---------------------------------------------------------------------------
// Lookup-key pricing resolution
// ---------------------------------------------------------------------------

/** Fetch the Stripe Price for a given paid plan via its lookup key. */
export async function getStripePriceForPlan(plan: PaidPlanKey): Promise<Stripe.Price> {
  const lookupKey = PAID_PLAN_LOOKUP_KEYS[plan];
  const prices = await stripe.prices.list({
    active: true,
    lookup_keys: [lookupKey],
    limit: 1,
  });

  if (prices.data.length === 0) {
    throw new Error(`No active Stripe price found for lookup key "${lookupKey}"`);
  }

  return prices.data[0]!;
}

/** Resolve a Stripe price to a plan key. Lookup key first, then price ID fallback. */
export async function resolvePlanFromPrice(
  price: Pick<Stripe.Price, "id" | "lookup_key">,
): Promise<PlanKey> {
  // Primary path: lookup key
  if (price.lookup_key) {
    const plan = LOOKUP_KEY_TO_PLAN[price.lookup_key];
    if (plan) return plan;
  }

  // Fallback: fetch all lookup-key prices and match by price ID
  const prices = await stripe.prices.list({
    active: true,
    lookup_keys: Object.values(PAID_PLAN_LOOKUP_KEYS),
    limit: 10,
  });

  for (const p of prices.data) {
    if (p.id === price.id && p.lookup_key) {
      const plan = LOOKUP_KEY_TO_PLAN[p.lookup_key];
      if (plan) return plan;
    }
  }

  console.warn(
    `Unable to map Stripe price ${price.id} to a FormForge plan. Falling back to free.`,
  );
  return "free";
}

// ---------------------------------------------------------------------------
// Stripe helpers
// ---------------------------------------------------------------------------
export async function createCheckoutSession(params: {
  customerId: string;
  priceId: string;
  userId: string;
  lookupKey: string;
  successUrl: string;
  cancelUrl: string;
}) {
  return stripe.checkout.sessions.create({
    customer: params.customerId,
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [{ price: params.priceId, quantity: 1 }],
    success_url: params.successUrl,
    cancel_url: params.cancelUrl,
    subscription_data: {
      metadata: {
        project: "formforge",
        environment: process.env.NODE_ENV || "development",
        entityType: "user",
        entityId: params.userId,
        appUrl: "https://formforge.dev",
        priceLookupKey: params.lookupKey,
      },
    },
  });
}

export async function createPortalSession(params: {
  customerId: string;
  returnUrl: string;
}) {
  return stripe.billingPortal.sessions.create({
    customer: params.customerId,
    return_url: params.returnUrl,
  });
}

export async function getOrCreateStripeCustomer(email: string, name?: string | null) {
  const existing = await stripe.customers.list({ email, limit: 1 });
  if (existing.data.length > 0) {
    return existing.data[0]!;
  }
  return stripe.customers.create({
    email,
    name: name ?? undefined,
    metadata: { project: "formforge" },
  });
}
