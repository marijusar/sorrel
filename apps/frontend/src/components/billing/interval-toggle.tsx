"use client";

import { cn } from "@/lib/utils";

export type BillingInterval = "monthly" | "yearly";

export function IntervalToggle({
  interval,
  onChange,
}: {
  interval: BillingInterval;
  onChange: (interval: BillingInterval) => void;
}) {
  return (
    <div className="inline-flex items-center rounded-full border border-border bg-muted p-1 text-sm">
      <button
        type="button"
        onClick={() => onChange("monthly")}
        className={cn(
          "cursor-pointer rounded-full px-3.5 py-1.5 font-medium transition-colors",
          interval === "monthly" ? "bg-background shadow-sm" : "text-muted-foreground",
        )}
      >
        Monthly
      </button>
      <button
        type="button"
        onClick={() => onChange("yearly")}
        className={cn(
          "flex cursor-pointer items-center gap-1.5 rounded-full px-3.5 py-1.5 font-medium transition-colors",
          interval === "yearly" ? "bg-background shadow-sm" : "text-muted-foreground",
        )}
      >
        Yearly
        <span className="rounded-full bg-green-600/10 px-1.5 py-0.5 text-[11px] font-semibold text-green-700">
          Save 15%
        </span>
      </button>
    </div>
  );
}
