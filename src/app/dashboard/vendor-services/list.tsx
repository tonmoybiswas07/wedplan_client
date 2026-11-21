import Link from "next/link";
import { ImageIcon, Plus } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { fetchVendorServices } from "./api";
import { DeleteService } from "./delete";
import type { VendorService } from "./model";

const price = new Intl.NumberFormat("en-BD", { style: "currency", currency: "BDT", currencyDisplay: "code" });

const approval = {
  pending: { label: "Pending approval", color: "bg-stationery-blush text-stationery-plum" },
  approved: { label: "Approved", color: "bg-green-100 text-green-900" },
  rejected: { label: "Rejected", color: "bg-red-100 text-red-900" },
};

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
        <div className="border border-dashed border-stationery-line bg-stationery-paper px-6 py-12 text-center">
          <h2 className="font-stationery text-2xl">No services yet</h2>
          <p className="mt-2 text-sm text-muted-foreground">Add your first wedding service to submit it for review.</p>
        </div>
      ) : (
        <ul className="grid gap-4 lg:grid-cols-2 2xl:grid-cols-3">
          {services.map((service) => (
            <li key={service.id} className="min-w-0 border border-stationery-line bg-stationery-paper p-1 shadow-sm">
              <article className="flex h-full flex-col border border-stationery-line/65">
                <div className="grid aspect-video place-items-center overflow-hidden bg-stationery-blush/45 text-stationery-rose">
                  {service.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element -- The API supplies a hosted ImgBB URL.
                    <img src={service.imageUrl} alt="" loading="lazy" className="size-full object-cover" />
                  ) : <ImageIcon size={28} aria-hidden="true" />}
                </div>
                <div className="flex flex-1 flex-col gap-3 p-4 sm:p-5">
                  <div>
                    <p className="text-sm font-medium break-words text-stationery-rose">{service.category}</p>
                    <h2 className="font-stationery text-2xl break-words">{service.title}</h2>
                  </div>
                  <p className="line-clamp-3 text-sm break-words text-muted-foreground">{service.description}</p>
                  <p className="font-semibold">{price.format(service.priceMinor / 100)}</p>
                  <div className="flex flex-wrap gap-2">
                    <span className={cn("rounded-full px-2.5 py-1 text-xs font-semibold", approval[service.status].color)}>
                      {approval[service.status].label}
                    </span>
                    <span className="rounded-full border border-stationery-line px-2.5 py-1 text-xs font-medium">
                      {service.active ? "Active" : "Inactive"}
                    </span>
                  </div>
                  <div className="mt-auto flex flex-wrap gap-2 border-t border-stationery-line/65 pt-3">
                    <Link href={`/dashboard/vendor/my-services/${service.id}`}
                      aria-label={`Edit ${service.title}`}
                      className={cn(buttonVariants({ variant: "outline" }), "h-9 px-3")}>Edit</Link>
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
