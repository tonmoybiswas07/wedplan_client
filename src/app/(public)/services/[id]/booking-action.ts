"use server";

import { fetchDashboardApi } from "@/lib/dashboard-api";
import { safeServiceReturn } from "@/lib/service-return";

export type BookingState =
  | { ok: true }
  | { ok: false; message: string; errors?: Partial<Record<"eventDate" | "eventLocation" | "message", string[]>> };

export async function requestBooking(id: string, form: FormData): Promise<BookingState> {
  if (!safeServiceReturn(`/services/${id}`)) return { ok: false, message: "This service is unavailable." };

  const response = await fetchDashboardApi("customer", "/api/bookings", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      serviceId: id,
      eventDate: form.get("eventDate"),
      eventLocation: form.get("eventLocation"),
      message: form.get("message") ?? undefined,
    }),
  });

  if (response.status === 201) return { ok: true };
  const result = await response.json().catch(() => null);
  return {
    ok: false,
    message: response.status === 401 ? "Your session expired. Sign in and try again."
      : result?.message ?? (response.status === 403 ? "Only customers can request bookings." : "Your request could not be sent. Try again."),
    errors: result?.errors,
  };
}
