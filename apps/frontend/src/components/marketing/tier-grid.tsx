"use client";

import Link from "next/link";
import { TierCard, TierCardBadge, TierCardFeatures, TierCardPrice } from "@/components/billing/tier-card";
import { Button } from "@/components/ui/button";
import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useBillingInterval } from "@/hooks/use-billing-interval";
import { BillingPlans, type PlansByInterval } from "@/lib/billing-plans";
import type { Tier } from "@/lib/tiers";

export function TierGrid({ tiers, plans }: { tiers: Tier[]; plans: PlansByInterval }) {
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
          <Link href="/register" className="mt-auto">
            <Button variant={tier.featured ? "default" : "outline"} className="h-10 w-full px-3.5">
              Get started
            </Button>
          </Link>
        </CardContent>
      </TierCard>
    );
  });
}
