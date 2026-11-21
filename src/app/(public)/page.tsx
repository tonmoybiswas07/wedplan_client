import { SunflowerLoader } from "@/components/ui/sunflower-loader";
import type { Metadata } from "next";
import { Suspense } from "react";
import { connection } from "next/server";
import Form from "next/form";
import Image from "next/image";
import Link from "next/link";
import { 
  Search, 
  Sparkles, 
  ArrowRight, 
  MapPin, 
  ShieldCheck, 
  HeartHandshake, 
  Clock, 
  Star, 
  CheckCircle2, 
  Users, 
  Calendar, 
  Building2, 
  Camera, 
  Flower2, 
  Utensils, 
  Shirt, 
  ArrowUpRight 
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button, buttonVariants } from "@/components/ui/button";
import { categories } from "@/components/public/categories";
import { Reveal } from "@/components/public/reveal";
import { ServiceGrid } from "@/components/public/service-grid";
import { readCatalog } from "@/lib/public-catalog";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { 
  title: "WedPlan | Luxury Wedding Planning & Vendor Platform", 
  description: "Discover premier wedding venues, renowned photographers, exquisite caterers, and styling specialists for your unforgettable wedding day." 
};

async function FeaturedServices() {
  await connection();
  const result = await readCatalog(new URLSearchParams({ limit: "6" }));

  if (!result) return (
    <div className="rounded-2xl border border-dashed border-border bg-card p-10 text-center">
      <p className="text-muted-foreground">Featured services are temporarily unavailable. Please check back shortly.</p>
    </div>
  );
  if (!result.services.length) return (
    <div className="rounded-2xl border border-dashed border-border bg-card p-12 text-center">
      <Sparkles className="mx-auto size-8 text-primary/60 mb-3" />
      <h3 className="font-display text-xl font-bold">New Curated Listings Coming Soon</h3>
      <p className="mt-2 text-sm text-muted-foreground">Our verified wedding artisans are finalizing their showcase listings.</p>
    </div>
  );

  return <ServiceGrid listings={result.services} />;
}

const valueProps = [
  {
    title: "100% Verified Vendors",
    description: "Every vendor portfolio and credential is hand-reviewed by our curation team before publishing.",
    Icon: ShieldCheck,
  },
  {
    title: "Direct Date Inquiries",
    description: "Submit booking requests with your exact event date, venue location, and custom requests in seconds.",
    Icon: Calendar,
  },
  {
    title: "Transparent Pricing",
    description: "Browse clear starting prices, package details, and verified vendor tiers without hidden surcharges.",
    Icon: HeartHandshake,
  },
  {
    title: "Dedicated Booking Tracking",
    description: "Monitor status from pending to accepted, coordinate seamlessly, and keep all arrangements organized.",
    Icon: Clock,
  },
];

const steps = [
  {
    number: "01",
    title: "Explore Curated Categories",
    description: "Browse verified photography, venues, catering, decoration, styling, and bridal fashion.",
  },
  {
    number: "02",
    title: "Compare & Filter",
    description: "Filter by location, price ranges, and review ratings to find vendors tailored to your wedding vision.",
  },
  {
    number: "03",
    title: "Send Booking Inquiries",
    description: "Select your desired event date, enter your venue location, and send an official booking request.",
  },
  {
    number: "04",
    title: "Celebrate Stress-Free",
    description: "Receive instant updates from your chosen vendors and manage your wedding itinerary from one dashboard.",
  },
];

const popularDestinations = [
  {
    name: "Dhaka Heritage & Grand Hotels",
    region: "Dhaka Division",
    image: "/bloom/venues.webp",
    vendorsCount: "350+ Venues & Decorators",
  },
  {
    name: "Cox's Bazar Beachfront Ceremonies",
    region: "Chittagong Division",
    image: "/bloom/photography.webp",
    vendorsCount: "120+ Destination Specialists",
  },
  {
    name: "Sylhet Tea Garden Resorts",
    region: "Sylhet Division",
    image: "/bloom/florist.webp",
    vendorsCount: "95+ Scenic Venues",
  },
];

const testimonials = [
  {
    quote: "WedPlan made booking our dream photographer and wedding decorator effortless. Seeing transparent starting prices saved us weeks of back-and-forth emails!",
    couple: "Nabila & Tanvir",
    location: "Dhaka Wedding",
    rating: 5,
  },
  {
    quote: "As a wedding venue manager, WedPlan connected us with high-intent couples. The booking request workflow and Stripe upgrade gave our team immense visibility.",
    couple: "Sayed Rahman",
    location: "Grand Ballroom Director",
    rating: 5,
  },
  {
    quote: "The cleanest, most elegant wedding directory in Bangladesh. We found our makeup artist and catering in a single weekend. Highly recommended!",
    couple: "Farhana & Zubair",
    location: "Chittagong Wedding",
    rating: 5,
  },
];

const photographs = ["photography", "venues", "florist", "catering", "styling", "fashion"];

export default function Home() {
  return (
    <main className="overflow-hidden">
      {/* ===================== HERO SECTION ===================== */}
      <section className="relative isolate overflow-hidden border-b border-border/80 bg-gradient-to-b from-secondary/40 via-background to-background py-12 sm:py-20 lg:py-24">
        {/* Ambient subtle glow background effect */}
        <div 
          aria-hidden="true" 
          className="pointer-events-none absolute -top-40 start-1/2 -z-10 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-primary/10 blur-[120px]" 
        />
        
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
            
            {/* Left Column: Headline, description, CTA, search form */}
            <div className="lg:col-span-7">
              {/* Trust Badge Pill */}
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-semibold text-primary backdrop-blur-sm">
                <Sparkles size={14} className="fill-current text-primary" />
                <span>Bangladesh&apos;s #1 Curated Wedding Platform</span>
              </div>

              {/* Headline */}
              <h1 className="mt-5 font-display text-4xl font-extrabold tracking-tight text-foreground sm:text-6xl lg:text-7xl leading-[1.08]">
                Plan Your <span className="italic font-normal text-primary">Dream Wedding</span> With Perfection.
              </h1>

              {/* Subdescription */}
              <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
                Discover exceptional wedding venues, visionary photographers, exquisite decorators, and bespoke caterers across Bangladesh. Request bookings and orchestrate your special day with complete ease.
              </p>

              {/* CTA Buttons */}
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link
                  href="/services"
                  className={cn(
                    buttonVariants({ size: "lg" }),
                    "rounded-full px-7 text-base font-semibold shadow-md shadow-primary/20 hover:shadow-lg transition-all"
                  )}
                >
                  Explore Wedding Services <ArrowRight size={18} className="ml-2" />
                </Link>
                <Link
                  href="/sign-up"
                  className={cn(
                    buttonVariants({ variant: "outline", size: "lg" }),
                    "rounded-full border-border bg-card/60 px-7 text-base font-semibold backdrop-blur-sm hover:bg-card transition-all"
                  )}
                >
                  Join as a Vendor
                </Link>
              </div>

              {/* Floating Luxury Search Bar */}
              <div className="mt-10 rounded-2xl border border-border/80 bg-card/90 p-3 shadow-lg shadow-black/5 backdrop-blur-md sm:p-4">
                <Form action="/services" className="grid gap-3 sm:grid-cols-[1.3fr_1fr_auto]">
                  <div className="relative">
                    <label htmlFor="home-search" className="sr-only">Search services</label>
                    <Search size={17} className="absolute start-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <Input 
                      id="home-search" 
                      name="q" 
                      type="search" 
                      maxLength={100} 
                      className="h-12 rounded-xl bg-background ps-10 pe-4 text-sm font-medium border-border/80" 
                      placeholder="Photography, Grand Ballroom, Catering…" 
                    />
                  </div>
                  <div className="relative">
                    <label htmlFor="home-location" className="sr-only">Location</label>
                    <MapPin size={17} className="absolute start-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <Input 
                      id="home-location" 
                      name="location" 
                      maxLength={100} 
                      className="h-12 rounded-xl bg-background ps-10 pe-4 text-sm font-medium border-border/80" 
                      placeholder="Location (e.g. Dhaka, Sylhet)" 
                    />
                  </div>
                  <Button type="submit" size="lg" className="h-12 rounded-xl px-6 font-semibold">
                    Find Vendors
                  </Button>
                </Form>
              </div>

              {/* Trust Metric Strip */}
              <div className="mt-8 flex flex-wrap items-center gap-6 text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-emerald-600" />
                  <span className="font-medium text-foreground">Verified Portfolios</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star size={16} className="fill-amber-400 text-amber-400" />
                  <span className="font-medium text-foreground">4.9/5 Rating from Couples</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck size={16} className="text-primary" />
                  <span className="font-medium text-foreground">Stripe Verified Escrow</span>
                </div>
              </div>

            </div>

            {/* Right Column: Editorial visual showcase */}
            <div className="lg:col-span-5">
              <Reveal className="relative mx-auto max-w-md lg:max-w-none">
                {/* Main wedding portrait */}
                <div className="relative aspect-[4/5] overflow-hidden rounded-3xl border-4 border-card bg-muted shadow-2xl">
                  <Image 
                    src="/wedding-editorial.webp" 
                    alt="A joyful bride and groom on their wedding day" 
                    fill 
                    priority
                    sizes="(min-width: 1024px) 40vw, 90vw" 
                    className="object-cover object-center" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                  
                  {/* Floating badge inside image */}
                  <div className="absolute bottom-5 start-5 end-5 rounded-2xl border border-white/20 bg-white/90 p-4 backdrop-blur-md dark:bg-slate-900/90 shadow-lg">
                    <p className="text-xs font-semibold uppercase tracking-wider text-primary">Featured Celebration</p>
                    <p className="font-display text-lg font-bold text-foreground">Tasfia & Ryan&apos;s Royal Reception</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">5 Premier Vendors booked via WedPlan</p>
                  </div>
                </div>

                {/* Overlapping Floating Vendor Card */}
                <div className="absolute -bottom-6 -start-6 hidden sm:flex items-center gap-3 rounded-2xl border border-border bg-card p-3.5 shadow-xl">
                  <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Camera size={22} />
                  </div>
                  <div>
                    <div className="flex items-center gap-1 font-semibold text-xs text-amber-500">
                      <Star size={12} className="fill-current" /> 4.9 (120+ reviews)
                    </div>
                    <p className="text-sm font-bold text-foreground">Master Cinematography</p>
                    <p className="text-xs text-muted-foreground">Verified Vendor</p>
                  </div>
                </div>

                {/* Overlapping Bouquet Floating Thumbnail */}
                <div className="absolute -top-6 -end-6 hidden sm:block size-24 overflow-hidden rounded-2xl border-4 border-card shadow-lg">
                  <Image src="/bloom/bouquet.webp" alt="Wedding bouquet" fill sizes="100px" className="object-cover" />
                </div>
              </Reveal>
            </div>

          </div>
        </div>
      </section>

      {/* ===================== CATEGORIES SECTION ===================== */}
      <section className="border-b border-border/60 bg-card py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-primary">Explore by Specialty</p>
              <h2 className="mt-1 font-display text-3xl font-extrabold tracking-tight sm:text-4xl text-foreground">
                Wedding Service Categories
              </h2>
              <p className="mt-2 text-sm text-muted-foreground max-w-lg">
                Discover handpicked talents spanning every facet of your celebration.
              </p>
            </div>
            <Link 
              href="/services" 
              className={cn(buttonVariants({ variant: "outline", size: "sm" }), "rounded-full w-fit")}
            >
              View All Categories <ArrowRight size={14} className="ml-1" />
            </Link>
          </div>

          <Reveal>
            <ul aria-label="Wedding service categories" className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
              {categories.map(({ name, Icon }, index) => (
                <li key={name}>
                  <Link 
                    href={`/services?${new URLSearchParams({ category: name })}`}
                    className="group relative flex flex-col items-center justify-center overflow-hidden rounded-2xl border border-border/80 bg-background p-5 text-center transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg"
                  >
                    {/* Category Image Thumbnail */}
                    <div className="relative mb-3.5 size-16 overflow-hidden rounded-full border-2 border-primary/20 shadow-sm transition-transform duration-300 group-hover:scale-110">
                      <Image 
                        src={`/bloom/${photographs[index]}.webp`} 
                        alt={name} 
                        fill 
                        sizes="70px" 
                        className="object-cover" 
                      />
                    </div>
                    <span className="font-display text-sm font-bold text-foreground leading-snug group-hover:text-primary transition-colors">
                      {name}
                    </span>
                    <span className="mt-1.5 flex items-center text-[11px] font-semibold text-primary opacity-0 transition-opacity group-hover:opacity-100">
                      Explore <ArrowUpRight size={11} className="ml-0.5" />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      {/* ===================== FEATURED SERVICES ===================== */}
      <section className="bg-background py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-primary">
                <Sparkles size={14} /> Curated Showcase
              </div>
              <h2 className="mt-1 font-display text-3xl font-extrabold tracking-tight sm:text-4xl text-foreground">
                Featured Wedding Services
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Approved and actively available services for your upcoming celebration.
              </p>
            </div>
            <Link 
              href="/services" 
              className={cn(buttonVariants({ variant: "default" }), "rounded-full px-5 shadow-sm")}
            >
              Browse All Services
            </Link>
          </div>

          <Suspense fallback={<SunflowerLoader label="Loading featured services…" />}>
            <FeaturedServices />
          </Suspense>
        </div>
      </section>

      {/* ===================== WHY CHOOSE WEDPLAN ===================== */}
      <section className="border-y border-border/80 bg-secondary/30 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-xs font-bold uppercase tracking-widest text-primary">The WedPlan Distinction</span>
            <h2 className="mt-2 font-display text-3xl font-extrabold tracking-tight sm:text-4xl text-foreground">
              Why Couples & Vendors Choose WedPlan
            </h2>
            <p className="mt-3 text-sm sm:text-base leading-relaxed text-muted-foreground">
              Built specifically to elevate the wedding booking experience with trust, transparency, and high-end elegance.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {valueProps.map(({ title, description, Icon }) => (
              <div 
                key={title} 
                className="group relative rounded-2xl border border-border/80 bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-md"
              >
                <div className="mb-4 inline-flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <Icon size={24} />
                </div>
                <h3 className="font-display text-lg font-bold text-foreground">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== HOW WEDPLAN WORKS ===================== */}
      <section className="bg-background py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-xs font-bold uppercase tracking-widest text-primary">Seamless Journey</span>
            <h2 className="mt-2 font-display text-3xl font-extrabold tracking-tight sm:text-4xl text-foreground">
              How WedPlan Works
            </h2>
            <p className="mt-3 text-sm sm:text-base leading-relaxed text-muted-foreground">
              From inspiration to final confirmation, plan your entire wedding in four straightforward steps.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map(({ number, title, description }) => (
              <div key={number} className="relative rounded-2xl border border-border/80 bg-card p-6 shadow-sm">
                <span className="font-display text-3xl font-extrabold text-primary/30">
                  {number}
                </span>
                <h3 className="mt-3 font-display text-lg font-bold text-foreground">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== POPULAR DESTINATIONS ===================== */}
      <section className="border-t border-border/80 bg-card py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-primary">Scenic Venues</span>
              <h2 className="mt-1 font-display text-3xl font-extrabold tracking-tight sm:text-4xl text-foreground">
                Popular Wedding Destinations
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Enchanting regions across Bangladesh where dream weddings come alive.
              </p>
            </div>
            <Link 
              href="/services?category=Wedding+Venues" 
              className={cn(buttonVariants({ variant: "outline", size: "sm" }), "rounded-full")}
            >
              Browse Venues <ArrowRight size={14} className="ml-1" />
            </Link>
          </div>

          <div className="grid gap-6 sm:grid-cols-3">
            {popularDestinations.map((dest) => (
              <div 
                key={dest.name} 
                className="group relative isolate overflow-hidden rounded-2xl border border-border bg-muted shadow-sm transition-all duration-300 hover:shadow-xl"
              >
                <div className="relative aspect-[16/11] overflow-hidden">
                  <Image 
                    src={dest.image} 
                    alt={dest.name} 
                    fill 
                    sizes="(min-width: 640px) 33vw, 90vw" 
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                </div>
                <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                  <p className="text-xs font-medium text-white/80">{dest.region}</p>
                  <h3 className="font-display text-xl font-bold leading-snug">{dest.name}</h3>
                  <p className="mt-1.5 text-xs font-semibold text-rose-200">{dest.vendorsCount}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== TESTIMONIALS ===================== */}
      <section className="bg-background py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-xs font-bold uppercase tracking-widest text-primary">Couples&apos; Stories</span>
            <h2 className="mt-2 font-display text-3xl font-extrabold tracking-tight sm:text-4xl text-foreground">
              Loved by Brides, Grooms & Vendors
            </h2>
            <p className="mt-3 text-sm sm:text-base leading-relaxed text-muted-foreground">
              Real reviews from newlyweds and professionals who planned with WedPlan.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-3">
            {testimonials.map(({ quote, couple, location, rating }) => (
              <div key={couple} className="flex flex-col justify-between rounded-2xl border border-border/80 bg-card p-7 shadow-sm">
                <div>
                  <div className="flex items-center gap-1 text-amber-500 mb-4">
                    {Array.from({ length: rating }).map((_, i) => (
                      <Star key={i} size={15} className="fill-current text-amber-400" />
                    ))}
                  </div>
                  <p className="text-sm leading-relaxed text-foreground/80 italic">&ldquo;{quote}&rdquo;</p>
                </div>
                <div className="mt-6 border-t border-border/60 pt-4">
                  <p className="font-display font-bold text-foreground">{couple}</p>
                  <p className="text-xs text-muted-foreground">{location}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== VENDOR CTA BANNER ===================== */}
      <section className="border-t border-border/80 bg-gradient-to-r from-primary via-rose-700 to-primary py-16 px-4 text-primary-foreground sm:px-8">
        <div className="mx-auto max-w-5xl text-center">
          <Sparkles className="mx-auto size-10 mb-4 opacity-90 animate-pulse" />
          <h2 className="font-display text-3xl font-extrabold sm:text-5xl">
            Are You a Wedding Professional?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-primary-foreground/90 sm:text-lg">
            Join Bangladesh&apos;s leading wedding marketplace. Showcase your services, receive qualified booking inquiries, and unlock unlimited growth with our Premium Vendor subscription.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link 
              href="/sign-up" 
              className={cn(buttonVariants({ size: "lg" }), "rounded-full bg-white text-primary hover:bg-white/90 font-bold px-8 shadow-lg")}
            >
              Register as Vendor
            </Link>
            <Link 
              href="/sign-in" 
              className={cn(buttonVariants({ variant: "outline", size: "lg" }), "rounded-full border-white/40 text-white hover:bg-white/10 font-bold px-8")}
            >
              Sign In to Dashboard
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
