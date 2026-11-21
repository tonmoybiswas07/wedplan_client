"use client";

import { useId, useRef, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export function ServiceConfirmation({
  label,
  title,
  description,
  success,
  destructive,
  mutate,
}: {
  label: string;
  title: string;
  description: string;
  success: string;
  destructive?: boolean;
  mutate: () => Promise<{ ok: true } | { ok: false; message: string }>;
}) {
  const heading = useId();
  const router = useRouter();
  const dialog = useRef<HTMLDialogElement>(null);
  const [pending, startTransition] = useTransition();

  return (
    <>
      <Button
        type="button"
        variant={destructive ? "ghost" : "outline"}
        aria-label={`${label} ${title}`}
        className={destructive ? "h-9 px-3 text-destructive" : "h-9 px-3"}
        disabled={pending}
        onClick={() => dialog.current?.showModal()}
      >
        {label}
      </Button>
      <dialog
        ref={dialog}
        aria-labelledby={heading}
        onCancel={(event) => {
          if (pending) event.preventDefault();
        }}
        className="fixed inset-0 m-auto w-[min(90vw,26rem)] rounded-lg border border-stationery-line bg-stationery-paper p-6 text-stationery-plum backdrop:bg-stationery-plum/60"
      >
        <h2 id={heading} className="mb-2 font-stationery text-2xl">
          {label} service?
        </h2>
        <p className="mb-2 break-words text-sm font-semibold">{title}</p>
        <p className="mb-5 text-sm">{description}</p>
        <div className="flex flex-wrap justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            disabled={pending}
            onClick={() => dialog.current?.close()}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant={destructive ? "destructive" : "default"}
            disabled={pending}
            onClick={() => {
              startTransition(async () => {
                try {
                  const result = await mutate();
                  dialog.current?.close();
                  if (result.ok) {
                    toast.success(success);
                    router.refresh();
                  } else {
                    toast.error(result.message);
                  }
                } catch {
                  dialog.current?.close();
                  toast.error("The service could not be updated. Try again.");
                }
              });
            }}
          >
            {pending ? "Working…" : `${label} service`}
          </Button>
        </div>
      </dialog>
    </>
  );
}
