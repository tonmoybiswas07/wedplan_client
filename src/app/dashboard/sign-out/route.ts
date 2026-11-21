import { NextRequest, NextResponse } from "next/server";
import { postBackendAuth } from "@/lib/api";

export async function POST(request: NextRequest) {
  const origin = request.headers.get("origin");
  const host = request.headers.get("host");
  if (origin !== request.nextUrl.origin && origin !== `${request.nextUrl.protocol}//${host}`) {
    return new Response("Forbidden", { status: 403 });
  }

  const cookie = request.headers.get("cookie");
  if (!cookie) return NextResponse.redirect(new URL("/sign-in", request.url), 303);

  try {
    const upstream = await postBackendAuth("/api/auth/sign-out", { cookie });
    if (upstream.ok || upstream.status === 401) {
      const response = NextResponse.redirect(new URL("/sign-in", request.url), 303);
      for (const value of upstream.headers.getSetCookie()) response.headers.append("set-cookie", value);
      return response;
    }
  } catch {
    return new Response("Sign out is temporarily unavailable.", { status: 502 });
  }

  return new Response("Sign out is temporarily unavailable.", { status: 502 });
}
