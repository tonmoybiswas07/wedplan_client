import type { ReactNode } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, CircleUserRound, Heart } from "lucide-react";
import { requireDashboardAccess } from "@/lib/dashboard-session";
import { Suspense } from "react";
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
  type DashboardSection,
} from "./sections";

export function DashboardNotice({ unavailable }: { unavailable: boolean }) {
  return (
    <main className="mx-auto max-w-2xl px-6 py-20">
      <h1 className="mb-4 font-stationery text-4xl">
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
    <section className="min-w-0 border border-stationery-line bg-stationery-paper p-1 shadow-sm">
      <div className="h-full border border-stationery-line/65 p-5 sm:p-7">
        {children}
      </div>
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
  if (
    !section ||
    (!editing && slug && (slug.length !== 1 || section === "overview"))
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
  const accountSummary = (
    <>
      <div className="mb-5 flex items-center gap-3">
        <span className="grid size-10 place-items-center rounded-full bg-stationery-blush text-stationery-plum">
          <CircleUserRound size={19} aria-hidden="true" />
        </span>
        <h2 className="font-stationery text-2xl">Your account</h2>
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
        <div>
          <dt className="text-muted-foreground">Role</dt>
          <dd className="font-semibold">{workspace.label}</dd>
        </div>
      </dl>
    </>
  );

  function workspaceLink(item: DashboardSection) {
    return (
      <li key={item}>
        <Link
          href={dashboardPath(user.role, item)}
          prefetch={false}
          className="group flex items-center justify-between gap-3 py-3 text-sm font-semibold text-stationery-plum hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stationery-rose"
        >
          <span>{sections[item].label}</span>
          <span className="flex items-center gap-2 text-xs font-medium text-stationery-rose">
            {!["profile-settings", "my-services", "add-service", "manage-services"].includes(
              item,
            ) && "Coming soon"}
            <ArrowRight size={15} aria-hidden="true" />
          </span>
        </Link>
      </li>
    );
  }

  return (
    <div className="min-h-svh md:grid md:grid-cols-[14rem_minmax(0,1fr)] lg:grid-cols-[16rem_minmax(0,1fr)]">
      <DashboardNavigation role={user.role} section={section} />
      <main
        className="min-w-0 px-4 pb-12 sm:px-8 lg:px-12"
        id="dashboard-overview"
      >
        <div className="mx-auto max-w-6xl">
          <div className="flex min-h-20 items-center justify-between gap-3 border-b border-stationery-line">
            <p className="text-sm font-semibold text-stationery-rose">
              {workspace.label} dashboard
            </p>
            <DashboardAccount name={user.name} role={user.role} />
          </div>
          <header className="py-8 sm:py-11">
            <h1 className="break-words font-stationery text-4xl leading-tight tracking-tight text-stationery-plum sm:text-5xl">
              {overview
                ? `Welcome, ${user.name}`
                : editing
                  ? "Edit Service"
                  : sections[section].label}
            </h1>
            <p className="mt-2 max-w-prose text-muted-foreground">
              {overview ? workspace.description : sections[section].description}
            </p>
          </header>
          {overview ? (
            <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
              <StationeryCard>
                <div className="mb-2 flex items-center gap-3">
                  <span className="grid size-10 place-items-center rounded-full bg-stationery-blush text-stationery-plum">
                    <Heart size={18} aria-hidden="true" />
                  </span>
                  <h2 className="font-stationery text-2xl">Overview</h2>
                </div>
                <ul className="divide-y divide-stationery-line/60">
                  {workspace.sections
                    .filter((item) => item !== "overview")
                    .map(workspaceLink)}
                </ul>
              </StationeryCard>
              <StationeryCard>{accountSummary}</StationeryCard>
            </div>
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
          ) : section === "manage-services" ? (
            <Suspense fallback={<p role="status">Loading services…</p>}>
              <AdminServiceList search={search} />
            </Suspense>
          ) : (
            <div className="max-w-2xl">
              <StationeryCard>
                {profile ? (
                  <>
                    {accountSummary}
                    <p className="mt-5 border-t border-stationery-line pt-4 text-sm text-muted-foreground">
                      Profile editing is coming soon.
                    </p>
                  </>
                ) : (
                  <h2 className="font-stationery text-2xl">Coming soon</h2>
                )}
              </StationeryCard>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
