import { ArrowUpRight, ImageIcon, MapPin, Sparkles, Star } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Listing } from "@/lib/public-catalog";

const price = new Intl.NumberFormat("en-BD", { style: "currency", currency: "BDT", maximumFractionDigits: 0 });

export function ServiceGrid({ listings, compact = false }: { listings: Listing[]; compact?: boolean }) {
  return (
    <ul className={cn("grid gap-6 sm:grid-cols-2", compact ? "2xl:grid-cols-3" : "lg:grid-cols-3")}>
      {listings.map((service) => (
        <li key={service.id} className="min-w-0">
          <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border/80 bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-xl">
            {/* Image Container */}
            <div className="relative aspect-[16/10] overflow-hidden bg-muted">
              {service.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element -- Hosted on ImgBB
                <img 
                  src={service.imageUrl} 
                  alt={service.title} 
                  loading="lazy" 
                  className="size-full object-cover transition-transform duration-700 ease-out group-hover:scale-105" 
                />
              ) : (
                <div className="flex size-full items-center justify-center bg-secondary/50 text-muted-foreground">
                  <ImageIcon size={32} aria-label="No service photo" />
                </div>
              )}
              
              {/* Category Pill Tag */}
              <div className="absolute top-3 start-3">
                <span className="inline-flex items-center gap-1 rounded-full bg-background/90 px-3 py-1 text-xs font-semibold tracking-wide text-foreground backdrop-blur-md shadow-sm">
                  {service.category}
                </span>
              </div>

              {/* Premium Badge if applicable */}
              {service.vendor.premium && (
                <div className="absolute top-3 end-3">
                  <span className="inline-flex items-center gap-1 rounded-full bg-primary/95 px-2.5 py-1 text-xs font-bold text-primary-foreground backdrop-blur-md shadow-sm">
                    <Sparkles size={11} className="fill-current" /> Premium
                  </span>
                </div>
              )}
            </div>

            {/* Card Content */}
            <div className="flex flex-1 flex-col p-5">
              {/* Vendor & Rating Row */}
              <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
                <p className="truncate font-medium text-foreground/80">
                  By <span className="font-semibold text-foreground">{service.vendor.businessName || service.vendor.name}</span>
                </p>
                <div className="flex shrink-0 items-center gap-1 font-semibold text-amber-500">
                  <Star size={13} className="fill-current text-amber-500" />
                  <span>4.9</span>
                </div>
              </div>

              {/* Title */}
              <h3 className="mt-2 line-clamp-2 font-display text-xl font-bold leading-snug tracking-tight text-foreground transition-colors group-hover:text-primary">
                {service.title}
              </h3>

              {/* Location */}
              <div className="mt-2.5 flex items-center gap-1.5 text-xs text-muted-foreground">
                <MapPin size={13} className="shrink-0 text-primary/80" aria-hidden="true" />
                <span className="truncate">{service.location || "Available Nationwide"}</span>
              </div>

              {/* Price & Action Footer */}
              <div className="mt-auto flex items-center justify-between gap-3 border-t border-border/70 pt-4 mt-5">
                <div>
                  <span className="text-[11px] font-medium tracking-wider uppercase text-muted-foreground">Starting from</span>
                  <p className="font-display text-lg font-bold text-foreground">
                    {price.format(service.priceMinor / 100)}
                  </p>
                </div>
                <Link 
                  href={`/services/${service.id}`} 
                  prefetch={false} 
                  aria-label={`View Details for ${service.title}`}
                  className={cn(
                    buttonVariants({ variant: "outline", size: "sm" }), 
                    "rounded-full border-border group-hover:border-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300"
                  )}
                >
                  View Details <ArrowUpRight size={14} className="ml-1" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </article>
        </li>
      ))}
    </ul>
  );
}
