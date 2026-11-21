import { SunflowerLoader } from "@/components/ui/sunflower-loader";
import { Suspense } from "react";
import { requireDashboardAccess } from "@/lib/dashboard-session";
import { DashboardNotice } from "./overview";

async function DashboardEntry() {
  const access = await requireDashboardAccess();
  return <DashboardNotice unavailable={access.status === "unavailable"} />;
}

export default function DashboardPage() {
  return <Suspense fallback={<SunflowerLoader label="Loading dashboard…" />}><DashboardEntry /></Suspense>;
}
