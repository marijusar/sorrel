"use client";

import { usePathname, useSearchParams } from "next/navigation";
import {
  IntervalToggle,
  type BillingInterval,
} from "@/components/billing/interval-toggle";
import { TierCard } from "@/components/billing/tier-card";
import type { PlansByInterval } from "@/lib/billing-plans";
import type { Tier } from "@/lib/tiers";
import z from "zod";

const IntervalSchema = z.literal(["yearly", "monthly"]).catch("yearly");

export function TierPicker({
  tiers,
  plans,
  cta,
}: {
  tiers: Tier[];
  plans: PlansByInterval;
  cta: "register" | "subscribe";
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const rawInterval = searchParams.get("interval");
  const interval = IntervalSchema.parse(rawInterval);
  const visiblePlans = plans[interval];

  function handleChange(next: BillingInterval) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("interval", next);
    const query = params.toString();
    window.history.replaceState(
      null,
      "",
      query ? `${pathname}?${query}` : pathname,
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-center">
        <IntervalToggle interval={interval} onChange={handleChange} />
      </div>
      <div className="grid gap-4 sm:grid-cols-3 sm:gap-6">
        {tiers.map((tier) => {
          const plan = visiblePlans.find((p) => p.name === tier.name);
          if (!plan) return null;
          const comparePlan =
            interval === "yearly"
              ? plans.monthly.find((p) => p.name === tier.name)
              : undefined;
          return (
            <TierCard
              key={tier.name}
              {...tier}
              price={plan.monthly_price_cents / 100}
              comparePrice={
                comparePlan ? comparePlan.monthly_price_cents / 100 : undefined
              }
              cta={
                cta === "register"
                  ? { type: "register" }
                  : { type: "subscribe", planSlug: plan.slug }
              }
            />
          );
        })}
      </div>
    </div>
  );
}
