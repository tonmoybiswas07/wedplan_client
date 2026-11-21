"use server";

import { revalidatePath } from "next/cache";
import { fetchDashboardApi } from "@/lib/dashboard-api";
import { bookingsPath, type BookingAction } from "./model";

export async function changeBookingStatus(id: string, status: BookingAction) {
  if (!/^[\da-f]{24}$/i.test(id)) return { ok: false, message: "Booking not found." } as const;
  if (status !== "accepted" && status !== "rejected" && status !== "cancelled") {
    return { ok: false, message: "Choose a valid booking action." } as const;
  }
  const role = status === "cancelled" ? "customer" : "vendor";
  const response = await fetchDashboardApi(role, `/api/bookings/${id}/status`, {
    method: "PATCH",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ status }),
  });
  if (response.ok) {
    for (const participant of ["customer", "vendor"] as const) {
      revalidatePath(bookingsPath(participant));
      revalidatePath(bookingsPath(participant, id));
      revalidatePath(`/dashboard/${participant}`);
    }
    return { ok: true } as const;
  }

  const result = await response.json().catch(() => null);
  return {
    ok: false,
    refresh: response.status === 409 || response.status === 404,
    message: result?.message ?? (response.status === 401 ? "Your session expired. Sign in and try again." : "The booking could not be updated. Try again."),
  } as const;
}
