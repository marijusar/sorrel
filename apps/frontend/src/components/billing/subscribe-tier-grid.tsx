"use client";

import { TierCard, TierCardBadge, TierCardFeatures, TierCardPrice } from "@/components/billing/tier-card";
import { Button } from "@/components/ui/button";
import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useBillingInterval } from "@/hooks/use-billing-interval";
import { redirectToCheckout } from "@/lib/actions/billing";
import { BillingPlans, type PlansByInterval } from "@/lib/billing-plans";
import type { Tier } from "@/lib/tiers";

export function SubscribeTierGrid({ tiers, plans }: { tiers: Tier[]; plans: PlansByInterval }) {
  const { interval } = useBillingInterval();
  const visiblePlans = plans[interval];

  return tiers.map((tier) => {
    const plan = BillingPlans.findByName(visiblePlans, tier.name);
    if (!plan) return null;
    const comparePlan = interval === "yearly" ? BillingPlans.findByName(plans.monthly, tier.name) : undefined;

    return (
      <TierCard key={tier.name} featured={tier.featured}>
        {tier.featured ? <TierCardBadge>Best Value</TierCardBadge> : null}
        <CardHeader className="gap-1.5">
          <CardTitle>{tier.name}</CardTitle>
          <TierCardPrice
            amount={plan.monthly_price_cents / 100}
            compareAmount={comparePlan ? comparePlan.monthly_price_cents / 100 : undefined}
          />
          <CardDescription>{tier.tagline}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-1 flex-col gap-5">
          <TierCardFeatures features={tier.features} />
          <form action={redirectToCheckout.bind(null, plan.slug)} className="mt-auto">
            <Button type="submit" variant={tier.featured ? "default" : "outline"} className="h-10 w-full px-3.5">
              Subscribe
            </Button>
          </form>
        </CardContent>
      </TierCard>
    );
  });
}
