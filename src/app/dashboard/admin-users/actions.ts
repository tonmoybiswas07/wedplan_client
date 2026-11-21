"use server";

import { revalidatePath } from "next/cache";
import { fetchDashboardApi } from "@/lib/dashboard-api";
import { adminUsersPath } from "./model";

export async function changeAccountStatus(id: string, blocked: boolean) {
  if (!/^[\da-f]{24}$/i.test(id)) return { ok: false, message: "User not found." } as const;
  if (typeof blocked !== "boolean") return { ok: false, message: "Choose a valid account status." } as const;

  const response = await fetchDashboardApi("admin", `/api/admin/users/${id}/status`, {
    method: "PATCH",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ blocked }),
  });

  if (response.ok) {
    revalidatePath(adminUsersPath);
    revalidatePath(`${adminUsersPath}/${id}`);
    return { ok: true } as const;
  }

  const data = await response.json().catch(() => null);
  return { ok: false, message: data?.message ?? "The account could not be updated. Try again." } as const;
}
