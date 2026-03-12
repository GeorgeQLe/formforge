"use client";

import { trpc } from "@/lib/trpc/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/toast";
// Plan limits are defined inline to avoid importing server-side Stripe module

const PLAN_DETAILS = [
  {
    key: "free" as const,
    name: "Free",
    price: "$0",
    period: "forever",
    features: [
      "3 forms",
      "100 responses/month",
      "Basic field types",
      "FormForge branding",
    ],
  },
  {
    key: "pro" as const,
    name: "Pro",
    price: "$15",
    period: "/month",
    popular: true,
    features: [
      "Unlimited forms",
      "Unlimited responses",
      "Conditional logic",
      "File uploads",
      "No branding",
      "Email notifications",
    ],
  },
  {
    key: "business" as const,
    name: "Business",
    price: "$39",
    period: "/month",
    features: [
      "Everything in Pro",
      "Up to 10 team members",
      "API access",
      "Custom integrations",
      "Priority support",
    ],
  },
];

export default function BillingPage() {
  const { toast } = useToast();
  const subscriptionQuery = trpc.billing.getSubscription.useQuery();
  const createCheckoutMutation = trpc.billing.createCheckout.useMutation();
  const createPortalMutation = trpc.billing.createPortalSession.useMutation();

  const currentPlan = subscriptionQuery.data?.plan ?? "free";

  const handleUpgrade = async (plan: "pro" | "business") => {
    try {
      const { url } = await createCheckoutMutation.mutateAsync({ plan });
      if (url) window.location.href = url;
    } catch {
      toast({ title: "Failed to start checkout", variant: "destructive" });
    }
  };

  const handleManageBilling = async () => {
    try {
      const { url } = await createPortalMutation.mutateAsync();
      if (url) window.location.href = url;
    } catch {
      toast({ title: "Failed to open billing portal", variant: "destructive" });
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Billing & Plans</h1>
        <p className="text-gray-500 mt-1">Manage your subscription and billing</p>
      </div>

      {/* Current plan info */}
      {subscriptionQuery.data?.subscription && (
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Current Plan</p>
                <p className="text-xl font-bold text-gray-900 capitalize">
                  {currentPlan}
                </p>
                {subscriptionQuery.data.subscription.cancelAtPeriodEnd && (
                  <p className="text-sm text-amber-600 mt-1">
                    Cancels at end of billing period
                  </p>
                )}
              </div>
              <Button variant="outline" onClick={handleManageBilling}>
                Manage Billing
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Plan cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {PLAN_DETAILS.map((plan) => {
          const isCurrent = currentPlan === plan.key;
          return (
            <Card
              key={plan.key}
              className={`relative ${
                plan.popular ? "border-indigo-500 shadow-md" : ""
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge>Most Popular</Badge>
                </div>
              )}
              <CardHeader>
                <CardTitle>{plan.name}</CardTitle>
                <CardDescription>
                  <span className="text-3xl font-bold text-gray-900">
                    {plan.price}
                  </span>
                  <span className="text-gray-500">{plan.period}</span>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 mb-6">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm text-gray-600">
                      <svg className="w-4 h-4 text-green-500 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
                {isCurrent ? (
                  <Button variant="outline" className="w-full" disabled>
                    Current Plan
                  </Button>
                ) : plan.key === "free" ? (
                  <Button variant="outline" className="w-full" disabled>
                    Free Tier
                  </Button>
                ) : (
                  <Button
                    className="w-full"
                    variant={plan.popular ? "default" : "outline"}
                    onClick={() => handleUpgrade(plan.key)}
                  >
                    Upgrade to {plan.name}
                  </Button>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
