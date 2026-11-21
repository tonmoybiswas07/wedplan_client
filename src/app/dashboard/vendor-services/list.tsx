import Link from "next/link";
import { ImageIcon, Plus } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { fetchVendorServices } from "./api";
import { ServiceBadges } from "./badges";
import { AvailabilityControl } from "./availability";
import { DeleteService } from "./delete";
import type { VendorService } from "./model";

const price = new Intl.NumberFormat("en-BD", { style: "currency", currency: "BDT", currencyDisplay: "code" });

export async function ServiceList() {
  const response = await fetchVendorServices();
  if (!response.ok) return <p role="alert">Your services could not be loaded. Refresh the page to try again.</p>;

  const { services } = (await response.json()) as { services: VendorService[] };

  return (
    <div className="grid gap-6">
      <div className="flex justify-between items-center border-b border-border/70 pb-4">
        <div>
          <h2 className="font-display text-xl font-bold text-foreground">Published Services</h2>
          <p className="text-xs text-muted-foreground mt-0.5">Manage your active and pending wedding services</p>
        </div>
        <Link href="/dashboard/vendor/add-service" className={cn(buttonVariants(), "rounded-full px-5 text-xs font-semibold shadow-sm")}>
          <Plus size={15} className="mr-1.5" aria-hidden="true" /> Add New Service
        </Link>
      </div>
      {!services.length ? (
        <div className="rounded-2xl border border-dashed border-border/80 bg-card py-14 text-center">
          <h2 className="font-display text-2xl font-bold text-foreground">No services listed yet</h2>
          <p className="mt-2 text-xs text-muted-foreground max-w-sm mx-auto">Publish your first wedding photography, venue, catering, or decor service to start receiving bookings.</p>
          <Link href="/dashboard/vendor/add-service" className={cn(buttonVariants({ variant: "outline", size: "sm" }), "mt-5 rounded-full px-5")}>
            Create Service Now
          </Link>
        </div>
      ) : (
        <ul className="grid gap-6 lg:grid-cols-2 2xl:grid-cols-3">
          {services.map((service) => (
            <li key={service.id} className="min-w-0 overflow-hidden rounded-2xl border border-border/80 bg-card shadow-sm transition-all hover:border-primary/30 hover:shadow-md">
              <article className="flex h-full flex-col">
                <div className="relative aspect-video overflow-hidden bg-muted">
                  {service.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element -- The API supplies a hosted ImgBB URL.
                    <img src={service.imageUrl} alt="" loading="lazy" className="size-full object-cover" />
                  ) : (
                    <div className="flex size-full items-center justify-center text-muted-foreground">
                      <ImageIcon size={32} aria-hidden="true" />
                    </div>
                  )}
                  <div className="absolute top-3 start-3">
                    <span className="rounded-full bg-background/90 px-3 py-1 text-[11px] font-bold text-foreground backdrop-blur-md shadow-sm">
                      {service.category}
                    </span>
                  </div>
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <h3 className="font-display text-xl font-bold text-foreground line-clamp-1">{service.title}</h3>
                  <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{service.description}</p>
                  <p className="mt-3 font-display text-lg font-bold text-foreground">{price.format(service.priceMinor / 100)}</p>
                  
                  <div className="mt-3">
                    <ServiceBadges status={service.status} isActive={service.isActive} />
                  </div>

                  <div className="mt-auto flex flex-wrap gap-2 border-t border-border/70 pt-4 mt-5">
                    <Link 
                      href={`/dashboard/vendor/my-services/${service.id}`}
                      aria-label={`Edit ${service.title}`}
                      className={cn(buttonVariants({ variant: "outline", size: "sm" }), "rounded-full px-3.5 text-xs font-semibold")}
                    >
                      Edit
                    </Link>
                    <AvailabilityControl {...service} />
                    <DeleteService id={service.id} title={service.title} />
                  </div>
                </div>
              </article>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
