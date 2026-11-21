import "server-only";

import { headers } from "next/headers";
import { fetchBackend } from "./api";

export async function fetchCookieAuth(path: string, options?: RequestInit) {
  const forwarded = new Headers(options?.headers);
  const cookie = (await headers()).get("cookie");
  if (cookie) forwarded.set("cookie", cookie);
  return fetchBackend(path, { ...options, headers: forwarded, cache: "no-store", redirect: "manual" });
}

export function relayCookies(upstream: Response, response: Response) {
  for (const cookie of upstream.headers.getSetCookie()) response.headers.append("set-cookie", cookie);
  return response;
}

export function browserRedirect(path: string) {
  return new Response(null, { status: 303, headers: { location: path, "cache-control": "no-store" } });
}
