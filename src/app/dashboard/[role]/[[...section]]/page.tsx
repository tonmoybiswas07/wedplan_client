import { Suspense } from "react";
import type { DashboardSearch } from "../../admin-services/list";
import { DashboardOverview } from "../../overview";

export default function RoleDashboard({
  params, searchParams,
}: {
  params: Promise<{ role: string; section?: string[] }>;
  searchParams: Promise<DashboardSearch>;
}) {
  return (
    <Suspense fallback={<p className="p-8">Loading dashboard…</p>}>
      <DashboardOverview params={params} search={searchParams} />
    </Suspense>
  );
}
