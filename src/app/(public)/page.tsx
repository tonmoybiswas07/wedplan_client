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

  if (!result) return <p role="alert" className="border border-stationery-line bg-stationery-paper p-6">Featured services are temporarily unavailable.</p>;
  if (!result.services.length) return <p className="border border-stationery-line bg-stationery-paper p-6">Featured services will appear here as vendors publish their listings.</p>;

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

export default function Home() {
  return (
    <main>
      <section className="mx-auto grid max-w-7xl items-center gap-5 px-4 pt-10 pb-14 sm:px-8 sm:pt-16 lg:grid-cols-[.88fr_1.12fr] lg:gap-12 lg:pb-20">
        <div className="max-w-xl">
          <h1 className="font-stationery text-[clamp(3rem,7.2vw,6.5rem)] leading-[.91] tracking-[-.055em] text-stationery-plum">
            Find your wedding <em className="font-normal text-stationery-rose">people.</em>
          </h1>
          <p className="mt-6 max-w-md text-base leading-relaxed text-muted-foreground sm:text-lg">Find photographers, caterers, venues, and more for the day you’re planning together.</p>
          <Link href="/services" className={cn(buttonVariants(), "mt-7 h-12 px-5 text-sm")}>Explore Wedding Services</Link>
        </div>
        <Reveal className="relative mt-5 grid grid-cols-[1fr_4fr] items-end pb-5 lg:mt-0 lg:pb-10">
          <div className="relative col-start-2 row-start-1 aspect-[5/4] border border-stationery-line p-1.5 sm:p-2.5">
            <div className="relative size-full overflow-hidden border border-stationery-line">
              <Image src="/wedding-editorial.webp" alt="A bride and groom sharing a quiet moment at their wedding" fill preload
                sizes="(min-width: 1024px) 47vw, 80vw" className="object-cover object-center" />
            </div>
          </div>
          <div className="relative z-10 col-span-2 col-start-1 row-start-1 -mb-4 w-[35%] min-w-24 max-w-48 bg-stationery-paper p-1.5 shadow-lg sm:-mb-7 sm:p-2">
            <div className="relative aspect-[4/5] overflow-hidden border border-stationery-line">
              <Image src="/wedding-invitation.webp" alt="" fill sizes="(min-width: 768px) 192px, 35vw" className="object-cover" />
            </div>
          </div>
        </Reveal>
      </section>

      <section className="border-y border-stationery-line bg-stationery-paper">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-8 sm:py-14">
          <h2 className="mb-6 font-stationery text-3xl sm:text-4xl">Browse by category</h2>
          <Reveal>
            <ul aria-label="Wedding service categories" className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
              {categories.map(({ name, Icon }) => (
                <li key={name}>
                  <Link href={`/services?${new URLSearchParams({ category: name })}`} className="flex min-h-24 flex-col justify-center gap-2 border border-stationery-line px-4 py-4 font-medium text-stationery-plum transition-colors hover:bg-stationery-blush/60 motion-reduce:transition-none">
                    <Icon size={21} aria-hidden="true" className="text-stationery-rose" />
                    <span className="text-sm">{name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-8 sm:py-16">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-stationery text-4xl sm:text-5xl">Featured services</h2>
          <Link href="/services" className="text-sm font-semibold underline underline-offset-4">See all services</Link>
        </div>
        <Suspense fallback={<CatalogLoading />}><FeaturedServices /></Suspense>
      </section>

      <section className="bg-stationery-plum text-stationery-ivory">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-8 sm:py-16">
          <h2 className="mb-7 font-stationery text-4xl sm:text-5xl">Why Choose WedPlan</h2>
          <div className="grid gap-6 sm:grid-cols-3">
            {benefits.map(({ title, text, Icon }) => <div key={title} className="border-t border-stationery-blush/40 pt-4">
              <Icon size={22} aria-hidden="true" className="mb-3 text-stationery-blush" />
              <h3 className="font-stationery text-2xl">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-stationery-ivory/85">{text}</p>
            </div>)}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-8 sm:py-16">
        <h2 className="mb-7 font-stationery text-4xl sm:text-5xl">How WedPlan Works</h2>
        <ol className="grid gap-5 sm:grid-cols-3">
          {steps.map(({ title, text }) => <li key={title} className="border border-stationery-line bg-stationery-paper p-5">
            <h3 className="font-stationery text-2xl">{title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{text}</p>
          </li>)}
        </ol>
      </section>
    </main>
  );
}
