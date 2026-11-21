import { SunflowerLoader } from "@/components/ui/sunflower-loader";
import Image from "next/image";
import type { Metadata } from "next";
import Form from "next/form";
import Link from "next/link";
import { Suspense } from "react";
import { 
  Search, 
  MapPin, 
  SlidersHorizontal, 
  Sparkles, 
  ArrowUpDown, 
  RotateCcw, 
  ChevronLeft, 
  ChevronRight,
  FilterX
} from "lucide-react";
import { ResponsiveDrawer } from "@/components/ui/responsive-drawer";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { categories } from "@/components/public/categories";
import { ServiceGrid } from "@/components/public/service-grid";
import { readCatalog } from "@/lib/public-catalog";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Browse Wedding Services | WedPlan",
  description: "Explore approved and verified wedding services across Bangladesh. Filter by category, location, and starting price.",
};

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

async function BrowseCatalog({ searchParams }: { searchParams: SearchParams }) {
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
  const filtered = Boolean(q || category || location || minPrice || maxPrice || sort !== "newest");
  
  const selectClass =
    "h-11 w-full rounded-xl border border-border bg-background px-3 text-sm focus-visible:outline-2 focus-visible:outline-ring";

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

  const filtersForm = (prefix: string) => (
    <Form
      action="/services"
      key={query(page).toString()}
      className="grid gap-5 rounded-2xl border border-border/80 bg-card p-6 shadow-sm"
    >
      <div className="flex items-center justify-between border-b border-border/70 pb-3">
        <h3 className="font-display text-lg font-bold text-foreground">Filter Directory</h3>
        {filtered && (
          <Link
            href="/services"
            className="flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
          >
            <RotateCcw size={12} /> Reset
          </Link>
        )}
      </div>

      {/* Keywords */}
      <div>
        <label
          htmlFor={prefix + "-browse-search"}
          className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground"
        >
          Service Keyword
        </label>
        <div className="relative">
          <Search size={15} className="absolute start-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            id={prefix + "-browse-search"}
            name="q"
            type="search"
            maxLength={100}
            defaultValue={q}
            placeholder="e.g. Cinematography"
            className="h-11 rounded-xl ps-9 text-sm"
          />
        </div>
      </div>

      {/* Category */}
      <div>
        <label
          htmlFor={prefix + "-browse-category"}
          className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground"
        >
          Service Category
        </label>
        <select
          id={prefix + "-browse-category"}
          name="category"
          defaultValue={category}
          className={selectClass}
        >
          <option value="">All Categories</option>
          {categories.map(({ name }) => (
            <option key={name} value={name}>{name}</option>
          ))}
          {category && !categories.some(({ name }) => name === category) && (
            <option value={category}>{category}</option>
          )}
        </select>
      </div>

      {/* Location */}
      <div>
        <label
          htmlFor={prefix + "-browse-location"}
          className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground"
        >
          Location / City
        </label>
        <div className="relative">
          <MapPin size={15} className="absolute start-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            id={prefix + "-browse-location"}
            name="location"
            maxLength={100}
            defaultValue={location}
            placeholder="e.g. Dhaka, Chittagong"
            className="h-11 rounded-xl ps-9 text-sm"
          />
        </div>
      </div>

      {/* Sort By */}
      <div>
        <label
          htmlFor={prefix + "-browse-sort"}
          className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground"
        >
          Sort Order
        </label>
        <select
          id={prefix + "-browse-sort"}
          name="sort"
          defaultValue={sort}
          className={selectClass}
        >
          <option value="newest">Newest First</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
        </select>
      </div>

      {/* Min & Max Price */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor={`${prefix}-browse-min`} className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Min (BDT)</label>
          <Input id={`${prefix}-browse-min`} name="minPrice" type="number" min="0" max="99999999" step="100" defaultValue={minPrice} placeholder="0" className="h-11 rounded-xl text-sm" />
        </div>
        <div>
          <label htmlFor={`${prefix}-browse-max`} className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Max (BDT)</label>
          <Input id={`${prefix}-browse-max`} name="maxPrice" type="number" min="0" max="99999999" step="100" defaultValue={maxPrice} placeholder="Any" className="h-11 rounded-xl text-sm" />
        </div>
      </div>

      <Button
        type="submit"
        className="h-11 w-full rounded-xl font-semibold shadow-sm"
      >
        Apply Filters
      </Button>
    </Form>
  );

  return (
    <div className="lg:grid lg:items-start lg:gap-8 lg:grid-cols-[minmax(18rem,1fr)_minmax(0,3fr)]">
      {/* Mobile Drawer Trigger */}
      <div className="mb-6 flex items-center justify-between lg:hidden">
        <ResponsiveDrawer title="Filter Services" kind="filters">
          {filtersForm("mobile")}
        </ResponsiveDrawer>
        {filtered && (
          <Link href="/services" className="text-xs font-semibold text-primary underline underline-offset-4">
            Reset all filters
          </Link>
        )}
      </div>

      {/* Desktop Sticky Sidebar */}
      <aside className="hidden lg:sticky lg:top-24 lg:block" aria-label="Service filters">
        {filtersForm("desktop")}
      </aside>

      {/* Results Column */}
      <div className="min-w-0">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3 border-b border-border/70 pb-4">
          <div>
            <h2 className="font-display text-2xl font-bold text-foreground">Available Services</h2>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Handpicked and approved wedding vendor listings
            </p>
          </div>
          {filtered && (
            <Link
              href="/services"
              className="flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-secondary/40"
            >
              <FilterX size={13} /> Clear Filters
            </Link>
          )}
        </div>

        {/* Active Filter Badges */}
        {filtered && (
          <div aria-label="Applied filters" className="mb-6 flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-muted-foreground">Filters:</span>
            {q && <span className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">Keyword: &ldquo;{q}&rdquo;</span>}
            {category && <span className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">{category}</span>}
            {location && <span className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">Location: {location}</span>}
            {minPrice && <span className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">Min ৳{minPrice}</span>}
            {maxPrice && <span className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">Max ৳{maxPrice}</span>}
            {sort === "price-asc" && <span className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">Price: Low to High</span>}
            {sort === "price-desc" && <span className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">Price: High to Low</span>}
          </div>
        )}

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
    return (
      <div role="alert" className="rounded-2xl border border-destructive/20 bg-destructive/10 p-6 text-center text-sm text-destructive">
        Minimum price cannot be greater than maximum price.
      </div>
    );
  }

  const result = await readCatalog(query);
  if (!result) {
    return (
      <div role="alert" className="rounded-2xl border border-border bg-card p-10 text-center">
        <p className="text-muted-foreground">Services directory is currently unavailable.</p>
        <a
          href={`/services?${query}`}
          className={cn(buttonVariants({ variant: "outline" }), "mt-4 rounded-full px-5 text-sm")}
        >
          Try Again
        </a>
      </div>
    );
  }

  return (
    <>
      {result.services.length ? (
        <ServiceGrid listings={result.services} compact />
      ) : (
        <div className="rounded-2xl border border-dashed border-border/80 bg-card p-12 text-center">
          <Sparkles className="mx-auto size-9 text-muted-foreground/60 mb-3" />
          <h3 className="font-display text-xl font-bold text-foreground">No Matching Services Found</h3>
          <p className="mt-2 text-sm text-muted-foreground max-w-sm mx-auto">
            We couldn&apos;t find any active listings matching your current criteria. Try adjusting your keyword, category, or location filter.
          </p>
          <Link
            href="/services"
            className={cn(buttonVariants({ variant: "outline", size: "sm" }), "mt-5 rounded-full px-5")}
          >
            Reset Filters
          </Link>
        </div>
      )}

      {/* Pagination */}
      {(previous || result.hasNext) && (
        <nav
          aria-label="Service directory pagination"
          className="mt-10 flex items-center justify-center gap-3 border-t border-border/60 pt-6"
        >
          {previous && (
            <Link
              href={`/services?${previous}`}
              className={cn(buttonVariants({ variant: "outline", size: "sm" }), "rounded-full px-4")}
            >
              <ChevronLeft size={15} className="mr-1" /> Previous
            </Link>
          )}
          <span className="rounded-full bg-secondary px-3.5 py-1 text-xs font-semibold text-secondary-foreground">
            Page {page}
          </span>
          {result.hasNext && (
            <Link
              href={`/services?${next}`}
              className={cn(buttonVariants({ variant: "outline", size: "sm" }), "rounded-full px-4")}
            >
              Next <ChevronRight size={15} className="ml-1" />
            </Link>
          )}
        </nav>
      )}
    </>
  );
}

export default function BrowsePage({ searchParams }: { searchParams: SearchParams }) {
  return (
    <main className="mx-auto min-h-[75svh] max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      {/* Editorial Header Banner */}
      <header className="relative mb-10 overflow-hidden rounded-3xl border border-border/80 bg-gradient-to-r from-secondary/50 via-background to-secondary/30 p-8 sm:p-12">
        <div className="relative z-10 max-w-2xl">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
            <Sparkles size={13} /> The WedPlan Collective
          </span>
          <h1 className="mt-3 font-display text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
            Browse Wedding Services
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
            Discover Bangladesh&apos;s most talented photographers, venues, floral stylists, and culinary teams. Filter by specialty, location, and pricing to find the right match for your wedding.
          </p>
        </div>
      </header>

      <Suspense fallback={<SunflowerLoader label="Loading wedding directory…" />}>
        <BrowseCatalog searchParams={searchParams} />
      </Suspense>
    </main>
  );
}
