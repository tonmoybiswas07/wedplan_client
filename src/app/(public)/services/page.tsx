import { SunflowerLoader } from "@/components/ui/sunflower-loader";
import Image from "next/image";
import type { Metadata } from "next";
import Form from "next/form";
import Link from "next/link";
import { Suspense } from "react";
import { ResponsiveDrawer } from "@/components/ui/responsive-drawer";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { categories } from "@/components/public/categories";
import { ServiceGrid } from "@/components/public/service-grid";
import { readCatalog } from "@/lib/public-catalog";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Browse Wedding Services | WedPlan",
};

type Search = Promise<Record<string, string | string[] | undefined>>;

async function BrowseCatalog({ searchParams }: { searchParams: Search }) {
  const values = await searchParams;
  function text(name: string, limit: number) {
    return typeof values[name] === "string"
      ? values[name].trim().slice(0, limit)
      : "";
  }
  const q = text("q", 100);
  const category = text("category", 60);
  const location = text("location", 100);
  const minPrice = text("minPrice", 11);
  const maxPrice = text("maxPrice", 11);
  const sort =
    values.sort === "price-asc" || values.sort === "price-desc"
      ? values.sort
      : "newest";
  const page =
    typeof values.page === "string" && /^[1-9]\d{0,4}$/.test(values.page)
      ? Number(values.page)
      : 1;
  const filtered = q || category || location || minPrice || maxPrice || sort !== "newest";
  const select =
    "h-11 w-full rounded-md border border-input bg-paper px-3 text-sm focus-visible:outline-2 focus-visible:outline-ring";

  function query(pageNumber: number) {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (category) params.set("category", category);
    if (location) params.set("location", location);
    if (minPrice) params.set("minPrice", minPrice);
    if (maxPrice) params.set("maxPrice", maxPrice);
    if (sort !== "newest") params.set("sort", sort);
    if (pageNumber > 1) params.set("page", String(pageNumber));
    return params;
  }

  const filters = (prefix: string) => (
      <Form
        action="/services"
        key={query(page).toString()}
        className="grid items-end gap-4 workspace-panel lg:grid-cols-2"
      >
        <div>
          <label
            htmlFor={prefix + "-browse-search"}
            className="mb-1.5 block text-sm font-semibold"
          >
            Search services
          </label>
          <Input
            id={prefix + "-browse-search"}
            name="q"
            type="search"
            maxLength={100}
            defaultValue={q}
            placeholder="Name or keywords"
            className="h-11"
          />
        </div>
        <div>
          <label
            htmlFor={prefix + "-browse-category"}
            className="mb-1.5 block text-sm font-semibold"
          >
            Category
          </label>
          <select
            id={prefix + "-browse-category"}
            name="category"
            defaultValue={category}
            className={select}
          >
            <option value="">All categories</option>
            {categories.map(({ name }) => (
              <option key={name}>{name}</option>
            ))}
            {category && !categories.some(({ name }) => name === category) && (
              <option>{category}</option>
            )}
          </select>
        </div>
        <div>
          <label
            htmlFor={prefix + "-browse-location"}
            className="mb-1.5 block text-sm font-semibold"
          >
            Location
          </label>
          <Input
            id={prefix + "-browse-location"}
            name="location"
            maxLength={100}
            defaultValue={location}
            placeholder="e.g. Dhaka"
            className="h-11"
          />
        </div>
        <div>
          <label
            htmlFor={prefix + "-browse-sort"}
            className="mb-1.5 block text-sm font-semibold"
          >
            Sort by
          </label>
          <select
            id={prefix + "-browse-sort"}
            name="sort"
            defaultValue={sort}
            className={select}
          >
            <option value="newest">Newest first</option>
            <option value="price-asc">Price: low to high</option>
            <option value="price-desc">Price: high to low</option>
          </select>
        </div>
        {([["minPrice", "Minimum price (BDT)", minPrice], ["maxPrice", "Maximum price (BDT)", maxPrice]] as const).map(([key, label, value]) => (
          <div key={key}>
            <label htmlFor={`${prefix}-browse-${key}`} className="mb-1.5 block text-sm font-semibold">{label}</label>
            <Input id={`${prefix}-browse-${key}`} name={key} type="number" min="0" max="99999999.99" step="0.01" defaultValue={value} className="h-11" />
          </div>
        ))}
        <Button
          type="submit"
          className="h-11 px-4 sm:justify-self-start xl:justify-self-stretch"
        >
          Apply filters
        </Button>
      </Form>
  );

  return (
    <>
      <div className="lg:grid lg:items-start lg:gap-7 lg:grid-cols-[minmax(16rem,1fr)_minmax(0,3fr)]">
        <div className="mb-6 lg:hidden">
          <ResponsiveDrawer title="Filter services" kind="filters">{filters("mobile")}</ResponsiveDrawer>
          {filtered && <Link href="/services" className="ms-4 text-sm font-semibold underline underline-offset-4">Reset filters</Link>}
        </div>
        <aside className="hidden lg:sticky lg:top-23 lg:block" aria-label="Service filters">{filters("desktop")}</aside>
        <div className="min-w-0">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="font-display text-2xl">Service listings</h2>
            {filtered && (
              <Link
                href="/services"
                className="text-sm font-semibold underline underline-offset-4"
              >
                Clear filters
              </Link>
            )}
          </div>
          {filtered && <ul aria-label="Applied filters" className="mb-5 flex flex-wrap gap-2">
            {[q, category, location, minPrice && `From BDT ${minPrice}`, maxPrice && `Up to BDT ${maxPrice}`, sort === "price-asc" ? "Price: low to high" : sort === "price-desc" ? "Price: high to low" : ""]
              .filter(Boolean).map((item, index) => <li key={index} className="max-w-full break-words rounded-full bg-blush px-3 py-1 text-xs font-semibold">{item}</li>)}
          </ul>}
          <Suspense key={query(page).toString()} fallback={<SunflowerLoader label="Loading services…" />}>
            <BrowseResults
              query={query(page)}
              previous={page > 1 ? query(page - 1) : null}
              next={query(page + 1)}
              page={page}
            />
          </Suspense>
        </div>
      </div>
    </>
  );
}

async function BrowseResults({
  query,
  previous,
  next,
  page,
}: {
  query: URLSearchParams;
  previous: URLSearchParams | null;
  next: URLSearchParams;
  page: number;
}) {
  const min = query.get("minPrice");
  const max = query.get("maxPrice");
  if (min !== null && max !== null && Number(min) > Number(max)) {
    return <p role="alert" className="border border-line bg-paper p-6">Minimum price must be at or below maximum price.</p>;
  }
  const result = await readCatalog(query);
  if (!result)
    return (
      <div
        role="alert"
        className="border border-line bg-paper p-6"
      >
        <p>Services couldn’t be loaded right now.</p>
        {/* A normal navigation retries the backend request even when the URL stays the same. */}
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
        <a
          href={`/services?${query}`}
          className={cn(buttonVariants({ variant: "outline" }), "mt-3 px-3")}
        >
          Try again
        </a>
      </div>
    );
  return (
    <>
      {result.services.length ? (
        <ServiceGrid listings={result.services} compact />
      ) : (
        <div className="border border-dashed border-line bg-paper p-8 text-center">
          <h3 className="font-display text-2xl">No matching services</h3>
          <p className="mt-2 text-muted-foreground">
            Try another name, category, or location.
          </p>
        </div>
      )}
      {(previous || result.hasNext) && (
        <nav
          aria-label="Service results"
          className="mt-6 flex flex-wrap items-center gap-3"
        >
          {previous && (
            <Link
              href={`/services?${previous}`}
              className={buttonVariants({ variant: "outline" })}
            >
              Previous
            </Link>
          )}
          <span className="text-sm">Page {page}</span>
          {result.hasNext && (
            <Link
              href={`/services?${next}`}
              className={buttonVariants({ variant: "outline" })}
            >
              Next
            </Link>
          )}
        </nav>
      )}
    </>
  );
}

export default function BrowsePage({ searchParams }: { searchParams: Search }) {
  return (
    <main className="mx-auto min-h-[70svh] max-w-7xl px-4 py-10 sm:px-8 sm:py-14">
      <header className="mb-7 grid overflow-hidden rounded-[1.65rem] border border-line bg-blush sm:grid-cols-[1fr_minmax(9rem,29%)]">
        <div className="px-5 py-7 sm:px-8 sm:py-10">
          <h1 className="font-display text-4xl leading-tight tracking-tight text-ink sm:text-6xl">Browse wedding services</h1>
          <p className="mt-3 max-w-prose text-muted-foreground">Find wedding vendors by service, location, and starting price.</p>
        </div>
        <div className="relative hidden min-h-38 sm:block">
          <Image src="/bloom/florist.webp" alt="" fill sizes="30vw" className="object-cover" />
        </div>
      </header>
      <Suspense fallback={<SunflowerLoader label="Loading services…" />}>
        <BrowseCatalog searchParams={searchParams} />
      </Suspense>
    </main>
  );
}
