import type { Metadata } from "next";
import { Suspense } from "react";
import { safeServiceReturn } from "@/lib/service-return";
import { AuthForm } from "../auth-form";

export const metadata: Metadata = { title: "Create an account | WedPlan" };

type Search = Promise<{ returnTo?: string | string[] }>;

async function FormWithReturn({ searchParams }: { searchParams: Search }) {
  return <AuthForm mode="sign-up" returnTo={safeServiceReturn((await searchParams).returnTo)} />;
}

export default function AuthPage({ searchParams }: { searchParams: Search }) {
  return <Suspense fallback={<p role="status">Loading…</p>}><FormWithReturn searchParams={searchParams} /></Suspense>;
}
