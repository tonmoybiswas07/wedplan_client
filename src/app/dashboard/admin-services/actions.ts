"use server";

import { revalidatePath } from "next/cache";
import { fetchDashboardApi } from "@/lib/dashboard-api";

export async function moderateService(id: string, status: "approved" | "rejected") {
  if (!/^[\da-f]{24}$/i.test(id)) return { ok: false, message: "Service not found." } as const;
  const response = await fetchDashboardApi("admin", `/api/admin/services/${id}/moderation`, {
    method: "PATCH",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ status }),
  });

  if (response.ok) {
    revalidatePath("/dashboard/admin/manage-services");
    revalidatePath("/dashboard/vendor/my-services");
    return { ok: true } as const;
  }
  const body = await response.json().catch(() => null);
  return { ok: false, message: body?.message ?? "The moderation request could not be completed." } as const;
}


export async function deleteInappropriateService(id: string) {
  if (!/^[\da-f]{24}$/i.test(id)) return { ok: false, message: "Service not found." } as const;
  const response = await fetchDashboardApi("admin", `/api/admin/services/${id}`, { method: "DELETE" });
  if (response.ok) {
    for (const path of ["/", "/services", "/dashboard/admin/manage-services", "/dashboard/vendor/my-services"]) revalidatePath(path);
    revalidatePath(`/services/${id}`);
    return { ok: true } as const;
  }
  const result = await response.json().catch(() => null);
  return { ok: false, refresh: response.status === 404, message: result?.message ?? "The service could not be deleted." } as const;
}
