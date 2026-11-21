"use server";

import { revalidatePath } from "next/cache";
import { fetchDashboardApi } from "@/lib/dashboard-api";

export type ProfileState = { ok: true } | {
  ok: false; message: string; errors?: Partial<Record<"name" | "businessName" | "image", string[]>>;
};

export async function saveProfile(role: "customer" | "vendor", form: FormData): Promise<ProfileState> {
  if (role !== "customer" && role !== "vendor") return { ok: false, message: "Access denied." };
  const body = new FormData();
  for (const field of ["name", "businessName"]) {
    const value = form.get(field);
    if (typeof value === "string") body.set(field, value);
  }
  const image = form.get("image");
  if (image && typeof image !== "string" && image.size) {
    if (image.size > 5 * 1024 * 1024) {
      return { ok: false, message: "Check the profile photo.", errors: { image: ["Choose an image no larger than 5 MB."] } };
    }
    body.set("image", new Blob([await image.arrayBuffer()], { type: image.type }), image.name);
  }

  const response = await fetchDashboardApi(role, "/api/profile", { method: "PATCH", body });
  if (response.ok) {
    revalidatePath("/", "layout");
    return { ok: true };
  }

  const result = await response.json().catch(() => null);
  return { ok: false, message: result?.message ?? "Your profile could not be saved. Try again.", errors: result?.errors };
}
