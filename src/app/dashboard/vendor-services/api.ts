import "server-only";

import { fetchDashboardApi } from "@/lib/dashboard-api";

export function fetchVendorServices(id?: string, options?: RequestInit) {
  return fetchDashboardApi("vendor", id ? `/api/vendor/services/${encodeURIComponent(id)}` : "/api/vendor/services", options);
}
