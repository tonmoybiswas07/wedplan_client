import { Suspense } from "react";
import Link from "next/link";
import { Heart } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { getDashboardAccess } from "@/lib/dashboard-session";
import { cn } from "@/lib/utils";
import { DashboardAccount } from "@/app/dashboard/navigation";

const github = "https://github.com/tonmoybiswas07";
const clientRepository = github + "/wedplan_client";
const serverRepository = github + "/wedplan_server";

function Brand() {
  return <Link href="/" className="invitation-brand shrink-0">
    <span className="invitation-mark hidden sm:grid"><Heart size={16} aria-hidden="true" /></span>
    WedPlan
  </Link>;
}

async function AccountLinks() {
  const access = await getDashboardAccess();
  if (access.status === "allowed") {
    return <DashboardAccount name={access.user.name} role={access.user.role} image={access.user.image} />;
  }

  return <>
    <Link href="/sign-in" className="shrink-0 font-medium hover:underline">Sign In</Link>
    <Link href="/sign-up" className={cn(buttonVariants(), "h-9 shrink-0 px-3")}>Sign Up</Link>
  </>;
}

export function SiteHeader() {
  return <header className="border-b border-stationery-line bg-stationery-ivory">
    <div className="mx-auto flex min-h-16 max-w-7xl flex-wrap items-center justify-between gap-x-4 gap-y-2 px-4 py-3 sm:px-8">
      <Brand />
      <nav aria-label="Main navigation" className="flex max-w-full flex-wrap items-center gap-3 text-sm sm:gap-6">
        <Link href="/" className="font-medium hover:underline">Home</Link>
        <Link href="/services" className="font-medium hover:underline">Browse Services</Link>
        <Suspense fallback={<span className="h-9 w-14" aria-hidden="true" />}><AccountLinks /></Suspense>
      </nav>
    </div>
  </header>;
}

export function SiteFooter() {
  const configured = process.env.WEDPLAN_CONTACT_EMAIL?.trim();
  const email = configured && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(configured) ? configured : undefined;
  return <footer className="border-t border-stationery-line bg-stationery-paper">
    <div className="mx-auto grid max-w-7xl gap-7 px-4 py-9 sm:grid-cols-3 sm:px-8">
      <section><Brand />
        <p className="mt-3 max-w-xs text-sm text-muted-foreground">Discover wedding services, compare vendors, and request bookings in one place.</p>
      </section>
      <nav aria-label="Footer navigation" className="grid content-start gap-2 text-sm">
        <p className="font-semibold">Explore</p>
        <Link href="/" className="w-fit hover:underline">Home</Link>
        <Link href="/services" className="w-fit hover:underline">Browse Services</Link>
        <Link href="/dashboard" className="w-fit hover:underline">Dashboard</Link>
      </nav>
      <section className="grid content-start gap-2 text-sm">
        <p className="font-semibold">Contact and project links</p>
        <a href={email ? `mailto:${email}` : clientRepository + "/issues"} className="w-fit hover:underline">
          {email ?? "Contact via GitHub Issues"}
        </a>
        <a href={github} className="flex w-fit items-center gap-2 hover:underline">GitHub profile</a>
        <div className="flex flex-wrap gap-3">
          <a href={clientRepository} className="hover:underline">Client</a>
          <a href={serverRepository} className="hover:underline">Server</a>
        </div>
      </section>
      <p className="border-t border-stationery-line/60 pt-4 text-xs text-muted-foreground sm:col-span-3">© WedPlan. All rights reserved.</p>
    </div>
  </footer>;
}
