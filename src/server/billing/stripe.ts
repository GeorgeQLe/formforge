import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

// ---------------------------------------------------------------------------
// Plan definitions
// ---------------------------------------------------------------------------
export const PLANS = {
  free: {
    name: "Free",
    price: 0,
    stripePriceId: null,
  },
  pro: {
    name: "Pro",
    price: 15,
    stripePriceId: process.env.STRIPE_PRO_PRICE_ID ?? "price_pro",
  },
  business: {
    name: "Business",
    price: 39,
    stripePriceId: process.env.STRIPE_BUSINESS_PRICE_ID ?? "price_business",
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
// Stripe helpers
// ---------------------------------------------------------------------------
export async function createCheckoutSession(params: {
  customerId: string;
  priceId: string;
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
  return stripe.customers.create({ email, name: name ?? undefined });
}
