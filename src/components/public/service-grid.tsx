import { ImageIcon, MapPin } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Listing } from "@/lib/public-catalog";

const price = new Intl.NumberFormat("en-BD", { style: "currency", currency: "BDT", currencyDisplay: "code" });

export function ServiceGrid({ listings }: { listings: Listing[] }) {
  return (
    <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {listings.map((service) => (
        <li key={service.id} className="min-w-0">
          <article className="flex h-full flex-col overflow-hidden border border-stationery-line bg-stationery-paper">
            <div className="grid aspect-[4/3] place-items-center overflow-hidden bg-stationery-blush/60 text-stationery-rose">
              {service.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element -- Service photos are hosted by ImgBB.
                <img src={service.imageUrl} alt="" loading="lazy" className="size-full object-cover" />
              ) : <ImageIcon size={28} aria-label="No service photo" />}
            </div>
            <div className="flex flex-1 flex-col gap-3 p-5">
              <p className="text-xs font-semibold tracking-[.15em] text-stationery-rose uppercase">{service.category}</p>
              <h3 className="break-words font-stationery text-[1.65rem] leading-tight">{service.title}</h3>
              <div className="grid gap-1.5 text-sm text-muted-foreground">
                <p className="break-words">By {service.vendor.businessName || service.vendor.name}</p>
                {service.vendor.premium && <span className="w-fit rounded-full bg-stationery-blush px-2 py-0.5 text-xs font-semibold text-stationery-plum">Premium Vendor</span>}
                <p className="flex items-start gap-1.5"><MapPin size={15} className="mt-0.5 shrink-0" aria-hidden="true" />{service.location || "Location not listed"}</p>
              </div>
              <div className="mt-auto flex flex-wrap items-center justify-between gap-3 border-t border-stationery-line/60 pt-3">
                <p className="text-sm font-semibold">{price.format(service.priceMinor / 100)}</p>
                <Link href={`/services/${service.id}`} prefetch={false} aria-label={`View Details for ${service.title}`}
                  className={cn(buttonVariants({ variant: "outline" }), "h-9 px-3")}>View Details</Link>
              </div>
            </div>
          </article>
        </li>
      ))}
    </ul>
  );
}

export function CatalogLoading() {
  return (
    <div role="status">
      <p className="mb-4 text-sm text-muted-foreground">Loading services…</p>
      <div aria-hidden="true" className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {[0, 1, 2].map((index) => <div key={index} className="aspect-[4/3] border border-stationery-line bg-stationery-blush/40 motion-safe:animate-pulse" />)}
      </div>
    </div>
  );
}
