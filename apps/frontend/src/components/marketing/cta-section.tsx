import Link from "next/link";
import { Button } from "@/components/ui/button";

export function CtaSection() {
  return (
    <section className="mx-auto w-full max-w-[1000px] px-6 py-14 sm:py-22">
      <div className="flex flex-col items-center gap-5 rounded-[18px] bg-primary px-6 py-12 text-center sm:gap-6 sm:px-10 sm:py-18">
        <h2 className="max-w-[720px] font-heading text-[28px] leading-[1.15] font-medium tracking-tight text-primary-foreground text-pretty sm:text-[38px]">
          Somewhere in 500,000 stores, someone just uninstalled your competitor.
        </h2>
        <p className="text-base text-primary-foreground/70 sm:text-[17px]">You can be the first email they get.</p>
        <Link href="/register" className="w-full sm:w-auto">
          <Button size="lg" className="h-11 w-full bg-background px-5.5 text-[15px] text-foreground hover:bg-background/90">
            Start watching — $49/mo
          </Button>
        </Link>
      </div>
    </section>
  );
}
