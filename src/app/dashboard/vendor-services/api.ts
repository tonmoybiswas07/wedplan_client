import "server-only";

import { fetchBackend } from "@/lib/api";
import { getDashboardAccess, getDashboardToken } from "@/lib/dashboard-session";

export async function fetchVendorServices(id?: string, options?: RequestInit) {
  const access = await getDashboardAccess();
  if (access.status === "unavailable") return new Response(null, { status: 503 });
  if (access.status === "guest") return new Response(null, { status: 401 });
  if (access.status !== "allowed" || access.user.role !== "vendor") {
    return new Response(null, { status: 403 });
  }

  const session = await getDashboardToken();
  if (session.status !== "allowed") return new Response(null, { status: 401 });

  try {
    return await fetchBackend(id ? `/api/vendor/services/${encodeURIComponent(id)}` : "/api/vendor/services", {
      ...options,
      headers: { authorization: `Bearer ${session.token}` },
      cache: "no-store",
      redirect: "error",
    });
  } catch {
    return new Response(null, { status: 503 });
  }
}
