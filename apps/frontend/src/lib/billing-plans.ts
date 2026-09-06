import type { Plan } from "@/lib/http/billing-server";

export type PlansByInterval = { monthly: Plan[]; yearly: Plan[] };

export class BillingPlans {
  static groupByInterval(plans: Plan[]): PlansByInterval {
    return {
      monthly: plans.filter((plan) => !plan.slug.endsWith("-yearly")),
      yearly: plans.filter((plan) => plan.slug.endsWith("-yearly")),
    };
  }
}
