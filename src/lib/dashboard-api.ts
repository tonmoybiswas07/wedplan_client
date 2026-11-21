import "server-only";

import type { DashboardRole } from "@/app/dashboard/sections";
import { fetchBackend } from "./api";
import { getDashboardAccess, getDashboardToken } from "./dashboard-session";

export async function fetchDashboardApi(role: DashboardRole, path: string, options?: RequestInit) {
  const access = await getDashboardAccess();
  if (access.status === "unavailable") return new Response(null, { status: 503 });
  if (access.status === "guest") return new Response(null, { status: 401 });
  if (access.status !== "allowed" || access.user.role !== role) {
    return new Response(null, { status: 403 });
  }

  const session = await getDashboardToken();
  if (session.status !== "allowed") return new Response(null, { status: 401 });

  try {
    const headers = new Headers(options?.headers);
    headers.set("authorization", `Bearer ${session.token}`);
    return await fetchBackend(path, { ...options, headers, cache: "no-store", redirect: "error" });
  } catch {
    return new Response(null, { status: 503 });
  }
}
