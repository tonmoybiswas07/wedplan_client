import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { buttonVariants } from "@/components/ui/button";
import { getDashboardAccess } from "@/lib/dashboard-session";
import { safeServiceReturn } from "@/lib/service-return";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Service details | WedPlan" };

type Params = Promise<{ id: string }>;

async function ServicePreview({ params }: { params: Params }) {
  const path = safeServiceReturn(`/services/${(await params).id}`);
  if (!path) notFound();

  const access = await getDashboardAccess();
  if (access.status === "guest") redirect(`/sign-in?${new URLSearchParams({ returnTo: path })}`);

  const heading = access.status === "allowed" ? "Service details are coming soon"
    : access.status === "denied" ? "Access denied" : "Couldn’t verify your session";
  return (
    <main className="mx-auto min-h-[65svh] max-w-3xl px-4 py-16 sm:px-8">
      <div className="border border-stationery-line bg-stationery-paper p-6 sm:p-10">
        <h1 className="font-stationery text-4xl">{heading}</h1>
        {access.status === "allowed" && <p className="mt-3 text-muted-foreground">You can keep exploring services while we prepare full listings and booking.</p>}
        <Link href="/services" className={cn(buttonVariants(), "mt-6 h-11 px-4")}>Back to Browse Services</Link>
      </div>
    </main>
  );
}

export default function ServicePage({ params }: { params: Params }) {
  return <Suspense fallback={<p role="status" className="p-8">Loading service…</p>}><ServicePreview params={params} /></Suspense>;
}
