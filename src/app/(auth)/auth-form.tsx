"use client";

import { toast } from "sonner";
import { useActionState, useEffect, useState } from "react";
import Link from "next/link";
import { HeartHandshake, Store } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { signIn, signUp, type AuthState } from "./actions";

const fields = [
  { name: "name", label: "Full name", type: "text", autoComplete: "name" },
  {
    name: "email",
    label: "Email address",
    type: "email",
    autoComplete: "email",
  },
  {
    name: "password",
    label: "Password",
    type: "password",
    autoComplete: "current-password",
  },
] as const;

const roles = [
  {
    value: "customer",
    label: "Customer",
    detail: "I’m planning a wedding",
    Icon: HeartHandshake,
  },
  {
    value: "vendor",
    label: "Vendor",
    detail: "I offer wedding services",
    Icon: Store,
  },
] as const;

const initialState: AuthState = {};

export function AuthForm({ mode, returnTo, googleError }: { mode: "sign-in" | "sign-up"; returnTo?: string; googleError?: string }) {
  const signingUp = mode === "sign-up";
  const [state, action, pending] = useActionState(
    signingUp ? signUp : signIn,
    initialState,
  );
  useEffect(() => {
    if (state.returnTo) {
      try {
        sessionStorage.setItem("wedplan-auth-feedback", mode);
      } catch {
        // Continue signing in when storage is unavailable.
      }
      window.location.replace(state.returnTo);
    } else if (state.message || state.errors) {
      toast.error(state.message ?? "Check the highlighted fields.");
    }
  }, [mode, state]);
  const [values, setValues] = useState({ name: "", email: "", password: "" });
  const [role, setRole] = useState("");
  const [preview, setPreview] = useState<string>();
  useEffect(() => () => { if (preview) URL.revokeObjectURL(preview); }, [preview]);

  return (
    <>
      <div className="invitation-intro">
        <h1 id="auth-heading">
          {signingUp ? "Create your account" : "Welcome back"}
        </h1>
        <p>
          {signingUp
            ? "Plan your wedding or offer your services on WedPlan."
            : "Sign in to pick up where you left off."}
        </p>
      </div>

      <form
        action={action}
        noValidate
        className="invitation-form"
        aria-busy={pending}
      >
        {returnTo && <input type="hidden" name="returnTo" value={returnTo} />}
        <fieldset disabled={pending} className="invitation-fields">
          {fields
            .filter((field) => signingUp || field.name !== "name")
            .map((field) => {
              const error = state.errors?.[field.name];
              const descriptionId = error
                ? field.name + "-error"
                : signingUp && field.name === "password"
                  ? "password-hint"
                  : undefined;

              return (
                <div className="invitation-field" key={field.name}>
                  <label htmlFor={field.name}>{field.label}</label>
                  <Input
                    id={field.name}
                    name={field.name}
                    type={field.type}
                    autoComplete={
                      signingUp && field.name === "password"
                        ? "new-password"
                        : field.autoComplete
                    }
                    value={values[field.name]}
                    onChange={(event) => {
                      const value = event.currentTarget.value;
                      setValues((previous) => ({
                        ...previous,
                        [field.name]: value,
                      }));
                    }}
                    required
                    aria-invalid={Boolean(error)}
                    aria-describedby={descriptionId}
                  />
                  {error && (
                    <p className="invitation-error" id={descriptionId}>
                      {error}
                    </p>
                  )}
                  {!error && descriptionId && (
                    <p className="invitation-hint" id={descriptionId}>
                      At least 6 characters with an uppercase and a lowercase letter.
                    </p>
                  )}
                </div>
              );
            })}

          {signingUp && (
            <fieldset className="invitation-roles">
              <legend>Account type</legend>
              <div className="invitation-role-grid">
                {roles.map(({ value, label, detail, Icon }) => (
                  <label key={value} className="invitation-role">
                    <input
                      type="radio"
                      name="role"
                      value={value}
                      checked={role === value}
                      onChange={() => setRole(value)}
                      required
                      aria-invalid={Boolean(state.errors?.role)}
                      aria-describedby={
                        state.errors?.role
                          ? value + "-detail role-error"
                          : value + "-detail"
                      }
                    />
                    <Icon size={18} aria-hidden="true" />
                    <span>
                      <strong>{label}</strong>
                      <small id={value + "-detail"}>{detail}</small>
                    </span>
                  </label>
                ))}
              </div>
              {state.errors?.role && (
                <p id="role-error" className="invitation-error">
                  {state.errors.role}
                </p>
              )}
            </fieldset>
          )}
          {signingUp && <div className="invitation-field">
            <label htmlFor="signup-image">Profile photo (optional)</label>
            <Input id="signup-image" name="image" type="file" accept="image/jpeg,image/png,image/webp"
              aria-describedby={state.errors?.image ? "signup-image-error" : "signup-image-hint"}
              aria-invalid={Boolean(state.errors?.image)}
              onChange={(event) => {
                const photo = event.currentTarget.files?.[0];
                setPreview(photo?.type.startsWith("image/") ? URL.createObjectURL(photo) : undefined);
              }} />
            {preview && (
              // eslint-disable-next-line @next/next/no-img-element -- Local photo preview.
              <img src={preview} alt="Profile photo preview" className="size-14 rounded-full border border-line object-cover" />
            )}
            <p id="signup-image-hint" className="invitation-hint">JPEG, PNG, or WebP, up to 5 MB.</p>
            {state.errors?.image && <p id="signup-image-error" className="invitation-error">{state.errors.image}</p>}
          </div>}
        </fieldset>

        <Button type="submit" className="invitation-submit" disabled={pending}>
          {pending
            ? signingUp
              ? "Creating account…"
              : "Signing in…"
            : signingUp
              ? "Create account"
              : "Sign in"}
        </Button>
      </form>

      <div role="status" className="invitation-status">
        {state.message && <p className="invitation-error">{state.message}</p>}
        {!state.message && state.errors && (
          <span className="sr-only">Check the highlighted fields.</span>
        )}
      </div>

      <form action="/api/auth/google" method="post" className="mt-5">
        <input type="hidden" name="mode" value={mode} />
        {returnTo && <input type="hidden" name="returnTo" value={returnTo} />}
        <Button type="submit" variant="outline" className="h-11 w-full border-line bg-paper">Continue with Google</Button>
        {googleError && <p role="alert" className="invitation-error mt-2">{googleError}</p>}
      </form>

      <p className="invitation-switch">
        {signingUp ? "Already have an account?" : "New to WedPlan?"}{" "}
        <Link href={{ pathname: signingUp ? "/sign-in" : "/sign-up", query: returnTo ? { returnTo } : undefined }}>
          {signingUp ? "Sign in" : "Create an account"}
        </Link>
      </p>
    </>
  );
}
