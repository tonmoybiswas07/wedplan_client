"use server";

import { cookies } from "next/headers";
import { parseString } from "set-cookie-parser";
import { safeServiceReturn } from "@/lib/service-return";
import { postBackendAuth } from "@/lib/api";

export type AuthState = {
  errors?: Partial<Record<"name" | "email" | "password" | "role", string>>;
  message?: string;
  returnTo?: string;
};

async function authenticate(form: FormData, signingUp: boolean): Promise<AuthState> {
  const name = form.get("name");
  const email = form.get("email");
  const password = form.get("password");
  const role = form.get("role");
  const errors: NonNullable<AuthState["errors"]> = {};

  if (signingUp && (typeof name !== "string" || !name.trim())) {
    errors.name = "Enter your name.";
  }
  if (typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    errors.email = "Enter a valid email address.";
  }
  if (typeof password !== "string" || !password) {
    errors.password = "Enter your password.";
  } else if (signingUp && password.length < 8) {
    errors.password = "Use at least 8 characters.";
  } else if (password.length > 128) {
    errors.password = "Use 128 characters or fewer.";
  }
  if (signingUp && role !== "customer" && role !== "vendor") {
    errors.role = "Choose an account type.";
  }

  if (Object.keys(errors).length) return { errors };

  try {
    const path = signingUp ? "/api/auth/sign-up/email" : "/api/auth/sign-in/email";
    const credentials = { email: String(email).trim(), password };
    const body = signingUp ? { ...credentials, name: String(name).trim(), role } : credentials;
    const response = await postBackendAuth(path, { body });

    if (response.status === 401) return { message: "Email or password is incorrect." };
    if (response.status === 429) return { message: "Too many attempts. Please try again later." };
    if (!response.ok) {
      const { code } = await response.json().catch(() => ({}));
      if (signingUp && code === "USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL") {
        return { errors: { email: "An account already uses this email address." } };
      }
      return { message: "Authentication is currently unavailable. Please try again." };
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
