import { SunflowerLoader } from "@/components/ui/sunflower-loader";
import type { Metadata } from "next";
import { Suspense } from "react";
import { connection } from "next/server";
import Form from "next/form";
import { Search, Flower2, ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { HeartHandshake, MapPin, ShieldCheck } from "lucide-react";
import { NavigationCta } from "@/components/public/navigation-cta";
import { Input } from "@/components/ui/input";
import { Button, buttonVariants } from "@/components/ui/button";
import { categories } from "@/components/public/categories";
import { Reveal } from "@/components/public/reveal";
import { ServiceGrid } from "@/components/public/service-grid";
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
      <section className="relative isolate overflow-hidden border-b border-line bg-[var(--hero-wash)]">
        <div className="relative mx-auto grid max-w-[88rem] items-center gap-10 px-5 pt-11 pb-12 sm:px-8 lg:grid-cols-[.86fr_1.14fr] lg:gap-12 lg:py-14 xl:px-12">
          <div className="max-w-xl">
            <Flower2 aria-hidden="true" className="mb-5 size-7 -rotate-12 text-berry" />
            <h1 className="font-display text-[clamp(3.25rem,6.8vw,7rem)] leading-[.94] font-black tracking-[-.058em] text-ink">
              Find your<br className="hidden lg:block" /> wedding <span className="text-berry">people.</span>
            </h1>
            <p className="mt-5 max-w-sm text-base leading-relaxed text-muted-foreground sm:text-lg">From the first photo to the last dance, find the right wedding vendors across Bangladesh.</p>
            <NavigationCta href="/services" className="mt-7">Explore Services</NavigationCta>
            <Form action="/services" className="mt-7 grid items-end gap-3 rounded-[1.35rem] border border-line bg-paper p-3 shadow-sm sm:grid-cols-[1.2fr_1fr] sm:p-4">
              <div className="min-w-0">
                <label htmlFor="home-search" className="mb-1 block px-2 text-sm font-semibold">What are you looking for?</label>
                <Input id="home-search" name="q" type="search" maxLength={100} className="h-11 rounded-full bg-canvas px-4" placeholder="Photography, venues, catering…" />
              </div>
              <div className="min-w-0">
                <label htmlFor="home-location" className="mb-1 block px-2 text-sm font-semibold">Location</label>
                <Input id="home-location" name="location" maxLength={100} className="h-11 rounded-full bg-canvas px-4" placeholder="City or area" />
              </div>
              <Button type="submit" className="h-11 w-fit gap-2 px-5 sm:col-span-2"><Search aria-hidden="true" />Search services</Button>
            </Form>
          </div>
          <Reveal className="relative px-0 pb-5 sm:ps-7 sm:pe-5">
            <div className="relative aspect-[6/5] overflow-hidden rounded-t-[42%] rounded-b-[1.5rem] border-[5px] border-paper shadow-xl sm:aspect-[6/5] lg:aspect-[6/5.35]">
              <Image src="/wedding-editorial.webp" alt="A Bangladeshi bride and groom sharing a quiet moment at their wedding" fill preload
                sizes="(min-width: 1024px) 50vw, 95vw" className="object-cover object-[center_40%]" />
            </div>
            <div className="absolute bottom-0 end-0 w-[27%] min-w-22 max-w-40 rotate-6 rounded-3xl border border-line bg-paper p-1.5 shadow-lg">
              <div className="relative aspect-square overflow-hidden rounded-[1.2rem]">
                <Image src="/bloom/bouquet.webp" alt="A hand holding a pink wedding bouquet" fill sizes="160px" className="object-cover" />
              </div>
            </div>
            <Flower2 aria-hidden="true" className="absolute start-1 top-8 size-8 rotate-12 text-berry sm:size-11" />
          </Reveal>
        </div>
      </section>

      <section className="bg-canvas">
        <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-16">
          <h2 className="mb-6 font-display text-4xl font-extrabold tracking-tight sm:text-5xl">Browse by category</h2>
          <Reveal>
            <ul aria-label="Wedding service categories" className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-12 lg:gap-4">
              {categories.map(({ name }, index) => (
                <li key={name} className={index === 0 || index === 5 ? "lg:col-span-5" : index === 1 || index === 3 ? "lg:col-span-4" : "lg:col-span-3"}>
                  <Link href={`/services?${new URLSearchParams({ category: name })}`}
                    className="group relative isolate flex min-h-36 items-end overflow-hidden rounded-[1.4rem] bg-plum p-3 text-on-plum sm:min-h-48 sm:p-5 lg:min-h-55">
                    <Image src={`/bloom/${photographs[index]}.webp`} alt="" fill sizes="(min-width: 1024px) 40vw, (min-width: 640px) 33vw, 50vw"
                      className="-z-20 object-cover motion-safe:transition-transform motion-safe:duration-500 motion-safe:group-hover:scale-105" />
                    <span aria-hidden="true" className="absolute inset-0 -z-10 bg-linear-to-t from-overlay/95 via-overlay/35 to-transparent" />
                    <span className="flex w-full items-end justify-between gap-2 font-display text-lg font-extrabold leading-tight sm:text-2xl">{name}<ArrowUpRight size={18} className="shrink-0" aria-hidden="true" /></span>
                  </Link>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-16">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <h2 className="font-display text-4xl font-extrabold tracking-tight sm:text-5xl">Featured services</h2>
          <Link href="/services" className={cn(buttonVariants({ variant: "outline" }), "h-10 bg-paper px-4")}>See all services</Link>
        </div>
        <Suspense fallback={<SunflowerLoader label="Loading services…" />}><FeaturedServices /></Suspense>
      </section>

      <section className="bg-plum text-on-plum">
        <div className="mx-auto grid max-w-7xl items-center gap-8 px-5 py-12 sm:px-8 lg:grid-cols-[.8fr_1.2fr] lg:gap-12">
          <div className="relative aspect-[5/4] overflow-hidden rounded-[4rem_1.5rem_5rem_1.5rem] border-4 border-petal/60">
            <Image src="/bloom/venues.webp" alt="A Bengali wedding venue framed with flowers" fill sizes="(min-width: 1024px) 40vw, 90vw" className="object-cover" />
          </div>
          <div>
            <h2 className="mb-6 font-display text-4xl font-extrabold tracking-tight sm:text-5xl">Why Choose WedPlan</h2>
            <ul className="divide-y divide-on-plum/25">
              {benefits.map(({ title, text, Icon }) => <li key={title} className="flex gap-4 py-4">
                <Icon size={22} aria-hidden="true" className="mt-1 shrink-0 text-petal" />
                <div><h3 className="font-display text-2xl">{title}</h3><p className="mt-1 text-sm leading-relaxed text-on-plum/85">{text}</p></div>
              </li>)}
            </ul>
          </div>
        </div>
      </section>

      <section className="relative isolate bg-blush">
        <div aria-hidden="true" className="petal-pattern pointer-events-none absolute inset-0 -z-10 opacity-30" />
        <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-16">
          <h2 className="mb-7 text-center font-display text-4xl font-extrabold tracking-tight sm:text-5xl">How WedPlan Works</h2>
          <ol className="grid gap-4 sm:grid-cols-3">
            {steps.map(({ title, text }, index) => <li key={title} className="rounded-xl border border-line bg-paper p-5">
              <span aria-hidden="true" className="mb-3 grid size-8 place-items-center rounded-full bg-warning-surface text-sm font-semibold text-warning-ink">{index + 1}</span>
              <h3 className="font-display text-2xl">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{text}</p>
            </li>)}
          </ol>
        </div>
      </section>
    </main>
  );
}
