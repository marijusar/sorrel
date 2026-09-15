import Link from "next/link";
import { Logo } from "@/components/logo";
import { SiteHeader } from "@/components/marketing/site-header";

export default function MarketingLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="flex min-h-svh flex-col">
      <SiteHeader />

      <main className="flex-1">{children}</main>

      <footer className="border-t border-border">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-6 py-7 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <Link href="/" aria-label="Sorrel" className="flex items-center">
            <Logo className="h-6 w-auto text-foreground" />
          </Link>
          <nav className="flex items-center gap-6">
            <Link href="/#pricing" className="hover:text-foreground">
              Pricing
            </Link>
            <Link href="/blog" className="hover:text-foreground">
              Blog
            </Link>
            <Link href="/login" className="hover:text-foreground">
              Log in
            </Link>
            <Link href="/register" className="hover:text-foreground">
              Sign up
            </Link>
          </nav>
          <span>© {new Date().getFullYear()} Sorrel</span>
        </div>
      </footer>
    </div>
  );
}
