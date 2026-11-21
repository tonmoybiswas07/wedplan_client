import { ArrowUpRight, ImageIcon, MapPin } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Listing } from "@/lib/public-catalog";

const price = new Intl.NumberFormat("en-BD", { style: "currency", currency: "BDT", currencyDisplay: "code" });

export function ServiceGrid({ listings, compact = false }: { listings: Listing[]; compact?: boolean }) {
  return (
    <ul className={cn("grid gap-5 sm:grid-cols-2", compact ? "2xl:grid-cols-3" : "lg:grid-cols-3")}>
      {listings.map((service) => (
        <li key={service.id} className="min-w-0">
          <article className="group flex h-full flex-col overflow-hidden rounded-[1.4rem] border border-line bg-paper shadow-sm transition-shadow hover:shadow-md">
            <div className="grid aspect-[16/10] place-items-center overflow-hidden bg-blush/60 text-berry">
              {service.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element -- Service photos are hosted by ImgBB.
                <img src={service.imageUrl} alt="" loading="lazy" className="size-full object-cover motion-safe:transition-transform motion-safe:duration-300 motion-safe:group-hover:scale-105" />
              ) : <ImageIcon size={28} aria-label="No service photo" />}
            </div>
            <div className="flex flex-1 flex-col gap-3 p-5">
              <p className="text-xs font-bold tracking-wide text-berry uppercase">{service.category}</p>
              <h3 className="break-words font-display text-[1.65rem] leading-tight">{service.title}</h3>
              <div className="grid gap-1.5 text-sm text-muted-foreground">
                <p className="break-words">By {service.vendor.businessName || service.vendor.name}</p>
                {service.vendor.premium && <span className="w-fit rounded-full bg-blush px-2 py-0.5 text-xs font-semibold text-ink">Premium Vendor</span>}
                <p className="flex items-start gap-1.5"><MapPin size={15} className="mt-0.5 shrink-0" aria-hidden="true" />{service.location || "Location not listed"}</p>
              </div>
              <div className="mt-auto flex flex-wrap items-center justify-between gap-3 border-t border-line/60 pt-3">
                <p className="text-base font-extrabold tabular-nums">{price.format(service.priceMinor / 100)}</p>
                <Link href={`/services/${service.id}`} prefetch={false} aria-label={`View Details for ${service.title}`}
                  className={cn(buttonVariants({ variant: "secondary" }), "h-10 gap-1.5 px-3")}>View Details <ArrowUpRight size={14} aria-hidden="true" /></Link>
              </div>
            </div>
          </article>
        </li>
      ))}
    </ul>
  );
}
