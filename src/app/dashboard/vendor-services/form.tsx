"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ImagePlus } from "lucide-react";
import { toast } from "sonner";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { canonicalCategory, categories } from "@/components/public/categories";
import { cn } from "@/lib/utils";
import { saveVendorService } from "./actions";
import type { ServiceErrors, VendorService } from "./model";

const fields = [
  { name: "title", label: "Service name", max: 100, min: 3, placeholder: "e.g. Full-day wedding photography" },
  { name: "location", label: "City or service area", max: 100, min: 2, placeholder: "e.g. Dhaka" },
  { name: "price", label: "Starting price (BDT)", max: 11, min: 1, placeholder: "e.g. 25000" },
] as const;

export function ServiceForm({ service }: { service?: VendorService }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [errors, setErrors] = useState<ServiceErrors>({});
  const [message, setMessage] = useState("");
  const [previews, setPreviews] = useState<string[]>([]);
  const imageInput = useRef<HTMLInputElement>(null);

  useEffect(() => () => previews.forEach((preview) => URL.revokeObjectURL(preview)), [previews]);

  function clearImage() {
    if (imageInput.current) imageInput.current.value = "";
    setPreviews([]);
    setErrors(({ image: _image, ...remaining }) => remaining);
  }

  const savedImages = service?.imageUrls?.length ? service.imageUrls : service?.imageUrl ? [service.imageUrl] : [];
  const shownImages = previews.length ? previews : savedImages;

  function fieldError(name: keyof ServiceErrors) {
    const error = errors[name]?.[0];
    return error && <p id={`${name}-error`} className="mt-1 text-sm text-destructive">{error}</p>;
  }

  return (
    <form method="post" className="grid gap-6" aria-busy={pending} onSubmit={(event) => {
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
          <div>
            <label htmlFor="category" className="mb-1.5 block text-sm font-semibold">Category</label>
            <select id="category" name="category" required defaultValue={canonicalCategory(service?.category)}
              aria-invalid={Boolean(errors.category)} aria-describedby={errors.category ? "category-error" : undefined}
              className="h-11 w-full rounded-md border border-input bg-stationery-paper px-3 text-sm focus-visible:ring-2 focus-visible:ring-ring">
              <option value="">Choose a category</option>
              {categories.map(({ name }) => <option key={name}>{name}</option>)}
            </select>
            {fieldError("category")}
          </div>
        </div>
        <div>
          <label htmlFor="description" className="mb-1.5 block text-sm font-semibold">Description</label>
          <textarea id="description" name="description" rows={5} minLength={10} maxLength={2000} required
            defaultValue={service?.description} placeholder="Describe what’s included in your service."
            aria-invalid={Boolean(errors.description)} aria-describedby={errors.description ? "description-error" : undefined}
            className="w-full rounded-md border border-input bg-stationery-paper px-3 py-2 outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/40 aria-invalid:border-destructive" />
          {fieldError("description")}
        </div>
        <div className="grid gap-4 border-t border-stationery-line/65 pt-5">
          <div className="flex flex-wrap gap-3">
            {shownImages.length ? shownImages.map((photo, index) => (
              // eslint-disable-next-line @next/next/no-img-element -- Includes local blob previews.
              <img key={photo + index} src={photo} alt={`Service photo ${index + 1}`} className="aspect-square w-20 rounded-md border border-stationery-line object-cover sm:w-24" />
            )) : <div className="grid size-20 place-items-center rounded-md border border-stationery-line bg-stationery-ivory text-stationery-rose"><ImagePlus aria-hidden="true" size={26} /></div>}
          </div>
          <div className="min-w-0">
            <label htmlFor="image" className="mb-1 block text-sm font-semibold">{savedImages.length ? "Replace service photos" : "Service photos"}</label>
            <p id="image-hint" className="mb-2 text-sm text-muted-foreground">Upload 1–4 JPEG, PNG, or WebP photos, up to 5 MB total. The first photo is used on the service card.</p>
            <Input id="image" name="image" ref={imageInput} type="file" accept="image/jpeg,image/png,image/webp"
              multiple required={!savedImages.length} aria-invalid={Boolean(errors.image)} aria-describedby={errors.image ? "image-hint image-error" : "image-hint"}
              onChange={(event) => {
                setPreviews(Array.from(event.currentTarget.files ?? []).slice(0, 4).filter((chosen) => chosen.type.startsWith("image/")).map((chosen) => URL.createObjectURL(chosen)));
                setErrors(({ image: _image, ...remaining }) => remaining);
              }} />
            {fieldError("image")}
            {previews.length > 0 && <Button type="button" variant="ghost" className="mt-2" onClick={clearImage}>Clear selected photos</Button>}
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
