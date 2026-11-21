import { Suspense } from "react";
import { DashboardOverview } from "../overview";

export default function VendorDashboard() {
  return <Suspense fallback={<p className="dashboard-loading">Loading dashboard…</p>}><DashboardOverview role="vendor" /></Suspense>;
}
