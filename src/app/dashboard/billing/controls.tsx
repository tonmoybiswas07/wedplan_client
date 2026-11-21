"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { startCheckout } from "./actions";

export function UpgradeButton() {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState("");
  return (
    <>
      <Button type="button" className="h-11 w-full px-4" disabled={pending} onClick={() => {
        setError("");
        startTransition(async () => {
          try {
            const result = await startCheckout();
            if (result.ok) {
              window.location.assign(result.url);
              return;
            }
            setError(result.message);
            toast.error(result.message);
          } catch {
            setError("Checkout could not be started. Try again.");
            toast.error("Checkout could not be started.");
          }
        });
      }}>{pending ? "Opening Stripe Checkout…" : "Upgrade to Premium"}</Button>
      {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
    </>
  );
}

export function RefreshConfirmation({ auto }: { auto: boolean }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const attempts = useRef(0);

  useEffect(() => {
    if (!auto) return;
    const timer = window.setInterval(() => {
      if (attempts.current >= 12) {
        window.clearInterval(timer);
        return;
      }
      attempts.current += 1;
      router.refresh();
    }, 3000);
    return () => window.clearInterval(timer);
  }, [auto, router]);

  return <Button type="button" variant="outline" className="h-10 px-4" disabled={pending}
    onClick={() => startTransition(() => router.refresh())}>{pending ? "Checking…" : "Check payment status"}</Button>;
}
