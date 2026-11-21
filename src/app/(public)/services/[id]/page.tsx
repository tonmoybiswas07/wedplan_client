import { SunflowerLoader } from "@/components/ui/sunflower-loader";
import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { 
  MapPin, 
  Store, 
  ChevronRight, 
  ShieldCheck, 
  Sparkles, 
  CheckCircle2, 
  ArrowLeft,
  Calendar
} from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { fetchSessionApi } from "@/lib/dashboard-api";
import { getDashboardAccess } from "@/lib/dashboard-session";
import type { Listing } from "@/lib/public-catalog";
import { safeServiceReturn } from "@/lib/service-return";
import { cn } from "@/lib/utils";
import { BookingForm } from "./booking-form";
import { ServiceGallery } from "./gallery";

export const metadata: Metadata = { 
  title: "Service Details | WedPlan Luxury Wedding Directory" 
};

type Params = Promise<{ id: string }>;
type ServiceDetails = Listing & { description: string; imageUrls?: string[] };

const currency = new Intl.NumberFormat("en-BD", { 
  style: "currency", 
  currency: "BDT", 
  maximumFractionDigits: 0 
});

const eventCalendar = new Intl.DateTimeFormat("en-CA", { 
  timeZone: "Asia/Dhaka", 
  year: "numeric", 
  month: "2-digit", 
  day: "2-digit" 
});

function Unavailable({ title, message }: { title: string; message: string }) {
  return (
    <main className="mx-auto min-h-[65svh] max-w-2xl px-4 py-20 text-center">
      <div className="rounded-3xl border border-border bg-card p-10 shadow-sm">
        <Sparkles className="mx-auto size-10 text-muted-foreground/50 mb-3" />
        <h1 className="font-display text-3xl font-bold text-foreground">{title}</h1>
        <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{message}</p>
        <Link 
          href="/services" 
          className={cn(buttonVariants(), "mt-6 rounded-full px-6 text-sm")}
        >
          Return to Browse Services
        </Link>
      </div>
    </main>
  );
}

async function ServicePageContent({ params }: { params: Params }) {
  const { id } = await params;
  const path = safeServiceReturn(`/services/${id}`);
  if (!path) return <Unavailable title="Service Unavailable" message="The requested listing link is invalid or has expired." />;

  const access = await getDashboardAccess();
  const signIn = `/sign-in?${new URLSearchParams({ returnTo: path })}`;
  
  // Access Rule: unauthenticated users redirect to Sign In
  if (access.status === "guest") redirect(signIn);
  if (access.status === "denied") return <Unavailable title="Access Denied" message="Your account does not have permission to view this listing." />;
  if (access.status !== "allowed") return <Unavailable title="Session Verification" message="Could not verify your authentication session. Please try again." />;

  const response = await fetchSessionApi(`/api/services/${id}`);
  if (response.status === 401) redirect(signIn);
  if (response.status === 404) return <Unavailable title="Listing Not Found" message="This wedding service has been archived or is no longer active." />;
  if (!response.ok) return <Unavailable title="Service Error" message="Could not retrieve service details right now. Please try again shortly." />;

  const { service } = await response.json() as { service: ServiceDetails };
  const photos = [...new Set([service.imageUrl, ...(service.imageUrls ?? [])].filter((url): url is string => Boolean(url)))];

  return (
    <main className="mx-auto min-h-[75svh] max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      {/* Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-xs text-muted-foreground">
        <Link href="/" className="hover:text-primary transition-colors">Home</Link>
        <ChevronRight size={13} />
        <Link href="/services" className="hover:text-primary transition-colors">Browse Services</Link>
        <ChevronRight size={13} />
        <span className="truncate max-w-[200px] text-foreground font-medium">{service.title}</span>
      </nav>

      {/* Main Grid: Left Gallery + Info, Right Vendor Card + Booking */}
      <div className="grid min-w-0 items-start gap-8 lg:grid-cols-[minmax(0,1.8fr)_minmax(0,1.2fr)] lg:gap-12">
        {/* Left column */}
        <div className="grid min-w-0 gap-8">
          {/* Header */}
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
                {service.category}
              </span>
              {service.vendor.premium && (
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2.5 py-1 text-xs font-bold text-amber-600 dark:text-amber-400">
                  <Sparkles size={11} className="fill-current" /> Premium Partner
                </span>
              )}
            </div>
            <h1 className="break-words font-display text-3xl font-extrabold tracking-tight text-foreground sm:text-5xl leading-tight">
              {service.title}
            </h1>
            <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin size={15} className="text-primary" />
              <span>{service.location || "Available Nationwide in Bangladesh"}</span>
            </div>
          </div>

          {/* Photo Gallery */}
          <ServiceGallery key={service.id} title={service.title} photos={photos} />

          {/* About / Description Section */}
          <section aria-labelledby="service-description" className="rounded-2xl border border-border/80 bg-card p-7 shadow-sm">
            <h2 id="service-description" className="font-display text-2xl font-bold text-foreground">
              About This Service
            </h2>
            <div className="mt-4 prose prose-neutral dark:prose-invert max-w-none">
              <p className="whitespace-pre-wrap break-words leading-relaxed text-sm text-foreground/80 sm:text-base">
                {service.description}
              </p>
            </div>

            {/* Service Highlights */}
            <div className="mt-8 border-t border-border/70 pt-6">
              <h3 className="font-display text-base font-bold text-foreground mb-3">Why Book With This Vendor</h3>
              <ul className="grid gap-2.5 sm:grid-cols-2 text-xs text-muted-foreground">
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-emerald-600" />
                  <span>Direct Communication with Vendor</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-emerald-600" />
                  <span>Customizable Event Packages</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-emerald-600" />
                  <span>Transparent Pricing Guarantee</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-emerald-600" />
                  <span>Admin Verified Portfolio</span>
                </li>
              </ul>
            </div>
          </section>
        </div>

        {/* Right column: Sticky Vendor Card & Booking Form */}
        <div className="grid min-w-0 gap-6 lg:sticky lg:top-24">
          {/* Vendor Card */}
          <section aria-labelledby="vendor-details" className="rounded-2xl border border-border/80 bg-card p-6 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Starting Investment</p>
                <p className="mt-1 font-display text-3xl font-extrabold text-foreground">
                  {currency.format(service.priceMinor / 100)}
                </p>
              </div>
              <span className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-secondary-foreground">
                Base Package
              </span>
            </div>

            <div className="mt-6 border-t border-border/70 pt-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Service Provider</p>
              <div className="flex items-center gap-3">
                <div className="flex size-12 items-center justify-center rounded-xl bg-secondary text-primary">
                  <Store size={22} />
                </div>
                <div>
                  <h3 className="font-display text-base font-bold text-foreground">
                    {service.vendor.businessName || service.vendor.name}
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 mt-0.5 font-medium">
                    <ShieldCheck size={13} /> Verified Vendor
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-5 rounded-xl bg-secondary/50 p-3.5 text-xs text-muted-foreground flex items-center gap-2">
              <Calendar size={15} className="text-primary shrink-0" />
              <span>Inquire early to reserve dates during peak wedding season.</span>
            </div>
          </section>

          {/* Booking Option */}
          {access.user.role === "customer" && (
            <BookingForm serviceId={service.id} earliestDate={eventCalendar.format(new Date())} />
          )}

          {access.user.role === "vendor" && (
            <div className="rounded-2xl border border-border/80 bg-card p-6 text-center text-xs text-muted-foreground">
              <p className="font-semibold text-foreground">Vendor Account</p>
              <p className="mt-1">Vendors cannot submit customer booking requests for services.</p>
            </div>
          )}

          {access.user.role === "admin" && (
            <div className="rounded-2xl border border-border/80 bg-card p-6 text-center text-xs text-muted-foreground">
              <p className="font-semibold text-foreground">Administrator Account</p>
              <p className="mt-1">Admin accounts cannot submit customer bookings.</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

export default function ServicePage({ params }: { params: Params }) {
  return <Suspense fallback={<SunflowerLoader label="Loading service details…" />}><ServicePageContent params={params} /></Suspense>;
}
