"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Logo } from "@/components/logo";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 0);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 border-b bg-background transition-[border-color,box-shadow] duration-200 ease-out",
        scrolled ? "border-border shadow-[0_1px_2px_rgb(0_0_0/0.04)]" : "border-transparent shadow-none",
      )}
    >
      <div className="mx-auto grid w-full max-w-6xl grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center px-6 py-4.5">
        <Link href="/" aria-label="Sorrel" className="flex items-center">
          <Logo className="h-8 w-auto text-foreground" />
        </Link>
        <nav className="flex items-center gap-3 whitespace-nowrap text-sm sm:gap-5">
          <Link href="/#pricing" className="text-muted-foreground hover:text-foreground">
            Pricing
          </Link>
          <Link href="/blog" className="text-muted-foreground hover:text-foreground">
            Blog
          </Link>
        </nav>
        <nav className="flex items-center justify-end gap-3 whitespace-nowrap text-sm sm:gap-5">
          <Link href="/login" className="text-muted-foreground hover:text-foreground">
            Log in
          </Link>
          <Link
            href="/register"
            className="inline-flex h-9 items-center rounded-lg bg-primary px-3.5 font-medium text-primary-foreground hover:bg-primary/80"
          >
            Sign up
          </Link>
        </nav>
      </div>
    </header>
  );
}
