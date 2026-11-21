import { Suspense } from "react";
import { DashboardOverview } from "../../overview";

export default function RoleDashboard({
  params,
}: {
  params: Promise<{ role: string; section?: string[] }>;
}) {
  return (
    <Suspense fallback={<p className="p-8">Loading dashboard…</p>}>
      <DashboardOverview params={params} />
    </Suspense>
  );
}
