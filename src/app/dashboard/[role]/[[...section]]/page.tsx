import { SunflowerLoader } from "@/components/ui/sunflower-loader";
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
    <Suspense fallback={<SunflowerLoader label="Loading dashboard…" />}>
      <DashboardOverview params={params} search={searchParams} />
    </Suspense>
  );
}
