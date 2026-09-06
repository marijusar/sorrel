import { DbClient } from "@/db/client";
import { dbEnv } from "@/db/env";
import { LoggerFactory } from "@/logging/logger";
import { PlanLimitRepository } from "@/modules/billing/plan-limit-repository";
import { PlanRepository } from "@/modules/billing/plan-repository";

// A yearly plan is its own plan row (slug suffixed "-yearly"), not a field
// on the monthly one. stripePriceId values are Stripe TEST-mode — repoint before going live.
const PLANS = [
  {
    slug: "starter",
    name: "Starter",
    monthlyPriceCents: 4900,
    stripePriceId: "price_1UADuYJT5wh1YJ9eZBoewlvd",
    trackedStoresLimit: 100,
  },
  {
    slug: "starter-yearly",
    name: "Starter",
    monthlyPriceCents: 4165,
    stripePriceId: "price_1UCakkJT5wh1YJ9eoBzpTj9G",
    trackedStoresLimit: 100,
  },
  {
    slug: "growth",
    name: "Growth",
    monthlyPriceCents: 14900,
    stripePriceId: "price_1UADufJT5wh1YJ9ezBHsVKcO",
    trackedStoresLimit: 500,
  },
  {
    slug: "growth-yearly",
    name: "Growth",
    monthlyPriceCents: 12665,
    stripePriceId: "price_1UCakkJT5wh1YJ9e5L41h0n9",
    trackedStoresLimit: 500,
  },
  {
    slug: "scale",
    name: "Scale",
    monthlyPriceCents: 39900,
    stripePriceId: "price_1UADulJT5wh1YJ9eiQzvC6wC",
    trackedStoresLimit: 2000,
  },
  {
    slug: "scale-yearly",
    name: "Scale",
    monthlyPriceCents: 33915,
    stripePriceId: "price_1UCakkJT5wh1YJ9eXGgrpxVh",
    trackedStoresLimit: 2000,
  },
] as const;

class SyncPlansCommand {
  static async run(): Promise<void> {
    const logger = LoggerFactory.create("sync-plans");
    const db = DbClient.create(dbEnv.DATABASE_URL);

    for (const plan of PLANS) {
      const row = await PlanRepository.upsertBySlug(db, plan);
      await PlanLimitRepository.upsertForPlan(db, row.id, "tracked_stores", plan.trackedStoresLimit);
      logger.info({ slug: plan.slug }, "plan synced");
    }

    await db.destroy();
  }
}

await SyncPlansCommand.run();
