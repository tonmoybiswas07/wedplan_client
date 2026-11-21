import { Suspense } from "react";
import Link from "next/link";
import { 
  Heart, 
  Sparkles, 
  MapPin, 
  Mail, 
  Phone, 
  Compass,
  ArrowRight
} from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { getDashboardAccess } from "@/lib/dashboard-session";
import { cn } from "@/lib/utils";
import { ResponsiveDrawer } from "@/components/ui/responsive-drawer";
import { ThemeSwitcher } from "@/components/ui/theme";
import { DashboardAccount } from "@/app/dashboard/navigation";

const github = "https://github.com/tonmoybiswas07";
const clientRepository = github + "/wedplan_client";
const serverRepository = github + "/wedplan_server";

function Brand() {
  return (
    <Link href="/" className="group inline-flex items-center gap-2.5 transition-transform hover:opacity-95">
      <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm transition-transform group-hover:scale-105">
        <Heart size={18} className="fill-current" aria-hidden="true" />
      </span>
      <div className="flex flex-col">
        <span className="font-display text-2xl font-bold tracking-tight text-foreground">
          Wed<span className="text-primary font-normal italic">Plan</span>
        </span>
      </div>
    </Link>
  );
}

async function AccountLinks({ mobile }: { mobile: boolean }) {
  const access = await getDashboardAccess();
  if (access.status === "allowed") {
    return <DashboardAccount name={access.user.name} role={access.user.role} image={access.user.image} align={mobile ? "start" : "end"} />;
  }

  return (
    <div className={mobile ? "grid w-full gap-2.5 pt-2" : "flex items-center gap-2.5"}>
      <Link 
        href="/sign-in" 
        className={cn(
          "inline-flex h-9 items-center justify-center rounded-full px-4 text-sm font-semibold transition-colors hover:text-primary",
          mobile && "w-full border border-border bg-card"
        )}
      >
        Sign In
      </Link>
      <Link 
        href="/sign-up" 
        className={cn(buttonVariants(), "h-9 rounded-full px-5 text-sm font-semibold shadow-sm", mobile && "w-full")}
      >
        Sign Up
      </Link>
    </div>
  );
}

function Navigation({ mobile = false }: { mobile?: boolean }) {
  return (
    <nav 
      aria-label={mobile ? "Mobile navigation" : "Main navigation"}
      className={mobile ? "grid w-full justify-items-start gap-4 text-sm" : "flex items-center gap-6 text-sm"}
    >
      <Link 
        href="/" 
        className="inline-flex items-center gap-1.5 font-medium text-foreground/80 transition-colors hover:text-primary"
      >
        Home
      </Link>
      <Link 
        href="/services" 
        className="inline-flex items-center gap-1.5 font-medium text-foreground/80 transition-colors hover:text-primary"
      >
        <Compass size={15} className="text-primary" />
        Browse Services
      </Link>
      <Suspense fallback={<span className="h-9 w-20" aria-hidden="true" />}>
        <AccountLinks mobile={mobile} />
      </Suspense>
      {!mobile && <ThemeSwitcher />}
    </nav>
  );
}

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-border/80 bg-background/85 backdrop-blur-md transition-all">
      <div className="mx-auto flex min-h-18 max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-8">
        <Brand />
        <div className="hidden sm:block">
          <Navigation />
        </div>
        <div className="flex items-center gap-2 sm:hidden">
          <ThemeSwitcher />
          <ResponsiveDrawer title="Main Menu" kind="menu">
            <Navigation mobile />
          </ResponsiveDrawer>
        </div>
      </div>
    </header>
  );
}

export function SiteFooter() {
  const configured = process.env.WEDPLAN_CONTACT_EMAIL?.trim();
  const email = configured && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(configured) ? configured : "concierge@wedplan.com";

  return (
    <footer className="border-t border-border bg-card text-foreground">
      {/* Top newsletter/curation banner */}
      <div className="border-b border-border/60 bg-secondary/40 py-8 px-4 sm:px-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
          <div>
            <p className="font-display text-xl font-bold text-foreground">Begin Your Forever Story with WedPlan</p>
            <p className="mt-1 text-sm text-muted-foreground">Bangladesh&apos;s premier curated wedding vendor collective and booking suite.</p>
          </div>
          <Link 
            href="/services" 
            className={cn(buttonVariants({ variant: "outline" }), "rounded-full border-primary/30 bg-background px-5 text-sm font-semibold text-primary hover:bg-primary hover:text-primary-foreground")}
          >
            Explore All Services <ArrowRight size={14} className="ml-1.5" />
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
          {/* Brand info */}
          <div className="lg:col-span-2">
            <Brand />
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
              WedPlan is the premier wedding planning platform connecting discerning couples with verified venues, photographers, caterers, and wedding specialists across Bangladesh.
            </p>
            
            {/* Social media links */}
            <div className="mt-6 flex items-center gap-3">
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noreferrer" 
                aria-label="Instagram"
                className="flex size-9 items-center justify-center rounded-full border border-border bg-background text-muted-foreground transition-all hover:border-primary hover:text-primary hover:scale-105"
              >
                <svg className="size-4 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              </a>
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noreferrer" 
                aria-label="Facebook"
                className="flex size-9 items-center justify-center rounded-full border border-border bg-background text-muted-foreground transition-all hover:border-primary hover:text-primary hover:scale-105"
              >
                <svg className="size-4 fill-current" viewBox="0 0 24 24"><path d="M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.374 14.5 5 15.5 5H18V0h-3.808C10.597 0 9 1.583 9 4.615V8z"/></svg>
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noreferrer" 
                aria-label="Twitter / X"
                className="flex size-9 items-center justify-center rounded-full border border-border bg-background text-muted-foreground transition-all hover:border-primary hover:text-primary hover:scale-105"
              >
                <svg className="size-4 fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
              <a 
                href="https://youtube.com" 
                target="_blank" 
                rel="noreferrer" 
                aria-label="YouTube"
                className="flex size-9 items-center justify-center rounded-full border border-border bg-background text-muted-foreground transition-all hover:border-primary hover:text-primary hover:scale-105"
              >
                <svg className="size-4 fill-current" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
              </a>
            </div>
          </div>

          {/* Quick links */}
          <div className="grid content-start gap-2.5 text-sm">
            <p className="font-semibold text-foreground tracking-wide">Quick Navigation</p>
            <Link href="/" className="text-muted-foreground transition-colors hover:text-primary">Home</Link>
            <Link href="/services" className="text-muted-foreground transition-colors hover:text-primary">Browse Services</Link>
            <Link href="/sign-in" className="text-muted-foreground transition-colors hover:text-primary">Sign In</Link>
            <Link href="/sign-up" className="text-muted-foreground transition-colors hover:text-primary">Sign Up as Vendor</Link>
            <Link href="/dashboard" className="text-muted-foreground transition-colors hover:text-primary">Dashboard</Link>
          </div>

          {/* Popular categories */}
          <div className="grid content-start gap-2.5 text-sm">
            <p className="font-semibold text-foreground tracking-wide">Featured Categories</p>
            <Link href="/services?category=Photography+%26+Videography" className="text-muted-foreground transition-colors hover:text-primary">Photography & Video</Link>
            <Link href="/services?category=Wedding+Venues" className="text-muted-foreground transition-colors hover:text-primary">Wedding Venues</Link>
            <Link href="/services?category=Decoration+%26+Florist" className="text-muted-foreground transition-colors hover:text-primary">Decoration & Florist</Link>
            <Link href="/services?category=Catering+Services" className="text-muted-foreground transition-colors hover:text-primary">Catering Services</Link>
            <Link href="/services?category=Makeup+%26+Styling" className="text-muted-foreground transition-colors hover:text-primary">Bridal Makeup</Link>
            <Link href="/services?category=Wedding+Fashion" className="text-muted-foreground transition-colors hover:text-primary">Wedding Fashion</Link>
          </div>

          {/* Contact & repositories */}
          <div className="grid content-start gap-2.5 text-sm">
            <p className="font-semibold text-foreground tracking-wide">Contact & Inquiries</p>
            <div className="flex items-start gap-2 text-muted-foreground">
              <MapPin size={16} className="mt-0.5 shrink-0 text-primary" />
              <span>Gulshan 2, Dhaka 1212, Bangladesh</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Mail size={16} className="shrink-0 text-primary" />
              <a href={`mailto:${email}`} className="hover:underline">{email}</a>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Phone size={16} className="shrink-0 text-primary" />
              <span>+880 1700-000000</span>
            </div>

            <p className="pt-2 font-semibold text-foreground text-xs uppercase tracking-wider">GitHub Repositories</p>
            <div className="flex flex-wrap gap-2 text-xs">
              <a href={clientRepository} target="_blank" rel="noreferrer" className="rounded-md border border-border px-2.5 py-1 text-muted-foreground hover:border-primary hover:text-primary">Client Repo</a>
              <a href={serverRepository} target="_blank" rel="noreferrer" className="rounded-md border border-border px-2.5 py-1 text-muted-foreground hover:border-primary hover:text-primary">Server Repo</a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row">
          <p>© 2026 WedPlan Platform. Crafted with love for unforgettable celebrations.</p>
          <div className="flex items-center gap-6">
            <Link href="/services" className="hover:underline">Explore Directory</Link>
            <Link href="/sign-up" className="hover:underline">Vendor Registration</Link>
            <a href={github} target="_blank" rel="noreferrer" className="hover:underline">Developer Profile</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
