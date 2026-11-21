"use server";

export type AuthState = {
  errors?: Partial<Record<"name" | "email" | "password" | "role", string>>;
  message?: string;
};

function validateSubmission(form: FormData, signingUp: boolean): AuthState {
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
  }
  if (signingUp && role !== "customer" && role !== "vendor") {
    errors.role = "Choose an account type.";
  }

  if (Object.keys(errors).length) return { errors };

  return { message: "Authentication is currently unavailable." };
}

export async function signIn(_state: AuthState, form: FormData): Promise<AuthState> {
  return validateSubmission(form, false);
}

export async function signUp(_state: AuthState, form: FormData): Promise<AuthState> {
  return validateSubmission(form, true);
}
