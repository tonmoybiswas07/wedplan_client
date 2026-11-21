"use server";

import { revalidatePath } from "next/cache";
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
  for (const key of ["title", "category", "description", "price"]) {
    const value = form.get(key);
    if (typeof value === "string") body.set(key, value);
  }

  const image = form.get("image");
  if (image && typeof image !== "string" && image.size) {
    if (image.size > 5 * 1024 * 1024) {
      return { ok: false, message: "Check the service image.", errors: { image: ["Choose an image under 5 MB."] } };
    }
    body.set("image", new Blob([await image.arrayBuffer()], { type: image.type }), image.name);
  }

  return mutationResult(await fetchVendorServices(id, { method: id ? "PATCH" : "POST", body }));
}

export async function deleteVendorService(id: string): Promise<ServiceResult> {
  return mutationResult(await fetchVendorServices(id, { method: "DELETE" }));
}
