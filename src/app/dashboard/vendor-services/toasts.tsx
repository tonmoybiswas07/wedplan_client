"use client";

import { Toaster } from "sonner";

export function DashboardToasts() {
  return (
    <Toaster
      position="bottom-center"
      toastOptions={{
        classNames: {
          toast:
            "!border-stationery-line !bg-stationery-paper !text-stationery-plum",
        },
      }}
    />
  );
}
