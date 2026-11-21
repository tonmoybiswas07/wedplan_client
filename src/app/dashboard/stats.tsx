import { fetchDashboardApi } from "@/lib/dashboard-api";
import Link from "next/link";
import { ArrowUpRight, CalendarDays, ChartNoAxesColumn } from "lucide-react";
import { dashboardPath, type DashboardRole } from "./sections";
import { ActivityChart } from "./activity-chart";

const metrics = {
  customer: [
    ["total", "Total bookings"],
    ["pending", "Pending"],
    ["accepted", "Accepted"],
    ["rejected", "Rejected"],
  ],
  vendor: [
    ["totalServices", "Total services"],
    ["activeServices", "Active services"],
    ["pendingRequests", "Pending requests"],
    ["acceptedBookings", "Accepted bookings"],
    ["plan", "Current plan"],
  ],
  admin: [
    ["totalUsers", "Total users"],
    ["vendors", "Vendors"],
    ["customers", "Customers"],
    ["totalServices", "Total services"],
    ["pendingServices", "Pending services"],
    ["transactions", "Transactions"],
  ],
} as const satisfies Record<
  DashboardRole,
  readonly (readonly [string, string])[]
>;

const chartTitles = {
  customer: "Booking status",
  vendor: "Booking requests over time",
  admin: "Marketplace activity",
};

const customerStatuses = [
  ["pending", "Pending"], ["accepted", "Accepted"], ["rejected", "Rejected"],
  ["cancelled", "Cancelled"], ["confirmed", "Confirmed"], ["completed", "Completed"],
] as const;

const chartSeries = {
  customer: [{ key: "bookings", label: "Bookings", color: "var(--chart-1)" }],
  vendor: [
    { key: "bookings", label: "Booking requests", color: "var(--chart-1)" },
  ],
  admin: [
    { key: "users", label: "New users", color: "var(--chart-1)" },
    { key: "services", label: "New services", color: "var(--chart-2)" },
    { key: "bookings", label: "New bookings", color: "var(--chart-3)" },
  ],
};

const monthLabel = new Intl.DateTimeFormat("en", {
  month: "short",
  timeZone: "UTC",
});
const activityDate = new Intl.DateTimeFormat("en-BD", {
  month: "short",
  day: "numeric",
  timeZone: "Asia/Dhaka",
});

export async function DashboardStats({ role }: { role: DashboardRole }) {
  const response = await fetchDashboardApi(role, "/api/dashboard/stats");
  if (!response.ok)
    return (
      <p role="alert" className="workspace-panel">
        Dashboard statistics are unavailable.
      </p>
    );
  const { stats, activity, recent } = (await response.json()) as {
    stats: Record<string, number | string | null>;
    activity?: {
      month: string;
      users?: number;
      services?: number;
      bookings: number;
    }[];
    recent?: { id: string; title: string; date: string; status: string }[];
  };
  const data =
    role === "customer"
      ? customerStatuses.map(([key, label]) => ({ label, bookings: Number(stats[key] ?? 0) }))
      : (activity ?? []).map(({ month, ...counts }) => ({
          label: monthLabel.format(new Date(month + "-01T00:00:00Z")),
          ...counts,
        }));
  const section =
    role === "customer"
      ? "my-bookings"
      : role === "vendor"
        ? "booking-requests"
        : "manage-services";
  return (
    <div className="grid gap-5">
      <dl className={`grid grid-cols-2 gap-3 ${role === "customer" ? "lg:grid-cols-4" : role === "vendor" ? "lg:grid-cols-3 xl:grid-cols-5" : "lg:grid-cols-3 xl:grid-cols-6"}`}>
        {metrics[role].map(([key, label]) => (
          <div
            key={key}
            className="relative min-w-0 overflow-hidden rounded-2xl border border-line bg-paper px-4 py-4 shadow-sm"
          >
            <div
              aria-hidden="true"
              className="absolute inset-y-0 start-0 w-0.5 bg-petal/70"
            />
            <dt className="text-xs font-semibold text-muted-foreground sm:text-sm">
              {label}
            </dt>
            <dd className="mt-2 break-words font-display text-2xl font-extrabold tabular-nums">
              {key === "plan"
                ? stats.plan === "premium"
                  ? "Premium"
                  : "Free"
                : (stats[key] ?? "Pending")}
            </dd>
          </div>
        ))}
      </dl>
      <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,1.65fr)_minmax(0,1fr)]">
        <section
          className="workspace-panel min-w-0"
          aria-labelledby="activity-chart-title"
        >
          <div className="mb-4 flex items-start gap-3">
            <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-blush text-berry">
              <ChartNoAxesColumn size={19} aria-hidden="true" />
            </span>
            <div>
              <h2 id="activity-chart-title" className="font-display text-2xl">
                {chartTitles[role]}
              </h2>
              <p className="text-sm text-muted-foreground">
                {role === "customer"
                ? "All your booking requests by status"
                  : "Last six calendar months · Bangladesh time"}
              </p>
            </div>
          </div>
          {data.length ? (
            <ActivityChart data={data} series={chartSeries[role]} />
          ) : (
            <p className="text-sm text-muted-foreground">
              Chart data is unavailable.
            </p>
          )}
        </section>
        <section
          className="workspace-panel min-w-0"
          aria-labelledby="recent-activity-title"
        >
          <div className="mb-4 flex items-center gap-3">
            <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-blush text-berry">
              <CalendarDays size={18} aria-hidden="true" />
            </span>
            <h2 id="recent-activity-title" className="font-display text-2xl">
              {role === "admin" ? "Recent submissions" : "Recent bookings"}
            </h2>
          </div>
          {recent?.length ? (
            <ul className="divide-y divide-line">
              {recent.map((item) => (
                <li key={item.id} className="py-3">
                  <Link
                    href={
                      role === "admin"
                        ? dashboardPath(role, section) +
                          "?" +
                          new URLSearchParams({ q: item.title })
                        : dashboardPath(role, section) + "/" + item.id
                    }
                    className="flex items-center justify-between gap-2 rounded-md hover:text-berry"
                  >
                    <div className="min-w-0">
                      <p className="break-words text-sm font-bold">
                        {item.title}
                      </p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        <time dateTime={item.date}>
                          {activityDate.format(new Date(item.date))}
                        </time>{" "}
                        · <span className="capitalize">{item.status}</span>
                      </p>
                    </div>
                    <ArrowUpRight
                      size={16}
                      className="shrink-0 text-berry"
                      aria-hidden="true"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="rounded-xl bg-canvas p-4 text-sm text-muted-foreground">
              No recent {role === "admin" ? "service submissions" : "bookings"}{" "}
              yet.
            </p>
          )}
          <Link
            href={dashboardPath(role, section)}
            className="mt-4 inline-flex min-h-9 items-center gap-1 text-sm font-bold text-berry hover:underline"
          >
            {role === "admin"
              ? "Manage services"
              : role === "vendor"
                ? "View requests"
                : "View bookings"}{" "}
            <ArrowUpRight size={15} aria-hidden="true" />
          </Link>
        </section>
      </div>
    </div>
  );
}
