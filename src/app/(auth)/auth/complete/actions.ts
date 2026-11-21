"use server";

import { headers } from "next/headers";
import { postBackendAuth } from "@/lib/api";
import { safeServiceReturn } from "@/lib/service-return";

export async function chooseAccountRole(_previous: { message?: string; destination?: string }, form: FormData): Promise<{ message?: string; destination?: string }> {
  const role = form.get("role");
  if (role !== "customer" && role !== "vendor") return { message: "Choose Customer or Vendor to continue." };

  try {
    const response = await postBackendAuth("/api/auth/google/onboarding", {
      body: { role }, cookie: (await headers()).get("cookie") ?? undefined,
    });
    if (response.ok) return { destination: safeServiceReturn(form.get("returnTo")) ?? "/dashboard" };
    if (response.status === 409) return { message: "Your account type is already set. Reload to continue." };
    return { message: "Your account type could not be saved. Sign in again and retry." };
  } catch {
    return { message: "Account setup is temporarily unavailable." };
  }
}
