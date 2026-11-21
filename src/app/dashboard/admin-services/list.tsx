import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { fetchDashboardApi } from "@/lib/dashboard-api";
import { cn } from "@/lib/utils";
import { ServiceBadges } from "../vendor-services/badges";
import type { VendorService } from "../vendor-services/model";
import { ModerationControls } from "./controls";

const path = "/dashboard/admin/manage-services";
const statuses = {
  pending: "Pending",
  approved: "Approved",
  rejected: "Rejected",
} as const;

export type DashboardSearch = Record<string, string | string[] | undefined>;

export async function AdminServiceList({
  search,
}: {
  search: Promise<DashboardSearch>;
}) {
  const params = await search;
  const q = typeof params.q === "string" ? params.q.trim().slice(0, 100) : "";
  const status =
    typeof params.status === "string" && Object.hasOwn(statuses, params.status)
      ? params.status
      : "";
  const page =
    typeof params.page === "string" && /^[1-9]\d{0,5}$/.test(params.page)
      ? Number(params.page)
      : 1;

  function query(pageNumber: number) {
    const query = new URLSearchParams({ page: String(pageNumber) });
    if (q) query.set("q", q);
    if (status) query.set("status", status);
    return query;
  }

  const response = await fetchDashboardApi(
    "admin",
    `/api/admin/services?${query(page)}`,
  );
  const result = response.ok
    ? ((await response.json()) as {
        services: VendorService[];
        hasNext: boolean;
      })
    : null;
  return (
    <div className="grid gap-5">
      <form
        action={path}
        className="flex flex-wrap items-end gap-3 border border-line bg-paper p-4"
      >
        <div className="min-w-0 flex-1 basis-52">
          <label
            htmlFor="service-search"
            className="mb-1 block text-sm font-semibold"
          >
            Search services
          </label>
          <Input
            id="service-search"
            name="q"
            type="search"
            maxLength={100}
            defaultValue={q}
            placeholder="Name, category, or description"
            className="h-10"
          />
        </div>
        <div>
          <label
            htmlFor="service-status"
            className="mb-1 block text-sm font-semibold"
          >
            Approval status
          </label>
          <select
            id="service-status"
            name="status"
            defaultValue={status}
            className="h-10 rounded-md border border-input bg-paper px-3 text-sm focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value="">All statuses</option>
            {Object.entries(statuses).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
        <Button type="submit" className="h-10 px-4">
          Apply filters
        </Button>
        {(q || status) && (
          <Link
            href={path}
            className={cn(buttonVariants({ variant: "ghost" }), "h-10 px-3")}
          >
            Clear
          </Link>
        )}
      </form>
      {!result ? (
        <p role="alert">
          Services could not be loaded. Refresh the page to try again.
        </p>
      ) : result.services.length === 0 ? (
        <p className="border border-dashed border-line bg-paper p-8 text-center text-muted-foreground">
          No services match these filters.
        </p>
      ) : (
        <ul className="grid gap-3">
          {result.services.map((service) => (
            <li
              key={service.id}
              className="border border-line bg-paper p-1"
            >
              <article className="grid gap-4 border border-line/65 p-4 sm:p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="break-words text-sm font-medium text-berry">
                      {service.category}
                    </p>
                    <h2 className="break-words font-display text-2xl">
                      {service.title}
                    </h2>
                  </div>
                  <ServiceBadges
                    status={service.status}
                    isActive={service.isActive}
                  />
                </div>
                <p className="whitespace-pre-wrap break-words text-sm text-muted-foreground">
                  {service.description}
                </p>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="text-sm font-semibold">
                    BDT {(service.priceMinor / 100).toLocaleString("en-BD")}
                  </p>
                  {service.imageUrl && (
                    <a
                      href={service.imageUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm underline"
                    >
                      View photo
                    </a>
                  )}
                  <ModerationControls {...service} />
                </div>
              </article>
            </li>
          ))}
        </ul>
      )}
      {result && (page > 1 || result.hasNext) && (
        <nav aria-label="Service results" className="flex items-center gap-3">
          {page > 1 && (
            <Link
              href={`${path}?${query(page - 1)}`}
              className={buttonVariants({ variant: "outline" })}
            >
              Previous
            </Link>
          )}
          <span className="text-sm">Page {page}</span>
          {result.hasNext && (
            <Link
              href={`${path}?${query(page + 1)}`}
              className={buttonVariants({ variant: "outline" })}
            >
              Next
            </Link>
          )}
        </nav>
      )}
    </div>
  );
}
