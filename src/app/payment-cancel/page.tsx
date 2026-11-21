import type { Metadata } from "next";
import Link from "next/link";
import { AlertCircle, ArrowLeft } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Payment Cancelled | WedPlan",
};

export default function PaymentCancelPage() {
  return (
    <main className="mx-auto flex min-h-[70svh] max-w-xl flex-col items-center justify-center px-4 py-16 text-center">
      <div className="rounded-3xl border border-border/80 bg-card p-8 sm:p-12 shadow-sm">
        <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 mb-6">
          <AlertCircle size={36} />
        </div>
        <h1 className="font-display text-3xl font-extrabold text-foreground sm:text-4xl">
          Payment Cancelled
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          The Stripe checkout session was cancelled or closed before completion. No charges were made to your account. You can upgrade whenever you are ready to publish more services.
        </p>

        <div className="mt-8 flex justify-center">
          <Link
            href="/dashboard/vendor/subscription"
            className={cn(buttonVariants(), "rounded-full px-6 font-semibold shadow-sm")}
          >
            <ArrowLeft size={15} className="mr-1.5" /> Return to Subscription Plans
          </Link>
        </div>
      </div>
    </main>
  );
}
