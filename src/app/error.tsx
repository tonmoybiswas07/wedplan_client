"use client";

import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";

export default function RouteError({ reset }: { reset: () => void }) {
  return <main className="grid min-h-svh place-items-center bg-canvas px-4 text-ink">
    <section className="w-full max-w-xl rounded-xl border border-line bg-paper p-7 sm:p-10">
      <h1 className="font-display text-4xl">This page couldn’t load</h1>
      <p className="mt-3 text-muted-foreground">Try again, or return to the service catalogue.</p>
      <div className="mt-5 flex flex-wrap gap-3">
        <Button type="button" onClick={reset} className="h-10 px-4">Try again</Button>
        <Link href="/services" className={buttonVariants({ variant: "outline", className: "h-10 px-4" })}>Browse Services</Link>
      </div>
    </section>
  </main>;
}
