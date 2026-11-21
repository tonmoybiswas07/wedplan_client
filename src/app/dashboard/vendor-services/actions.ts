"use server";

import { revalidatePath } from "next/cache";
import { fetchDashboardApi } from "@/lib/dashboard-api";
import { fetchVendorServices } from "./api";
import type { ServiceErrors } from "./model";

type ServiceResult =
  | { ok: true }
  | { ok: false; message: string; errors?: ServiceErrors };

async function mutationResult(response: Response): Promise<ServiceResult> {
  if (response.ok) {
    revalidatePath("/dashboard/vendor/my-services");
    return { ok: true };
  }

  const result: { message?: string; errors?: ServiceErrors } | null = await response.json().catch(() => null);
  const message = response.status === 401 ? "Your session expired. Sign in and try again."
    : response.status === 403 ? "You don’t have access to vendor services."
    : result?.message ?? "The service could not be saved or deleted. Try again.";
  return { ok: false, message, errors: result?.errors };
}

export async function saveVendorService(id: string | undefined, form: FormData): Promise<ServiceResult> {
  const body = new FormData();
  for (const key of ["title", "category", "location", "description", "price"]) {
    const value = form.get(key);
    if (typeof value === "string") body.set(key, value);
  }

  const images = form.getAll("image").filter((value): value is File => typeof value !== "string" && value.size > 0);
  if (images.length > 4 || images.reduce((total, image) => total + image.size, 0) > 5 * 1024 * 1024) {
    return { ok: false, message: "Check the service images.", errors: { image: ["Choose up to four images totalling 5 MB or less."] } };
  }
  for (const image of images) {
    body.append("image", new Blob([await image.arrayBuffer()], { type: image.type }), image.name);
  }

  return mutationResult(await fetchVendorServices(id, { method: id ? "PATCH" : "POST", body }));
}

export async function deleteVendorService(id: string): Promise<ServiceResult> {
  return mutationResult(await fetchVendorServices(id, { method: "DELETE" }));
}

export async function setServiceAvailability(id: string, isActive: boolean): Promise<ServiceResult> {
  if (!/^[\da-f]{24}$/i.test(id)) return { ok: false, message: "Service not found." };
  return mutationResult(await fetchDashboardApi("vendor", `/api/vendor/services/${id}/availability`, {
    method: "PATCH",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ isActive }),
  }));
}
