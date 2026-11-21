import Link from "next/link";
import {
  requireDashboardAccess,
  type DashboardRole,
} from "@/lib/dashboard-session";
import { DashboardNavigation } from "./navigation";

export function DashboardNotice({ unavailable }: { unavailable: boolean }) {
  return (
    <main className="dashboard-notice">
      <h1>{unavailable ? "Dashboard unavailable" : "Access denied"}</h1>
      <p>
        {unavailable
          ? "Your session could not be verified. Try again shortly."
          : "Your account does not have access to this dashboard."}
      </p>
      <Link href="/">Return home</Link>
    </main>
  );
}

export async function DashboardOverview({ role }: { role: DashboardRole }) {
  const access = await requireDashboardAccess(role);

  if (access.status !== "allowed") {
    return <DashboardNotice unavailable={access.status === "unavailable"} />;
  }

  const { name } = access.user;
  const roleLabel = access.user.role === "customer" ? "Customer" : "Vendor";

  return (
    <div className="dashboard-grid">
      <DashboardNavigation name={name} role={access.user.role} />
      <main className="dashboard-main" id="dashboard-overview">
        <p className="dashboard-role">{roleLabel} dashboard</p>
        <h1>Welcome, {name}</h1>
        <section className="dashboard-card" aria-labelledby="overview-heading">
          <h2 id="overview-heading">Overview</h2>
          <p>
            {role === "customer"
              ? "Your workspace for planning your wedding."
              : "Your workspace for managing your wedding services."}
          </p>
        </section>
      </main>
    </div>
  );
}
