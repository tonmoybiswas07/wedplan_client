"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { CircleUserRound } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { saveProfile, type ProfileState } from "./actions";

export function ProfileForm({ role, name, email, image, businessName }: {
  role: "customer" | "vendor"; name: string; email: string; image?: string; businessName?: string;
}) {
  const router = useRouter();
  const [preview, setPreview] = useState<string>();
  const [state, setState] = useState<ProfileState>();
  const [pending, startTransition] = useTransition();
  const file = useRef<HTMLInputElement>(null);
  useEffect(() => () => { if (preview) URL.revokeObjectURL(preview); }, [preview]);

  const errors = state?.ok === false ? state.errors : undefined;
  function error(field: "name" | "businessName" | "image") {
    return errors?.[field]?.[0] && <p id={`profile-${field}-error`} className="mt-1 text-sm text-destructive">{errors[field][0]}</p>;
  }

  return (
    <form method="post" aria-busy={pending} className="grid gap-5" onSubmit={(event) => {
      event.preventDefault();
      const form = new FormData(event.currentTarget);
      setState(undefined);
      startTransition(async () => {
        try {
          const result = await saveProfile(role, form);
          setState(result);
          if (!result.ok) {
            toast.error(result.message);
            return;
          }
          if (file.current) file.current.value = "";
          setPreview(undefined);
          toast.success("Profile saved.");
          router.refresh();
        } catch {
          setState({ ok: false, message: "Your profile could not be saved. Try again." });
          toast.error("Your profile could not be saved.");
        }
      });
    }}>
      <fieldset disabled={pending} className="grid gap-5 disabled:opacity-70">
        <div className="flex flex-wrap items-center gap-4 border-b border-stationery-line/65 pb-5">
          <div className="grid size-20 shrink-0 place-items-center overflow-hidden rounded-full border border-stationery-line bg-stationery-blush text-stationery-rose">
            {preview || image ? (
              // eslint-disable-next-line @next/next/no-img-element -- Supports local file previews and hosted profile photos.
              <img src={preview ?? image} alt="Profile photo" className="size-full object-cover" referrerPolicy="no-referrer" />
            ) : <CircleUserRound size={32} aria-hidden="true" />}
          </div>
          <div className="min-w-0 flex-1 basis-48">
            <label htmlFor="profile-image" className="mb-1 block text-sm font-semibold">Profile photo</label>
            <Input ref={file} id="profile-image" name="image" type="file" accept="image/jpeg,image/png,image/webp"
              aria-describedby={errors?.image ? "profile-image-hint profile-image-error" : "profile-image-hint"} aria-invalid={Boolean(errors?.image)}
              onChange={(event) => {
                const chosen = event.currentTarget.files?.[0];
                setPreview(chosen?.type.startsWith("image/") ? URL.createObjectURL(chosen) : undefined);
              }} />
            <p id="profile-image-hint" className="mt-1 text-sm text-muted-foreground">JPEG, PNG, or WebP, up to 5 MB.</p>
            {error("image")}
          </div>
        </div>
        <div>
          <label htmlFor="profile-name" className="mb-1 block text-sm font-semibold">Name</label>
          <Input id="profile-name" name="name" autoComplete="name" defaultValue={name} minLength={2} maxLength={100} required className="h-11"
            aria-invalid={Boolean(errors?.name)} aria-describedby={errors?.name ? "profile-name-error" : undefined} />
          {error("name")}
        </div>
        <div>
          <label htmlFor="profile-email" className="mb-1 block text-sm font-semibold">Email</label>
          <Input id="profile-email" value={email} readOnly className="h-11 bg-stationery-ivory" />
        </div>
        {role === "vendor" && <div>
          <label htmlFor="profile-business" className="mb-1 block text-sm font-semibold">Business name</label>
          <Input id="profile-business" name="businessName" autoComplete="organization" defaultValue={businessName ?? ""} maxLength={120} className="h-11"
            aria-invalid={Boolean(errors?.businessName)} aria-describedby={errors?.businessName ? "profile-businessName-error" : undefined} />
          {error("businessName")}
        </div>}
      </fieldset>
      {state?.ok === false && <p role="alert" className="text-sm text-destructive">{state.message}</p>}
      <Button type="submit" disabled={pending} className="h-11 w-fit px-5">{pending ? "Saving…" : "Save profile"}</Button>
    </form>
  );
}
