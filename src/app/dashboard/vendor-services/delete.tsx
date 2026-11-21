"use client";

import { useRef, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { deleteVendorService } from "./actions";

export function DeleteService({ id, title }: { id: string; title: string }) {
  const router = useRouter();
  const dialog = useRef<HTMLDialogElement>(null);
  const [pending, startTransition] = useTransition();

  return (
    <>
      <Button
        type="button"
        variant="ghost"
        aria-label={`Delete ${title}`}
        disabled={pending}
        className="h-9 px-3 text-destructive"
        onClick={() => dialog.current?.showModal()}
      >
        Delete
      </Button>
      <dialog
        ref={dialog}
        aria-labelledby={`delete-${id}`}
        onCancel={(event) => {
          if (pending) event.preventDefault();
        }}
        className="fixed inset-0 m-auto w-[min(90vw,26rem)] rounded-lg border border-stationery-line bg-stationery-paper p-6 text-stationery-plum backdrop:bg-stationery-plum/60"
      >
        <h2 id={`delete-${id}`} className="mb-2 font-stationery text-2xl">
          Delete service?
        </h2>
        <p className="mb-5 break-words text-sm">
          “{title}” will be removed from My Services.
        </p>
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
            variant="destructive"
            disabled={pending}
            onClick={() => {
              startTransition(async () => {
                try {
                  const result = await deleteVendorService(id);
                  if (!result.ok) {
                    dialog.current?.close();
                    toast.error(result.message);
                    return;
                  }
                  dialog.current?.close();
                  toast.success("Service deleted.");
                  router.refresh();
                } catch {
                  dialog.current?.close();
                  toast.error("The service could not be deleted. Try again.");
                }
              });
            }}
          >
            {pending ? "Deleting…" : "Delete service"}
          </Button>
        </div>
      </dialog>
    </>
  );
}
