import type { Metadata } from "next";
import { Suspense } from "react";
import { connection } from "next/server";
import Image from "next/image";
import Link from "next/link";
import { HeartHandshake, MapPin, ShieldCheck } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { categories } from "@/components/public/categories";
import { Reveal } from "@/components/public/reveal";
import { CatalogLoading, ServiceGrid } from "@/components/public/service-grid";
import { readCatalog } from "@/lib/public-catalog";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "WedPlan | Find your wedding vendors", description: "Explore approved wedding services and find vendors for your day." };

async function FeaturedServices() {
  await connection();
  const result = await readCatalog(new URLSearchParams({ limit: "6" }));

  if (!result) return <p role="alert" className="border border-line bg-paper p-6">Featured services are temporarily unavailable.</p>;
  if (!result.services.length) return <p className="border border-line bg-paper p-6">Featured services will appear here as vendors publish their listings.</p>;

  return <ServiceGrid listings={result.services} />;
}

const benefits = [
  { title: "Reviewed listings", text: "Every listing is reviewed before it can appear in Browse Services.", Icon: ShieldCheck },
  { title: "Search by location", text: "Find vendors who serve your city or wedding location.", Icon: MapPin },
  { title: "Compare at your pace", text: "See starting prices and vendor names as you explore.", Icon: HeartHandshake },
];

const steps = [
  { title: "Choose a category", text: "Start with a service you need for your wedding." },
  { title: "Narrow your search", text: "Filter by location and sort by starting price." },
  { title: "Explore a listing", text: "Select a service and sign in to continue." },
];

const photographs = ["photography", "venues", "florist", "catering", "styling", "fashion"];

export default function Home() {
  return (
    <main>
      <section className="isolate overflow-hidden border-b border-line bg-[var(--hero-wash)]">
        <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-5 py-12 sm:px-8 lg:grid-cols-[.9fr_1.1fr] lg:gap-14 lg:py-16">
          <div aria-hidden="true" className="alpana pointer-events-none absolute inset-y-0 start-0 -z-10 w-1/3 opacity-45 [mask-image:linear-gradient(to_right,black,transparent)]" />
          <div className="max-w-xl">
            <span className="mb-5 block h-px w-14 bg-marigold" aria-hidden="true" />
            <h1 className="font-editorial text-[clamp(3.35rem,7vw,6.8rem)] leading-[.91] tracking-[-.055em] text-ink">
              A wedding in <em className="font-normal text-earth">full bloom.</em>
            </h1>
            <p className="mt-6 max-w-sm text-base leading-relaxed text-muted-foreground sm:text-lg">Discover wedding services across Bangladesh and find the people who will bring your day to life.</p>
            <Link href="/services" className={cn(buttonVariants(), "mt-7 h-12 px-5 text-sm")}>Explore Wedding Services</Link>
          </div>
          <Reveal className="relative px-0 pb-5 sm:ps-12 sm:pe-5">
            <div className="relative aspect-[6/5] overflow-hidden rounded-t-[47%] rounded-b-xl border-4 border-paper shadow-xl">
              <Image src="/wedding-editorial.webp" alt="A Bangladeshi bride and groom at their garden wedding" fill preload
                sizes="(min-width: 1024px) 50vw, 95vw" className="object-cover object-[center_36%]" />
            </div>
            <div className="absolute bottom-0 start-0 w-[26%] min-w-22 max-w-40 -rotate-4 rounded-lg border border-line bg-paper p-1.5 shadow-lg">
              <div className="relative aspect-square overflow-hidden rounded-md">
                <Image src="/bloom/florist.webp" alt="" fill sizes="160px" className="object-cover" />
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="bg-paper">
        <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-16">
          <h2 className="mb-6 font-editorial text-4xl sm:text-5xl">Browse by category</h2>
          <Reveal>
            <ul aria-label="Wedding service categories" className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-12 lg:gap-4">
              {categories.map(({ name }, index) => (
                <li key={name} className={index === 0 || index === 5 ? "lg:col-span-5" : index === 1 || index === 3 ? "lg:col-span-4" : "lg:col-span-3"}>
                  <Link href={`/services?${new URLSearchParams({ category: name })}`}
                    className="group relative isolate flex min-h-36 items-end overflow-hidden rounded-xl bg-olive p-3 text-on-olive sm:min-h-48 sm:p-5 lg:min-h-55">
                    <Image src={`/bloom/${photographs[index]}.webp`} alt="" fill sizes="(min-width: 1024px) 40vw, (min-width: 640px) 33vw, 50vw"
                      className="-z-20 object-cover motion-safe:transition-transform motion-safe:duration-500 motion-safe:group-hover:scale-105" />
                    <span aria-hidden="true" className="absolute inset-0 -z-10 bg-linear-to-t from-overlay/95 via-overlay/35 to-transparent" />
                    <span className="font-editorial text-xl leading-tight sm:text-2xl">{name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-16">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <h2 className="font-editorial text-4xl sm:text-5xl">Featured services</h2>
          <Link href="/services" className={cn(buttonVariants({ variant: "outline" }), "h-10 bg-paper px-4")}>See all services</Link>
        </div>
        <Suspense fallback={<CatalogLoading />}><FeaturedServices /></Suspense>
      </section>

      <section className="bg-olive text-on-olive">
        <div className="mx-auto grid max-w-7xl items-center gap-8 px-5 py-12 sm:px-8 lg:grid-cols-[.8fr_1.2fr] lg:gap-12">
          <div className="relative aspect-[5/4] overflow-hidden rounded-t-[46%] rounded-b-lg border-4 border-marigold/45">
            <Image src="/bloom/venues.webp" alt="A Bengali wedding venue framed with flowers" fill sizes="(min-width: 1024px) 40vw, 90vw" className="object-cover" />
          </div>
          <div>
            <h2 className="mb-6 font-editorial text-4xl sm:text-5xl">Why Choose WedPlan</h2>
            <ul className="divide-y divide-on-olive/25">
              {benefits.map(({ title, text, Icon }) => <li key={title} className="flex gap-4 py-4">
                <Icon size={22} aria-hidden="true" className="mt-1 shrink-0 text-marigold" />
                <div><h3 className="font-editorial text-2xl">{title}</h3><p className="mt-1 text-sm leading-relaxed text-on-olive/85">{text}</p></div>
              </li>)}
            </ul>
          </div>
        </div>
      </section>

      <section className="relative isolate bg-sage">
        <div aria-hidden="true" className="alpana pointer-events-none absolute inset-0 -z-10 opacity-30" />
        <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-16">
          <h2 className="mb-7 text-center font-editorial text-4xl sm:text-5xl">How WedPlan Works</h2>
          <ol className="grid gap-4 sm:grid-cols-3">
            {steps.map(({ title, text }, index) => <li key={title} className="rounded-xl border border-line bg-paper p-5">
              <span aria-hidden="true" className="mb-3 grid size-8 place-items-center rounded-full bg-warning-surface text-sm font-semibold text-warning-ink">{index + 1}</span>
              <h3 className="font-editorial text-2xl">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{text}</p>
            </li>)}
          </ol>
        </div>
      </section>
    </main>
  );
}
