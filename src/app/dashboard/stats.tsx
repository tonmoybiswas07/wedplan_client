import { fetchDashboardApi } from "@/lib/dashboard-api";
import type { DashboardRole } from "./sections";

const metrics = {
  customer: [
    ["total", "Total bookings"], ["pending", "Pending"], ["accepted", "Accepted"], ["rejected", "Rejected"],
  ],
  vendor: [
    ["totalServices", "Total services"], ["activeServices", "Active services"], ["pendingRequests", "Pending requests"],
    ["acceptedBookings", "Accepted bookings"], ["plan", "Current plan"],
  ],
  admin: [
    ["totalUsers", "Total users"], ["vendors", "Vendors"], ["customers", "Customers"],
    ["totalServices", "Total services"], ["pendingServices", "Pending services"], ["transactions", "Transactions"],
  ],
} as const satisfies Record<DashboardRole, readonly (readonly [string, string])[]>;

export async function DashboardStats({ role }: { role: DashboardRole }) {
  const response = await fetchDashboardApi(role, "/api/dashboard/stats");
  if (!response.ok) return <p role="alert" className="text-sm text-muted-foreground">Dashboard statistics are unavailable.</p>;
  const { stats } = await response.json() as { stats: Record<string, number | string | null> };
  return (
    <dl className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {metrics[role].map(([key, label]) => (
        <div key={key} className="min-w-0 border border-line/65 bg-canvas p-3">
          <dt className="text-sm text-muted-foreground">{label}</dt>
          <dd className="mt-1 break-words font-display text-2xl">
            {key === "plan" ? (stats.plan === "premium" ? "Premium" : "Free") : stats[key] ?? "Pending"}
          </dd>
        </div>
      ))}
    </dl>
  );
}
