import type { NextRequest } from "next/server";
import { browserRedirect, relayCookies } from "@/lib/auth-proxy";
import { postBackendAuth } from "@/lib/api";
import { safeProfileReturn, safeServiceReturn } from "@/lib/service-return";

export async function POST(request: NextRequest) {
  const origin = request.headers.get("origin");
  if (origin !== request.nextUrl.origin && origin !== `${request.nextUrl.protocol}//${request.headers.get("host")}`) {
    return new Response("Forbidden", { status: 403 });
  }

  const form = await request.formData().catch(() => null);
  if (!form) return new Response("Invalid sign-in request.", { status: 400 });
  const mode = form.get("mode") === "link" ? "link" : form.get("mode") === "sign-up" ? "sign-up" : "sign-in";
  const profile = mode === "link" ? safeProfileReturn(form.get("profile")) : undefined;
  const returnTo = safeServiceReturn(form.get("returnTo"));
  function failure(reason: string) {
    const query = new URLSearchParams({ google: reason });
    if (returnTo) query.set("returnTo", returnTo);
    return browserRedirect(`${profile ?? (mode === "sign-up" ? "/sign-up" : "/sign-in")}?${query}`);
  }

  try {
    const upstream = await postBackendAuth("/api/auth/google/start", {
      body: { mode, returnTo }, cookie: request.headers.get("cookie") ?? undefined,
    });
    if (!upstream.ok) return failure(upstream.status === 503 ? "unavailable" : "failed");

    const data = await upstream.json();
    const provider = new URL(data.url);
    if (provider.origin !== "https://accounts.google.com") return failure("failed");
    return relayCookies(upstream, browserRedirect(provider.href));
  } catch {
    return failure("failed");
  }
}
