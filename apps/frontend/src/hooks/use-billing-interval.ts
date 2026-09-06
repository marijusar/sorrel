"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { z } from "zod";

const intervalSchema = z.enum(["monthly", "yearly"]).catch("yearly");

export type BillingInterval = z.infer<typeof intervalSchema>;

export function useBillingInterval() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const interval = intervalSchema.parse(searchParams.get("interval"));

  function setBillingInterval(next: BillingInterval) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("interval", next);
    window.history.replaceState(null, "", `${pathname}?${params.toString()}`);
  }

  return { interval, setBillingInterval };
}
