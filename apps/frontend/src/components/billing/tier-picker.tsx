import type { ReactNode } from "react";
import { IntervalToggle } from "@/components/billing/interval-toggle";

export function TierPicker({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-center">
        <IntervalToggle />
      </div>
      <div className="grid gap-4 sm:grid-cols-3 sm:gap-6">{children}</div>
    </div>
  );
}
