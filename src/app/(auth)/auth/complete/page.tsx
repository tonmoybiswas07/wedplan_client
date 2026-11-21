import { SunflowerLoader } from "@/components/ui/sunflower-loader";
import { Suspense } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { fetchCookieAuth } from "@/lib/auth-proxy";
import { safeServiceReturn } from "@/lib/service-return";
import { RoleForm } from "./role-form";

type Search = Promise<{ returnTo?: string | string[] }>;

async function Complete({ search }: { search: Search }) {
  const returnTo = safeServiceReturn((await search).returnTo);
  const response = await fetchCookieAuth("/api/auth/google/onboarding").catch(() => null);
  if (response?.status === 401) redirect(returnTo ? `/sign-in?${new URLSearchParams({ returnTo })}` : "/sign-in");
  if (!response?.ok) return <div className="invitation-intro">
    <h1 id="auth-heading">Account setup unavailable</h1>
    <p>Go back to <Link href="/sign-in" className="underline">sign in</Link> and try again.</p>
  </div>;

  const { needsRole } = await response.json();
  if (!needsRole) redirect(returnTo ?? "/dashboard");
  return <>
    <div className="invitation-intro">
      <h1 id="auth-heading">Choose your account type</h1>
      <p>Choose Customer to plan a wedding or Vendor to offer wedding services.</p>
    </div>
    <RoleForm returnTo={returnTo} />
  </>;
}

export default function CompletePage({ searchParams }: { searchParams: Search }) {
  return <Suspense fallback={<SunflowerLoader label="Checking your account…" />}><Complete search={searchParams} /></Suspense>;
}
