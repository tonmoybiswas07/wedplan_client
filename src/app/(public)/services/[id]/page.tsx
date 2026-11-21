import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { MapPin, Store } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { fetchSessionApi } from "@/lib/dashboard-api";
import { getDashboardAccess } from "@/lib/dashboard-session";
import type { Listing } from "@/lib/public-catalog";
import { safeServiceReturn } from "@/lib/service-return";
import { cn } from "@/lib/utils";
import { BookingForm } from "./booking-form";
import { ServiceGallery } from "./gallery";

export const metadata: Metadata = { title: "Service details | WedPlan" };

type Params = Promise<{ id: string }>;
type ServiceDetails = Listing & { description: string; imageUrls?: string[] };
const currency = new Intl.NumberFormat("en-BD", { style: "currency", currency: "BDT", currencyDisplay: "code" });
const eventCalendar = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Dhaka", year: "numeric", month: "2-digit", day: "2-digit" });

function Unavailable({ title, message }: { title: string; message: string }) {
  return (
    <main className="mx-auto min-h-[65svh] max-w-3xl px-4 py-16 sm:px-8">
      <div className="border border-stationery-line bg-stationery-paper p-6 sm:p-10">
        <h1 className="font-stationery text-4xl">{title}</h1>
        <p className="mt-3 text-muted-foreground">{message}</p>
        <Link href="/services" className={cn(buttonVariants(), "mt-6 h-11 px-4")}>Back to Browse Services</Link>
      </div>
    </main>
  );
}

async function ServicePageContent({ params }: { params: Params }) {
  const { id } = await params;
  const path = safeServiceReturn(`/services/${id}`);
  if (!path) return <Unavailable title="Service unavailable" message="This listing link is invalid." />;

  const access = await getDashboardAccess();
  const signIn = `/sign-in?${new URLSearchParams({ returnTo: path })}`;
  if (access.status === "guest") redirect(signIn);
  if (access.status === "denied") return <Unavailable title="Access denied" message="Your account can’t access this listing." />;
  if (access.status !== "allowed") return <Unavailable title="Couldn’t verify your session" message="Try again shortly." />;

  const response = await fetchSessionApi(`/api/services/${id}`);
  if (response.status === 401) redirect(signIn);
  if (response.status === 404) return <Unavailable title="Service unavailable" message="This listing is no longer available." />;
  if (!response.ok) return <Unavailable title="Couldn’t load this service" message="Try again shortly." />;

  const { service } = await response.json() as { service: ServiceDetails };
  const photos = [...new Set([service.imageUrl, ...(service.imageUrls ?? [])].filter((url): url is string => Boolean(url)))];

  return (
    <main className="mx-auto min-h-[70svh] max-w-7xl px-4 py-8 sm:px-8 sm:py-12">
      <Link href="/services" className="text-sm font-semibold underline underline-offset-4">Browse Services</Link>
      <header className="mb-7 mt-5 sm:mb-9">
        <p className="mb-2 text-sm font-semibold tracking-wide text-stationery-rose">{service.category}</p>
        <h1 className="break-words font-stationery text-4xl leading-tight tracking-tight sm:text-6xl">{service.title}</h1>
      </header>
      <div className="grid min-w-0 items-start gap-7 lg:grid-cols-[minmax(0,1.75fr)_minmax(0,1fr)] lg:gap-10">
        <div className="grid min-w-0 gap-7">
          <ServiceGallery key={service.id} title={service.title} photos={photos} />
          <section aria-labelledby="service-description" className="border-t border-stationery-line pt-5">
            <h2 id="service-description" className="font-stationery text-3xl">About this service</h2>
            <p className="mt-3 whitespace-pre-wrap break-words leading-relaxed text-muted-foreground">{service.description}</p>
          </section>
        </div>
        <div className="grid min-w-0 gap-5">
          <section aria-labelledby="vendor-details" className="border border-stationery-line bg-stationery-paper p-5 sm:p-6">
            <h2 id="vendor-details" className="font-stationery text-2xl">Service and vendor</h2>
            <p className="mt-4 text-sm text-muted-foreground">Starting price</p>
            <p className="mt-1 text-xl font-semibold">{currency.format(service.priceMinor / 100)}</p>
            <div className="mt-4 grid gap-2 border-t border-stationery-line/60 pt-4 text-sm">
              <p className="flex items-start gap-2 break-words"><Store className="mt-0.5 size-4 shrink-0 text-stationery-rose" aria-hidden="true" />{service.vendor.businessName || service.vendor.name}</p>
              {service.vendor.premium && <span className="w-fit rounded-full bg-stationery-blush px-2 py-0.5 text-xs font-semibold text-stationery-plum">Premium Vendor</span>}
              <p className="flex items-start gap-2 break-words"><MapPin className="mt-0.5 size-4 shrink-0 text-stationery-rose" aria-hidden="true" />{service.location || "Location not listed"}</p>
            </div>
          </section>
          {access.user.role === "customer" && <BookingForm serviceId={service.id} earliestDate={eventCalendar.format(new Date())} />}
        </div>
      </div>
    </main>
  );
}

export default function ServicePage({ params }: { params: Params }) {
  return <Suspense fallback={<p role="status" className="p-8">Loading service…</p>}><ServicePageContent params={params} /></Suspense>;
}
