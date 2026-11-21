import { Suspense } from "react";
import Link from "next/link";
import { Heart } from "lucide-react";
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
  return <Link href="/" className="invitation-brand shrink-0">
    <span className="invitation-mark hidden sm:grid"><Heart size={16} aria-hidden="true" /></span>
    WedPlan
  </Link>;
}

async function AccountLinks({ mobile }: { mobile: boolean }) {
  const access = await getDashboardAccess();
  if (access.status === "allowed") {
    return <DashboardAccount name={access.user.name} role={access.user.role} image={access.user.image} align={mobile ? "start" : "end"} />;
  }

  return <>
    <Link href="/sign-in" className="shrink-0 font-medium hover:underline">Sign In</Link>
    <Link href="/sign-up" className={cn(buttonVariants(), "h-9 shrink-0 px-3")}>Sign Up</Link>
  </>;
}

function Navigation({ mobile = false }: { mobile?: boolean }) {
  return <nav aria-label={mobile ? "Mobile navigation" : "Main navigation"}
    className={mobile ? "flex flex-col items-start gap-4 text-sm" : "flex items-center gap-5 text-sm"}>
    <Link href="/" className="font-medium hover:underline">Home</Link>
    <Link href="/services" className="font-medium hover:underline">Browse Services</Link>
    <Suspense fallback={<span className="h-9 w-14" aria-hidden="true" />}><AccountLinks mobile={mobile} /></Suspense>
    <ThemeSwitcher />
  </nav>;
}

export function SiteHeader() {
  return <header className="relative z-30 border-b border-line bg-canvas">
    <div className="mx-auto flex min-h-18 max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-8">
      <Brand />
      <div className="hidden sm:block"><Navigation /></div>
      <div className="flex items-center gap-2 sm:hidden">
        <ThemeSwitcher />
        <ResponsiveDrawer title="Main menu" kind="menu"><Navigation mobile /></ResponsiveDrawer>
      </div>
    </div>
  </header>;
}

export function SiteFooter() {
  const configured = process.env.WEDPLAN_CONTACT_EMAIL?.trim();
  const email = configured && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(configured) ? configured : undefined;
  return <footer className="border-t border-line bg-plum text-on-plum">
    <div className="mx-auto grid max-w-7xl gap-7 px-4 py-9 sm:grid-cols-3 sm:px-8">
      <section><Brand />
        <p className="mt-3 max-w-xs text-sm text-on-plum/80">Discover wedding services, compare vendors, and request bookings in one place.</p>
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
      <p className="border-t border-line/60 pt-4 text-xs text-on-plum/80 sm:col-span-3">© WedPlan. All rights reserved.</p>
    </div>
  </footer>;
}
