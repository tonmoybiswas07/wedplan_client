import type { NextRequest } from "next/server";
import { browserRedirect, fetchCookieAuth, relayCookies } from "@/lib/auth-proxy";
import { safeProfileReturn, safeServiceReturn } from "@/lib/service-return";

export async function GET(request: NextRequest) {
  try {
    const upstream = await fetchCookieAuth(`/api/auth/callback/google${request.nextUrl.search}`);
    const location = upstream.headers.get("location");
    const target = location ? new URL(location, request.nextUrl.origin) : null;
    const path = target?.pathname;
    const profile = safeProfileReturn(path);
    if (!profile && path !== "/auth/complete" && path !== "/sign-in" && path !== "/sign-up") {
      return relayCookies(upstream, browserRedirect("/sign-in?google=failed"));
    }

    // Use only local, known destinations from the callback.
    const query = new URLSearchParams();
    const returnTo = safeServiceReturn(target!.searchParams.get("returnTo"));
    if (returnTo) query.set("returnTo", returnTo);
    if (profile) query.set("google", target!.searchParams.get("google") === "linked" ? "linked" : "failed");
    else if (path !== "/auth/complete") query.set("google", "failed");
    const destination = profile ?? path ?? "/sign-in";
    return relayCookies(upstream, browserRedirect(query.size ? `${destination}?${query}` : destination));
  } catch {
    return browserRedirect("/sign-in?google=failed");
  }
}
