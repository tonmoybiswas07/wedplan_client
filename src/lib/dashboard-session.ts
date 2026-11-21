import "server-only";

import { cache } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { fetchBackend } from "@/lib/api";

export const dashboardPaths = {
  customer: "/dashboard/customer",
  vendor: "/dashboard/vendor",
} as const;

export type DashboardRole = keyof typeof dashboardPaths;

type SessionUser = {
  name?: unknown;
  role?: unknown;
  banned?: unknown;
  blocked?: unknown;
};

export const getDashboardAccess = cache(async () => {
  const cookie = (await headers()).get("cookie");
  if (!cookie) return { status: "guest" } as const;

  try {
    const response = await fetchBackend("/api/auth/get-session", {
      headers: { cookie },
      cache: "no-store",
      redirect: "error",
    });
    if (response.status === 401 || response.status === 404) return { status: "guest" } as const;
    if (response.status === 403) return { status: "denied" } as const;
    if (!response.ok) return { status: "unavailable" } as const;

    const data = (await response.json()) as { session?: unknown; user?: SessionUser } | null;
    if (!data?.session || !data.user) return { status: "guest" } as const;

    const { name, role, banned, blocked } = data.user;
    if (banned === true || blocked === true || (role !== "customer" && role !== "vendor")) {
      return { status: "denied" } as const;
    }
    if (typeof name !== "string" || !name.trim()) return { status: "denied" } as const;

    return { status: "allowed", user: { name, role } } as const;
  } catch {
    return { status: "unavailable" } as const;
  }
});

export async function requireDashboardAccess(role?: DashboardRole) {
  const access = await getDashboardAccess();

  if (access.status === "guest") redirect("/sign-in");
  if (access.status === "allowed" && access.user.role !== role) {
    redirect(dashboardPaths[access.user.role]);
  }

  return access;
}
