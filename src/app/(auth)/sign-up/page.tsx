import type { Metadata } from "next";
import { Suspense } from "react";
import { safeServiceReturn } from "@/lib/service-return";
import { AuthForm } from "../auth-form";

export const metadata: Metadata = { title: "Create an account | WedPlan" };

type Search = Promise<{ returnTo?: string | string[]; google?: string | string[] }>;

async function FormWithReturn({ searchParams }: { searchParams: Search }) {
  const search = await searchParams;
  return <AuthForm mode="sign-up" returnTo={safeServiceReturn(search.returnTo)} googleError={search.google === "unavailable" ? "Google sign-in is not configured." : search.google === "failed" ? "Google sign-in did not complete. Try again." : undefined} />;
}

export default function AuthPage({ searchParams }: { searchParams: Search }) {
  return <Suspense fallback={<p role="status">Loading…</p>}><FormWithReturn searchParams={searchParams} /></Suspense>;
}
