import "server-only";

import { cache } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { fetchBackend } from "@/lib/api";
import { dashboardPath, isDashboardRole } from "@/app/dashboard/sections";

export const getDashboardToken = cache(async () => {
  const cookie = (await headers()).get("cookie");
  if (!cookie) return { status: "guest" } as const;

  try {
    const session = await fetchBackend("/api/auth/token", {
      headers: { cookie },
      cache: "no-store",
      redirect: "error",
    });
    if (session.status === 401) return { status: "guest" } as const;
    if (session.status === 403) return { status: "denied" } as const;
    if (!session.ok) return { status: "unavailable" } as const;

    const { token } = await session.json();
    if (typeof token !== "string" || !token) return { status: "unavailable" } as const;

    return { status: "allowed", token } as const;
  } catch {
    return { status: "unavailable" } as const;
  }
});

export const getDashboardAccess = cache(async () => {
  const session = await getDashboardToken();
  if (session.status !== "allowed") return session;

  try {
    const response = await fetchBackend("/api/me", {
      headers: { authorization: `Bearer ${session.token}` },
      cache: "no-store",
      redirect: "error",
    });
    if (response.status === 403) return { status: "denied" } as const;
    if (response.status === 401) return { status: "guest" } as const;
    if (!response.ok) return { status: "unavailable" } as const;

    const { user } = (await response.json()) as { user?: { name?: unknown; email?: unknown; role?: unknown } };
    if (!user || !isDashboardRole(user.role) || typeof user.name !== "string" || typeof user.email !== "string") {
      return { status: "denied" } as const;
    }

    return { status: "allowed", user: { name: user.name, email: user.email, role: user.role } } as const;
  } catch {
    return { status: "unavailable" } as const;
  }
});

export async function requireDashboardAccess(role?: string) {
  const access = await getDashboardAccess();

  if (access.status === "guest") redirect("/sign-in");
  if (access.status === "allowed" && access.user.role !== role) {
    redirect(dashboardPath(access.user.role));
  }

  return access;
}
