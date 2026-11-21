import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, Sparkles, ArrowRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Payment Successful | WedPlan",
};

export default function PaymentSuccessPage() {
  return (
    <main className="mx-auto flex min-h-[70svh] max-w-xl flex-col items-center justify-center px-4 py-16 text-center">
      <div className="rounded-3xl border border-border/80 bg-card p-8 sm:p-12 shadow-sm">
        <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 mb-6">
          <CheckCircle2 size={36} />
        </div>
        <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary mb-3">
          <Sparkles size={13} /> Stripe Payment Confirmed
        </div>
        <h1 className="font-display text-3xl font-extrabold text-foreground sm:text-4xl">
          Upgrade Successful!
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Thank you for subscribing to WedPlan Premium. Your payment transaction has been processed securely via Stripe. Your vendor account now enjoys unlimited service publishing privileges and premium badge visibility.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row justify-center gap-3">
          <Link
            href="/dashboard/vendor/subscription"
            className={cn(buttonVariants(), "rounded-full px-6 font-semibold shadow-sm")}
          >
            View Subscription Details <ArrowRight size={15} className="ml-1" />
          </Link>
          <Link
            href="/dashboard/vendor/add-service"
            className={cn(buttonVariants({ variant: "outline" }), "rounded-full px-6 font-semibold")}
          >
            Add New Service
          </Link>
        </div>
      </div>
    </main>
  );
}
