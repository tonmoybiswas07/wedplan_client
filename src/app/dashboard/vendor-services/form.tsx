"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ImagePlus } from "lucide-react";
import { toast } from "sonner";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { saveVendorService } from "./actions";
import type { ServiceErrors, VendorService } from "./model";

const fields = [
  { name: "title", label: "Service name", max: 100, min: 3, placeholder: "e.g. Full-day wedding photography" },
  { name: "category", label: "Category", max: 60, min: 2, placeholder: "e.g. Photography" },
  { name: "price", label: "Starting price (BDT)", max: 11, min: 1, placeholder: "e.g. 25000" },
] as const;

export function ServiceForm({ service }: { service?: VendorService }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [errors, setErrors] = useState<ServiceErrors>({});
  const [message, setMessage] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const imageInput = useRef<HTMLInputElement>(null);

  useEffect(() => () => { if (preview) URL.revokeObjectURL(preview); }, [preview]);

  function clearImage() {
    if (imageInput.current) imageInput.current.value = "";
    setImage(null);
    setPreview(null);
    setErrors(({ image: _image, ...remaining }) => remaining);
  }

  const shownImage = image ? preview : service?.imageUrl;

  function fieldError(name: keyof ServiceErrors) {
    const error = errors[name]?.[0];
    return error && <p id={`${name}-error`} className="mt-1 text-sm text-destructive">{error}</p>;
  }

  return (
    <form className="grid gap-6" aria-busy={pending} onSubmit={(event) => {
      event.preventDefault();
      const form = new FormData(event.currentTarget);
      setErrors({});
      setMessage("");
      startTransition(async () => {
        try {
          const result = await saveVendorService(service?.id, form);
          if (!result.ok) {
            setErrors(result.errors ?? {});
            setMessage(result.message);
            toast.error(result.message);
            return;
          }
          toast.success(service ? "Changes saved for review." : "Service submitted for review.");
          router.push("/dashboard/vendor/my-services");
        } catch {
          setMessage("The service could not be saved. Try again.");
          toast.error("The service could not be saved.");
        }
      });
    }}>
      <fieldset disabled={pending} className="grid gap-5 disabled:opacity-70">
        <div className="grid items-start gap-5 sm:grid-cols-2">
          {fields.map(({ name, label, max, min, placeholder }) => (
            <div key={name} className={name === "title" ? "sm:col-span-2" : undefined}>
              <label htmlFor={name} className="mb-1.5 block text-sm font-semibold">{label}</label>
              <Input id={name} name={name} placeholder={placeholder} maxLength={max} minLength={min} required
                inputMode={name === "price" ? "decimal" : undefined}
                defaultValue={name === "price" ? (service ? (service.priceMinor / 100).toFixed(2) : "") : service?.[name]}
                aria-invalid={Boolean(errors[name])} aria-describedby={errors[name] ? `${name}-error` : undefined}
                className="min-h-11 bg-stationery-paper" />
              {fieldError(name)}
            </div>
          ))}
        </div>
        <div>
          <label htmlFor="description" className="mb-1.5 block text-sm font-semibold">Description</label>
          <textarea id="description" name="description" rows={5} minLength={10} maxLength={2000} required
            defaultValue={service?.description} placeholder="Describe what’s included in your service."
            aria-invalid={Boolean(errors.description)} aria-describedby={errors.description ? "description-error" : undefined}
            className="w-full rounded-md border border-input bg-stationery-paper px-3 py-2 outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/40 aria-invalid:border-destructive" />
          {fieldError("description")}
        </div>
        <div className="grid gap-4 border-t border-stationery-line/65 pt-5 sm:grid-cols-[9rem_1fr] sm:items-center">
          <div className="grid aspect-4/3 w-36 place-items-center overflow-hidden rounded-md border border-stationery-line bg-stationery-ivory text-stationery-rose">
            {shownImage ? (
              // eslint-disable-next-line @next/next/no-img-element -- Includes local blob previews.
              <img src={shownImage} alt="Service photo preview" className="size-full object-cover" />
            ) : <ImagePlus aria-hidden="true" size={26} />}
          </div>
          <div className="min-w-0">
            <label htmlFor="image" className="mb-1 block text-sm font-semibold">Service photo <span className="font-normal text-muted-foreground">(optional)</span></label>
            <p id="image-hint" className="mb-2 text-sm text-muted-foreground">JPEG, PNG, or WebP, up to 5 MB.</p>
            <Input id="image" name="image" ref={imageInput} type="file" accept="image/jpeg,image/png,image/webp"
              aria-invalid={Boolean(errors.image)} aria-describedby={errors.image ? "image-hint image-error" : "image-hint"}
              onChange={(event) => {
                const selected = event.currentTarget.files?.[0] ?? null;
                setPreview(selected && selected.type.startsWith("image/") ? URL.createObjectURL(selected) : null);
                setImage(selected);
                setErrors(({ image: _image, ...remaining }) => remaining);
              }} />
            {fieldError("image")}
            {image && <Button type="button" variant="ghost" className="mt-2" onClick={clearImage}>Clear selected photo</Button>}
          </div>
        </div>
      </fieldset>
      <div className="border-t border-stationery-line/65 pt-5">
        <p className="mb-4 text-sm text-muted-foreground">Listings stay inactive until approved. Edits send the listing back for review.</p>
        {message && <p role="alert" className="mb-4 text-sm font-medium text-destructive">{message}</p>}
        <div className="flex flex-wrap gap-3">
          <Button type="submit" disabled={pending} className="h-11 px-4">
            {pending ? "Saving…" : service ? "Save changes" : "Submit for review"}
          </Button>
          <Link href="/dashboard/vendor/my-services" className={cn(buttonVariants({ variant: "outline" }), "h-11 px-4")}>Cancel</Link>
        </div>
      </div>
    </form>
  );
}
