import { SunflowerLoader } from "@/components/ui/sunflower-loader";
import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight, CircleUserRound, Sparkles } from "lucide-react";
import { requireDashboardAccess } from "@/lib/dashboard-session";
import { Suspense } from "react";
import { BookingDetails, BookingList } from "./bookings/views";
import { AdminUserDetails, AdminUsersList } from "./admin-users/views";
import { ThemeSwitcher } from "@/components/ui/theme";
import { Button } from "@/components/ui/button";
import { ProfileForm } from "./profile/form";
import { AdminTransactions, PaymentReturn, VendorSubscription } from "./billing/views";
import { DashboardStats } from "./stats";
import { AdminServiceList, type DashboardSearch } from "./admin-services/list";
import { fetchVendorServices } from "./vendor-services/api";
import { ServiceForm } from "./vendor-services/form";
import { ServiceList } from "./vendor-services/list";
import type { VendorService } from "./vendor-services/model";
import { DashboardAccount, DashboardNavigation } from "./navigation";
import {
  dashboardPath,
  dashboardRoles,
  sections,
} from "./sections";

export function DashboardNotice({ unavailable }: { unavailable: boolean }) {
  return (
    <main className="mx-auto max-w-2xl px-6 py-20 text-center">
      <div className="rounded-3xl border border-border bg-card p-10 shadow-sm">
        <Sparkles className="mx-auto size-10 text-muted-foreground/40 mb-3" />
        <h1 className="mb-3 font-display text-3xl font-bold text-foreground">
          {unavailable ? "Dashboard Unavailable" : "Access Restricted"}
        </h1>
        <p className="mb-6 text-sm text-muted-foreground leading-relaxed">
          {unavailable
            ? "Your session could not be verified at this moment. Please refresh or try again shortly."
            : "Your current account role does not have authorization to access this dashboard space."}
        </p>
        <Link 
          href="/" 
          className="inline-flex h-10 items-center justify-center rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-sm"
        >
          Return to WedPlan Home
        </Link>
      </div>
    </main>
  );
}

function StationeryCard({ children }: { children: ReactNode }) {
  return (
    <section className="rounded-2xl border border-border/80 bg-card p-6 shadow-sm min-w-0">
      {children}
    </section>
  );
}

export async function DashboardOverview({
  params, search,
}: {
  params: Promise<{ role: string; section?: string[] }>;
  search: Promise<DashboardSearch>;
}) {
  const { role, section: slug } = await params;
  const access = await requireDashboardAccess(role);
  if (access.status !== "allowed") {
    return <DashboardNotice unavailable={access.status === "unavailable"} />;
  }

  const user = access.user;
  const workspace = dashboardRoles[user.role];
  const section = workspace.sections.find(
    (item) => item === (slug?.[0] ?? "overview"),
  );
  const editing =
    user.role === "vendor" && section === "my-services" && slug?.length === 2;
  const bookingRole = user.role === "customer" && section === "my-bookings" ? "customer"
    : user.role === "vendor" && section === "booking-requests" ? "vendor" : undefined;
  const bookingId = bookingRole && slug?.length === 2 ? slug[1] : undefined;
  const accountId = section === "manage-users" && slug?.length === 2 ? slug[1] : undefined;
  const payment = section === "subscription" && slug?.length === 2 && (slug[1] === "success" || slug[1] === "cancel") ? slug[1] : undefined;
  
  if (
    !section ||
    (!editing && !bookingId && !accountId && !payment && slug && (slug.length !== 1 || section === "overview"))
  )
    notFound();

  let service: VendorService | undefined;
  if (editing) {
    const response = await fetchVendorServices(slug[1]);
    if (response.status === 404) notFound();
    if (!response.ok)
      return <DashboardNotice unavailable={response.status >= 500} />;
    ({ service } = (await response.json()) as { service: VendorService });
  }

  const overview = section === "overview";
  const profile = section === "profile-settings";
  const googleStatus = profile ? (await search).google : undefined;
  
  const accountSummary = (
    <>
      <div className="mb-5 flex items-center gap-3">
        <span className="flex size-10 items-center justify-center rounded-xl bg-secondary text-primary">
          <CircleUserRound size={20} aria-hidden="true" />
        </span>
        <h2 className="font-display text-xl font-bold text-foreground">Account Information</h2>
      </div>
      <dl className="grid gap-3.5 text-sm">
        <div className="rounded-xl border border-border/60 bg-background/50 p-3">
          <dt className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Full Name</dt>
          <dd className="mt-0.5 break-words font-semibold text-foreground">{user.name}</dd>
        </div>
        <div className="rounded-xl border border-border/60 bg-background/50 p-3">
          <dt className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Email Address</dt>
          <dd className="mt-0.5 break-words font-semibold text-foreground">{user.email}</dd>
        </div>
        {user.role === "vendor" && user.businessName && (
          <div className="rounded-xl border border-border/60 bg-background/50 p-3">
            <dt className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Business Name</dt>
            <dd className="mt-0.5 break-words font-semibold text-foreground">{user.businessName}</dd>
          </div>
        )}
        <div className="rounded-xl border border-border/60 bg-background/50 p-3">
          <dt className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Role</dt>
          <dd className="mt-0.5 font-semibold text-primary capitalize">{workspace.label}</dd>
        </div>
      </dl>
    </>
  );

  const primary = user.role === "vendor" ? "add-service" : user.role === "admin" ? "manage-services" : "my-bookings";
  const secondary = user.role === "admin" ? "transactions" : user.role === "vendor" ? "my-services" : null;

  return (
    <div className="min-h-svh md:grid md:grid-cols-[14rem_minmax(0,1fr)] lg:grid-cols-[16rem_minmax(0,1fr)] bg-background">
      <DashboardNavigation role={user.role} section={section} />
      <main
        className="min-w-0 px-4 pb-14 sm:px-8 lg:px-12"
        id="dashboard-overview"
      >
        <div className="mx-auto max-w-6xl">
          {/* Top bar */}
          <div className="flex min-h-18 items-center justify-between gap-3 border-b border-border/70 py-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-primary">
                {workspace.label} Console
              </span>
              <span className="text-muted-foreground">/</span>
              <span className="text-xs font-medium text-muted-foreground capitalize">
                {sections[section].label}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <ThemeSwitcher />
              <DashboardAccount name={user.name} role={user.role} image={user.image} />
            </div>
          </div>

          {/* Banner / Header */}
          <header className={overview
            ? "relative my-6 overflow-hidden rounded-3xl bg-gradient-to-r from-primary via-rose-800 to-primary px-6 py-8 text-primary-foreground shadow-lg shadow-primary/10 sm:px-10 sm:py-10"
            : "my-6 border-b border-border/70 pb-5 sm:my-8"}>
            <div className="relative z-10">
              <h1 className="break-words font-display text-3xl font-extrabold tracking-tight sm:text-5xl leading-tight">
                {overview ? `Welcome, ${user.name}` : editing ? "Edit Service" : bookingId ? "Booking Details" : accountId ? "User Details" : payment ? "Payment Status" : sections[section].label}
              </h1>
              <p className={overview ? "mt-2 max-w-prose text-primary-foreground/90 text-sm sm:text-base leading-relaxed" : "mt-2 max-w-prose text-sm text-muted-foreground"}>
                {overview ? workspace.description : sections[section].description}
              </p>
              {overview && (
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link 
                    href={dashboardPath(user.role, primary)} 
                    className="inline-flex min-h-10 items-center gap-2 rounded-full bg-white px-5 py-2 text-xs font-bold text-primary shadow-sm hover:bg-white/90 transition-all"
                  >
                    {sections[primary].label} <ArrowUpRight size={14} aria-hidden="true" />
                  </Link>
                  <Link 
                    href={secondary ? dashboardPath(user.role, secondary) : "/services"} 
                    className="inline-flex min-h-10 items-center rounded-full border border-white/40 bg-white/10 px-5 py-2 text-xs font-semibold text-white hover:bg-white/20 transition-all backdrop-blur-sm"
                  >
                    {secondary ? sections[secondary].label : "Browse Public Directory"}
                  </Link>
                </div>
              )}
            </div>
          </header>

          {/* Section Dynamic Views */}
          {overview ? (
            <Suspense fallback={<SunflowerLoader label="Loading dashboard metrics…" />}>
              <DashboardStats role={user.role} />
            </Suspense>
          ) : bookingRole ? (
            <Suspense fallback={<SunflowerLoader label="Loading bookings…" />}>
              {bookingId ? <BookingDetails role={bookingRole} id={bookingId} /> : <BookingList role={bookingRole} search={search} />}
            </Suspense>
          ) : section === "add-service" || editing ? (
            <div className="max-w-3xl">
              <StationeryCard>
                <ServiceForm key={service?.id} service={service} />
              </StationeryCard>
            </div>
          ) : section === "my-services" ? (
            <Suspense fallback={<SunflowerLoader label="Loading services…" />}>
              <ServiceList />
            </Suspense>
          ) : section === "subscription" ? (
            <Suspense fallback={<SunflowerLoader label="Loading billing information…" />}>
              {payment ? <PaymentReturn kind={payment} search={search} /> : <VendorSubscription />}
            </Suspense>
          ) : section === "transactions" ? (
            <Suspense fallback={<SunflowerLoader label="Loading billing records…" />}>
              <AdminTransactions search={search} />
            </Suspense>
          ) : section === "manage-users" ? (
            <Suspense fallback={<SunflowerLoader label="Loading users…" />}>
              {accountId ? <AdminUserDetails id={accountId} viewerEmail={user.email} /> : <AdminUsersList search={search} viewerEmail={user.email} />}
            </Suspense>
          ) : section === "manage-services" ? (
            <Suspense fallback={<SunflowerLoader label="Loading services…" />}>
              <AdminServiceList search={search} />
            </Suspense>
          ) : (
            <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
              <StationeryCard>
                {profile && user.role !== "admin" ? (
                  <>
                    <ProfileForm role={user.role} name={user.name} email={user.email} image={user.image} businessName={user.businessName} />
                    <form action="/api/auth/google" method="post" className="mt-8 border-t border-border/70 pt-6">
                      <input type="hidden" name="mode" value="link" />
                      <input type="hidden" name="profile" value={dashboardPath(user.role, "profile-settings")} />
                      <Button type="submit" variant="outline" className="h-10 rounded-full px-5 text-xs font-semibold">
                        Link Google Account
                      </Button>
                      {googleStatus === "linked" && <p role="status" className="mt-2 text-xs text-emerald-600 font-medium">Google account linked successfully.</p>}
                      {googleStatus === "unavailable" && <p role="alert" className="mt-2 text-xs text-destructive font-medium">Google sign-in is not configured.</p>}
                      {googleStatus === "failed" && <p role="alert" className="mt-2 text-xs text-destructive font-medium">Google linking did not complete. Try again with the email on this account.</p>}
                    </form>
                  </>
                ) : profile ? accountSummary : (
                  <h2 className="font-display text-2xl font-bold">Coming Soon</h2>
                )}
              </StationeryCard>
              {profile && user.role !== "admin" && (
                <StationeryCard>
                  <div className="relative mb-5 hidden aspect-[16/9] overflow-hidden rounded-xl lg:block">
                    <Image src="/bloom/florist.webp" alt="" fill sizes="(min-width: 1024px) 26vw, 1px" className="object-cover" />
                  </div>
                  {accountSummary}
                </StationeryCard>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
