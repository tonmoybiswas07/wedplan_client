import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight, CircleUserRound } from "lucide-react";
import { requireDashboardAccess } from "@/lib/dashboard-session";
import { Suspense } from "react";
import { BookingDetails, BookingList, BookingLoading } from "./bookings/views";
import { AdminUserDetails, AdminUsersList } from "./admin-users/views";
import { ThemeSwitcher } from "@/components/ui/theme";
import { Button } from "@/components/ui/button";
import { ProfileForm } from "./profile/form";
import { AdminTransactions, BillingLoading, PaymentReturn, VendorSubscription } from "./billing/views";
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
    <main className="mx-auto max-w-2xl px-6 py-20">
      <h1 className="mb-4 font-display text-4xl">
        {unavailable ? "Dashboard unavailable" : "Access denied"}
      </h1>
      <p className="mb-5 text-muted-foreground">
        {unavailable
          ? "Your session could not be verified. Try again shortly."
          : "Your account does not have access to this dashboard."}
      </p>
      <Link href="/" className="font-semibold underline underline-offset-4">
        Return home
      </Link>
    </main>
  );
}

function StationeryCard({ children }: { children: ReactNode }) {
  return (
    <section className="workspace-panel min-w-0">{children}</section>
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
        <span className="grid size-10 place-items-center rounded-full bg-blush text-ink">
          <CircleUserRound size={19} aria-hidden="true" />
        </span>
        <h2 className="font-display text-2xl">Your account</h2>
      </div>
      <dl className="grid gap-3 text-sm">
        <div>
          <dt className="text-muted-foreground">Name</dt>
          <dd className="break-words font-semibold">{user.name}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Email</dt>
          <dd className="break-words font-semibold">{user.email}</dd>
        </div>
        {user.role === "vendor" && user.businessName && <div>
          <dt className="text-muted-foreground">Business name</dt>
          <dd className="break-words font-semibold">{user.businessName}</dd>
        </div>}
        <div>
          <dt className="text-muted-foreground">Role</dt>
          <dd className="font-semibold">{workspace.label}</dd>
        </div>
      </dl>
    </>
  );

  const primary = user.role === "vendor" ? "add-service" : user.role === "admin" ? "manage-services" : "my-bookings";
  const secondary = user.role === "admin" ? "transactions" : user.role === "vendor" ? "my-services" : null;

  return (
    <div className="min-h-svh md:grid md:grid-cols-[13rem_minmax(0,1fr)] lg:grid-cols-[15rem_minmax(0,1fr)]">
      <DashboardNavigation role={user.role} section={section} />
      <main
        className="min-w-0 px-4 pb-12 sm:px-8 lg:px-12"
        id="dashboard-overview"
      >
        <div className="mx-auto max-w-6xl">
          <div className="flex min-h-18 items-center justify-between gap-3 border-b border-line">
            <p className="text-sm font-semibold text-berry">
              {workspace.label} dashboard
            </p>
            <div className="flex items-center gap-2"><ThemeSwitcher /><DashboardAccount name={user.name} role={user.role} image={user.image} /></div>
          </div>
          <header className={overview
            ? "relative my-6 overflow-hidden rounded-[1.75rem] bg-plum px-5 py-7 text-on-plum sm:px-8 sm:py-9"
            : "my-6 border-b border-line pb-5 sm:my-8"}>
            {overview && <div aria-hidden="true" className="petal-pattern pointer-events-none absolute inset-y-0 end-0 w-1/2 opacity-65 [mask-image:linear-gradient(to_right,transparent,black)]" />}
            <div className="relative">
              <h1 className="break-words font-display text-3xl leading-tight tracking-tight sm:text-5xl">
                {overview ? `Welcome, ${user.name}` : editing ? "Edit Service" : bookingId ? "Booking Details" : accountId ? "User Details" : payment ? "Payment status" : sections[section].label}
              </h1>
              <p className={overview ? "mt-2 max-w-prose text-on-plum/85" : "mt-2 max-w-prose text-muted-foreground"}>
                {overview ? workspace.description : sections[section].description}
              </p>
              {overview && <div className="mt-5 flex flex-wrap gap-2">
                <Link href={dashboardPath(user.role, primary)} className="inline-flex min-h-11 items-center gap-2 rounded-full bg-paper px-4 py-2 text-sm font-bold text-ink hover:bg-blush">
                  {sections[primary].label} <ArrowUpRight size={16} aria-hidden="true" />
                </Link>
                <Link href={secondary ? dashboardPath(user.role, secondary) : "/services"} className="inline-flex min-h-11 items-center rounded-full border border-on-plum/45 px-4 py-2 text-sm font-semibold text-on-plum hover:bg-on-plum/10">
                  {secondary ? sections[secondary].label : "Browse services"}
                </Link>
              </div>}
            </div>
          </header>
          {overview ? (
            <Suspense fallback={<div role="status" className="workspace-panel motion-safe:animate-pulse">Loading dashboard…</div>}>
              <DashboardStats role={user.role} />
            </Suspense>
          ) : bookingRole ? (
            <Suspense fallback={<BookingLoading />}>
              {bookingId ? <BookingDetails role={bookingRole} id={bookingId} /> : <BookingList role={bookingRole} search={search} />}
            </Suspense>
          ) : section === "add-service" || editing ? (
            <div className="max-w-3xl">
              <StationeryCard>
                <ServiceForm key={service?.id} service={service} />
              </StationeryCard>
            </div>
          ) : section === "my-services" ? (
            <Suspense fallback={<p role="status">Loading services…</p>}>
              <ServiceList />
            </Suspense>
          ) : section === "subscription" ? (
            <Suspense fallback={<BillingLoading />}>
              {payment ? <PaymentReturn kind={payment} search={search} /> : <VendorSubscription />}
            </Suspense>
          ) : section === "transactions" ? (
            <Suspense fallback={<BillingLoading />}><AdminTransactions search={search} /></Suspense>
          ) : section === "manage-users" ? (
            <Suspense fallback={<p role="status">Loading users…</p>}>
              {accountId ? <AdminUserDetails id={accountId} viewerEmail={user.email} /> : <AdminUsersList search={search} viewerEmail={user.email} />}
            </Suspense>
          ) : section === "manage-services" ? (
            <Suspense fallback={<p role="status">Loading services…</p>}>
              <AdminServiceList search={search} />
            </Suspense>
          ) : (
            <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
              <StationeryCard>
                {profile && user.role !== "admin" ? (
                  <>
                    <ProfileForm role={user.role} name={user.name} email={user.email} image={user.image} businessName={user.businessName} />
                    <form action="/api/auth/google" method="post" className="mt-6 border-t border-line/65 pt-5">
                      <input type="hidden" name="mode" value="link" />
                      <input type="hidden" name="profile" value={dashboardPath(user.role, "profile-settings")} />
                      <Button type="submit" variant="outline" className="h-10 px-4">Link Google account</Button>
                      {googleStatus === "linked" && <p role="status" className="mt-2 text-sm">Google account linked.</p>}
                      {googleStatus === "unavailable" && <p role="alert" className="mt-2 text-sm text-destructive">Google sign-in is not configured.</p>}
                      {googleStatus === "failed" && <p role="alert" className="mt-2 text-sm text-destructive">Google linking did not complete. Try again with the email on this account.</p>}
                    </form>
                  </>
                ) : profile ? accountSummary : (
                  <h2 className="font-display text-2xl">Coming soon</h2>
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
