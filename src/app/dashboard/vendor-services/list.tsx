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
    <div className="grid gap-5">
      <div className="flex justify-end">
        <Link href="/dashboard/vendor/add-service" className={cn(buttonVariants(), "h-11 gap-2 px-4")}>
          <Plus aria-hidden="true" /> Add Service
        </Link>
      </div>
      {!services.length ? (
        <div className="border border-dashed border-line bg-paper px-6 py-12 text-center">
          <h2 className="font-display text-2xl">No services yet</h2>
          <p className="mt-2 text-sm text-muted-foreground">Add your first wedding service to submit it for review.</p>
        </div>
      ) : (
        <ul className="grid gap-4 lg:grid-cols-2 2xl:grid-cols-3">
          {services.map((service) => (
            <li key={service.id} className="min-w-0 border border-line bg-paper p-1 shadow-sm">
              <article className="flex h-full flex-col border border-line/65">
                <div className="grid aspect-video place-items-center overflow-hidden bg-blush/45 text-berry">
                  {service.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element -- The API supplies a hosted ImgBB URL.
                    <img src={service.imageUrl} alt="" loading="lazy" className="size-full object-cover" />
                  ) : <ImageIcon size={28} aria-hidden="true" />}
                </div>
                <div className="flex flex-1 flex-col gap-3 p-4 sm:p-5">
                  <div>
                    <p className="text-sm font-medium break-words text-berry">{service.category}</p>
                    <h2 className="font-display text-2xl break-words">{service.title}</h2>
                  </div>
                  <p className="line-clamp-3 text-sm break-words text-muted-foreground">{service.description}</p>
                  <p className="font-semibold">{price.format(service.priceMinor / 100)}</p>
                  <ServiceBadges status={service.status} isActive={service.isActive} />
                  <div className="mt-auto flex flex-wrap gap-2 border-t border-line/65 pt-3">
                    <Link href={`/dashboard/vendor/my-services/${service.id}`}
                      aria-label={`Edit ${service.title}`}
                      className={cn(buttonVariants({ variant: "outline" }), "h-9 px-3")}>Edit</Link>
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
