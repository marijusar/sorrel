import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { redirectToCheckout } from "@/lib/actions/billing";
import { cn } from "@/lib/utils";

type TierCardCta = { type: "register" } | { type: "subscribe"; planSlug: string };

export function TierCard({
  name,
  price,
  comparePrice,
  tagline,
  features,
  featured = false,
  cta,
}: {
  name: string;
  price: number;
  comparePrice?: number;
  tagline: string;
  features: string[];
  featured?: boolean;
  cta: TierCardCta;
}) {
  return (
    <Card
      className={cn(
        "relative h-full [--card-spacing:--spacing(6)] gap-5",
        featured && "ring-[1.5px] ring-primary shadow-[0_16px_40px_-12px_rgb(0_0_0/0.16)]",
      )}
    >
      {featured ? (
        <Badge className="absolute top-(--card-spacing) right-(--card-spacing)">Best Value</Badge>
      ) : null}
      <CardHeader className="gap-1.5">
        <CardTitle>{name}</CardTitle>
        <p className="flex items-baseline gap-2 text-[34px] leading-10 font-medium tracking-tight">
          {comparePrice ? (
            <span className="text-xl font-normal text-muted-foreground line-through">${comparePrice}</span>
          ) : null}
          <span>
            ${price}
            <span className="text-base font-normal text-muted-foreground">/mo</span>
          </span>
        </p>
        <CardDescription>{tagline}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-5">
        <ul className="flex flex-col gap-2.5 text-sm text-foreground/75">
          {features.map((feature) => (
            <li key={feature}>{feature}</li>
          ))}
        </ul>
        {cta.type === "register" ? (
          <Link href="/register" className="mt-auto">
            <Button variant={featured ? "default" : "outline"} className="h-10 w-full px-3.5">
              Get started
            </Button>
          </Link>
        ) : (
          <form action={redirectToCheckout.bind(null, cta.planSlug)} className="mt-auto">
            <Button type="submit" variant={featured ? "default" : "outline"} className="h-10 w-full px-3.5">
              Subscribe
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
