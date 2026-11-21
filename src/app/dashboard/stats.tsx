import { fetchDashboardApi } from "@/lib/dashboard-api";
import Link from "next/link";
import { ArrowUpRight, CalendarDays, ChartNoAxesColumn, Sparkles } from "lucide-react";
import { dashboardPath, type DashboardRole } from "./sections";
import { ActivityChart } from "./activity-chart";

const metrics = {
  customer: [
    ["total", "Total Bookings"],
    ["pending", "Pending"],
    ["accepted", "Accepted"],
    ["rejected", "Rejected"],
  ],
  vendor: [
    ["totalServices", "Total Services"],
    ["activeServices", "Active Services"],
    ["pendingRequests", "Pending Requests"],
    ["acceptedBookings", "Accepted Bookings"],
    ["plan", "Subscription Tier"],
  ],
  admin: [
    ["totalUsers", "Total Users"],
    ["vendors", "Vendors"],
    ["customers", "Customers"],
    ["totalServices", "Total Services"],
    ["pendingServices", "Pending Services"],
    ["transactions", "Transactions"],
  ],
} as const satisfies Record<
  DashboardRole,
  readonly (readonly [string, string])[]
>;

const chartTitles = {
  customer: "Booking Status Distribution",
  vendor: "Booking Inquiries Over Time",
  admin: "Platform Growth & Activity",
};

const customerStatuses = [
  ["pending", "Pending"], ["accepted", "Accepted"], ["rejected", "Rejected"],
  ["cancelled", "Cancelled"], ["confirmed", "Confirmed"], ["completed", "Completed"],
] as const;

const chartSeries = {
  customer: [{ key: "bookings", label: "Bookings", color: "var(--chart-1)" }],
  vendor: [
    { key: "bookings", label: "Booking Requests", color: "var(--chart-1)" },
  ],
  admin: [
    { key: "users", label: "New Users", color: "var(--chart-1)" },
    { key: "services", label: "New Services", color: "var(--chart-2)" },
    { key: "bookings", label: "New Bookings", color: "var(--chart-3)" },
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
      <div role="alert" className="rounded-2xl border border-border bg-card p-6 text-sm text-muted-foreground">
        Dashboard metrics are temporarily unavailable.
      </div>
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
    <div className="grid gap-6">
      {/* Metric Cards Row */}
      <dl className={`grid grid-cols-2 gap-3.5 ${role === "customer" ? "lg:grid-cols-4" : role === "vendor" ? "lg:grid-cols-3 xl:grid-cols-5" : "lg:grid-cols-3 xl:grid-cols-6"}`}>
        {metrics[role].map(([key, label]) => (
          <div
            key={key}
            className="group relative min-w-0 overflow-hidden rounded-2xl border border-border/80 bg-card p-5 shadow-sm transition-all hover:border-primary/30 hover:shadow-md"
          >
            <div
              aria-hidden="true"
              className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-primary to-rose-400 opacity-80"
            />
            <dt className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {label}
            </dt>
            <dd className="mt-2.5 break-words font-display text-2xl sm:text-3xl font-extrabold tabular-nums text-foreground">
              {key === "plan" ? (
                stats.plan === "premium" ? (
                  <span className="inline-flex items-center gap-1 text-base text-amber-500 font-bold">
                    <Sparkles size={14} className="fill-current" /> Premium
                  </span>
                ) : (
                  <span className="text-base font-bold text-muted-foreground">Standard</span>
                )
              ) : (
                stats[key] ?? "0"
              )}
            </dd>
          </div>
        ))}
      </dl>

      {/* Chart & Recent Activity Grid */}
      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)]">
        {/* Activity Chart */}
        <section
          className="rounded-2xl border border-border/80 bg-card p-6 shadow-sm min-w-0"
          aria-labelledby="activity-chart-title"
        >
          <div className="mb-6 flex items-start gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-secondary text-primary">
              <ChartNoAxesColumn size={20} aria-hidden="true" />
            </span>
            <div>
              <h2 id="activity-chart-title" className="font-display text-xl font-bold text-foreground">
                {chartTitles[role]}
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                {role === "customer"
                  ? "Distribution of booking requests across lifecycles"
                  : "Trends over the last 6 calendar months"}
              </p>
            </div>
          </div>
          {data.length ? (
            <ActivityChart data={data} series={chartSeries[role]} />
          ) : (
            <div className="rounded-xl border border-dashed border-border p-8 text-center text-xs text-muted-foreground">
              No chart data recorded yet.
            </div>
          )}
        </section>

        {/* Recent Activity List */}
        <section
          className="rounded-2xl border border-border/80 bg-card p-6 shadow-sm min-w-0"
          aria-labelledby="recent-activity-title"
        >
          <div className="mb-5 flex items-center justify-between border-b border-border/70 pb-4">
            <div className="flex items-center gap-2.5">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-secondary text-primary">
                <CalendarDays size={18} aria-hidden="true" />
              </span>
              <h2 id="recent-activity-title" className="font-display text-lg font-bold text-foreground">
                {role === "admin" ? "Recent Submissions" : "Recent Bookings"}
              </h2>
            </div>
            <Link
              href={dashboardPath(role, section)}
              className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
            >
              View All <ArrowUpRight size={13} />
            </Link>
          </div>

          {recent?.length ? (
            <ul className="divide-y divide-border/60">
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
                    className="group flex items-center justify-between gap-3 transition-colors hover:text-primary"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                        {item.title}
                      </p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        <time dateTime={item.date}>
                          {activityDate.format(new Date(item.date))}
                        </time>{" "}
                        · <span className="capitalize font-medium text-foreground/80">{item.status}</span>
                      </p>
                    </div>
                    <ArrowUpRight
                      size={15}
                      className="shrink-0 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all"
                      aria-hidden="true"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className="rounded-xl border border-dashed border-border/70 p-6 text-center text-xs text-muted-foreground">
              No recent {role === "admin" ? "service submissions" : "bookings"} recorded yet.
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
