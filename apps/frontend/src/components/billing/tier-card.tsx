import type { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function TierCard({ featured = false, children }: { featured?: boolean; children: ReactNode }) {
  return (
    <Card
      className={cn(
        "relative h-full [--card-spacing:--spacing(6)] gap-5",
        featured && "ring-[1.5px] ring-primary shadow-[0_16px_40px_-12px_rgb(0_0_0/0.16)]",
      )}
    >
      {children}
    </Card>
  );
}

export function TierCardBadge({ children }: { children: ReactNode }) {
  return <Badge className="absolute top-(--card-spacing) right-(--card-spacing)">{children}</Badge>;
}

export function TierCardPrice({ amount, compareAmount }: { amount: number; compareAmount?: number }) {
  return (
    <p className="flex items-baseline gap-2 text-[34px] leading-10 font-medium tracking-tight">
      {compareAmount ? (
        <span className="text-xl font-normal text-muted-foreground line-through">${compareAmount}</span>
      ) : null}
      <span>
        ${amount}
        <span className="text-base font-normal text-muted-foreground">/mo</span>
      </span>
    </p>
  );
}

export function TierCardFeatures({ features }: { features: string[] }) {
  return (
    <ul className="flex flex-col gap-2.5 text-sm text-foreground/75">
      {features.map((feature) => (
        <li key={feature}>{feature}</li>
      ))}
    </ul>
  );
}
