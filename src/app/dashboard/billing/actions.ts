"use server";

import { fetchDashboardApi } from "@/lib/dashboard-api";

export async function startCheckout() {
  const response = await fetchDashboardApi("vendor", "/api/vendor/billing/checkout", { method: "POST" });
  const data = await response.json().catch(() => null);
  if (response.ok && typeof data?.url === "string") {
    try {
      const target = new URL(data.url);
      if (target.origin === "https://checkout.stripe.com") return { ok: true, url: target.href } as const;
    } catch {
      // Only a Stripe-hosted Checkout URL can be opened.
    }
  }
  return { ok: false, message: typeof data?.message === "string" ? data.message : "Checkout could not be started. Try again." } as const;
}
