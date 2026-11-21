"use server";

import { cookies } from "next/headers";
import { parseString } from "set-cookie-parser";
import { safeServiceReturn } from "@/lib/service-return";
import { fetchBackend, postBackendAuth } from "@/lib/api";

export type AuthState = {
  errors?: Partial<Record<"name" | "email" | "password" | "role" | "image", string>>;
  message?: string;
  returnTo?: string;
};

async function authenticate(form: FormData, signingUp: boolean): Promise<AuthState> {
  const name = form.get("name");
  const email = form.get("email");
  const password = form.get("password");
  const role = form.get("role");
  const errors: NonNullable<AuthState["errors"]> = {};

  if (signingUp && (typeof name !== "string" || name.trim().length < 2 || name.trim().length > 100)) {
    errors.name = "Enter a name between 2 and 100 characters.";
  }
  if (typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    errors.email = "Enter a valid email address.";
  }
  if (typeof password !== "string" || !password) {
    errors.password = "Enter your password.";
  } else if (signingUp && password.length < 6) {
    errors.password = "Use at least 6 characters.";
  } else if (signingUp && (!/[A-Z]/.test(password) || !/[a-z]/.test(password))) {
    errors.password = "Include an uppercase and a lowercase letter.";
  } else if (password.length > 128) {
    errors.password = "Use 128 characters or fewer.";
  }
  if (signingUp && role !== "customer" && role !== "vendor") {
    errors.role = "Choose an account type.";
  }

  const image = signingUp ? form.get("image") : null;
  if (image && typeof image !== "string" && image.size > 5 * 1024 * 1024) errors.image = "Choose an image no larger than 5 MB.";
  if (Object.keys(errors).length) return { errors };

  try {
    const path = signingUp ? "/api/auth/sign-up/email" : "/api/auth/sign-in/email";
    const credentials = { email: String(email).trim(), password };
    const body = signingUp ? { ...credentials, name: String(name).trim(), role } : credentials;
    let response: Response;
    if (image && typeof image !== "string" && image.size) {
      const profile = new FormData();
      for (const [key, value] of Object.entries(body)) profile.set(key, String(value));
      profile.set("image", new Blob([await image.arrayBuffer()], { type: image.type }), image.name);
      response = await fetchBackend("/api/profile/sign-up", {
        method: "POST", headers: { origin: new URL(process.env.API_BASE_URL!).origin },
        body: profile, cache: "no-store", redirect: "error",
      });
    } else {
      response = await postBackendAuth(path, { body });
    }

    if (response.status === 401) return { message: "Email or password is incorrect." };
    if (response.status === 429) return { message: "Too many attempts. Please try again later." };
    if (!response.ok) {
      const { code, errors, message } = await response.json().catch(() => ({}));
      if (errors?.image?.[0]) return { errors: { image: errors.image[0] } };
      if (signingUp && code === "USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL") {
        return { errors: { email: "An account already uses this email address." } };
      }
      return { message: image && typeof message === "string" && response.status < 500 ? message : "Authentication is currently unavailable. Please try again." };
    }

    const sessionCookies = response.headers.getSetCookie().map((header) => parseString(header)).filter((cookie) => cookie !== null);
    if (!sessionCookies.length) return { message: "Authentication did not start a session. Please try again." };

    const cookieStore = await cookies();
    for (const { name, value, httpOnly, secure, sameSite, path, expires, maxAge } of sessionCookies) {
      const policy = sameSite?.toLowerCase();
      cookieStore.set(name, value, {
        httpOnly, secure, path, expires, maxAge,
        sameSite: policy === "strict" || policy === "lax" || policy === "none" ? policy : undefined,
      });
    }
  } catch {
    return { message: "Authentication is currently unavailable. Please try again." };
  }

  return { returnTo: safeServiceReturn(form.get("returnTo")) ?? "/dashboard" };
}

export async function signIn(_state: AuthState, form: FormData): Promise<AuthState> {
  return authenticate(form, false);
}

export async function signUp(_state: AuthState, form: FormData): Promise<AuthState> {
  return authenticate(form, true);
}
