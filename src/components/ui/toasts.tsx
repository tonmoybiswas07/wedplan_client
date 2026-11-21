"use client";

import { usePathname } from "next/navigation";
import { Suspense, useEffect } from "react";
import { Toaster, toast } from "sonner";

function AuthFeedback() {
  const pathname = usePathname();
  useEffect(() => {
    if (pathname === "/dashboard" || pathname === "/sign-in" || pathname === "/sign-up") return;
    const timer = window.setTimeout(() => {
      try {
        const result = sessionStorage.getItem("wedplan-auth-feedback");
        sessionStorage.removeItem("wedplan-auth-feedback");
        if (result === "sign-in") toast.success("Signed in.");
        if (result === "sign-up") toast.success("Your account is ready.");
      } catch {
        // Authentication still works when browser storage is unavailable.
      }
    }, 250);
    return () => window.clearTimeout(timer);
  }, [pathname]);

  return null;
}

export function WedPlanToasts() {
  return (<>
    <Suspense fallback={null}><AuthFeedback /></Suspense>
    <Toaster
      position="bottom-center"
      toastOptions={{
        classNames: {
          toast:
            "!border-line !bg-paper !text-ink",
        },
      }}
    />
  </>);
}
