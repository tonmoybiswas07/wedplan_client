import Link from "next/link";
import { CalendarDays, ImageIcon } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { fetchDashboardApi } from "@/lib/dashboard-api";
import { cn } from "@/lib/utils";
import { BookingControls } from "./controls";
import { bookingsPath, type Booking, type BookingRole, type BookingStatus } from "./model";

const statuses: Record<BookingStatus, { label: string; style: string }> = {
  pending: { label: "Pending", style: "bg-warning-surface text-warning-ink" },
  accepted: { label: "Accepted", style: "bg-success-surface text-success-ink" },
  confirmed: { label: "Confirmed", style: "bg-success-surface text-success-ink" },
  completed: { label: "Completed", style: "bg-success-surface text-success-ink" },
  rejected: { label: "Rejected", style: "bg-danger-surface text-danger-ink" },
  cancelled: { label: "Cancelled", style: "bg-canvas text-muted-foreground" },
};
const eventFormat = new Intl.DateTimeFormat("en-BD", { dateStyle: "medium", timeZone: "UTC" });
const requestFormat = new Intl.DateTimeFormat("en-BD", { dateStyle: "medium", timeZone: "Asia/Dhaka" });

function BookingStatusBadge({ status }: { status: BookingStatus }) {
  const badge = statuses[status];
  return <span className={cn("inline-flex w-fit rounded-full border border-line/60 px-3 py-1 text-xs font-semibold", badge.style)}>
    {badge.label}
  </span>;
}

function BookingCard({ booking, role, details = false }: { booking: Booking; role: BookingRole; details?: boolean }) {
  return (
    <article className="min-w-0 border border-line bg-paper p-1 shadow-sm">
      <div className="grid min-w-0 gap-4 border border-line/65 p-4 sm:grid-cols-[10rem_minmax(0,1fr)] sm:p-5">
        <div className="grid aspect-[4/3] w-full place-items-center overflow-hidden border border-line/60 bg-blush/50 text-berry">
          {booking.service.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element -- Service images are stored as ImgBB URLs.
            <img src={booking.service.imageUrl} alt="" loading="lazy" className="size-full object-cover" />
          ) : <ImageIcon aria-hidden="true" className="size-6" />}
        </div>
        <div className="min-w-0">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <h2 className="break-words font-display text-2xl">{booking.service.title}</h2>
            <BookingStatusBadge status={booking.status} />
          </div>
          <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
            <div><dt className="text-muted-foreground">Event date</dt>
              <dd className="font-medium"><time dateTime={booking.eventDate}>{eventFormat.format(new Date(booking.eventDate))}</time></dd></div>
            <div><dt className="text-muted-foreground">Event location</dt><dd className="break-words font-medium">{booking.eventLocation}</dd></div>
            <div><dt className="text-muted-foreground">Request date</dt>
              <dd className="font-medium"><time dateTime={booking.createdAt}>{requestFormat.format(new Date(booking.createdAt))}</time></dd></div>
            <div><dt className="text-muted-foreground">{role === "customer" ? "Vendor" : "Customer"}</dt>
              <dd className="break-words font-medium">{booking.contact.name}
                {booking.contact.email && <span className="block text-sm font-normal">{booking.contact.email}</span>}
              </dd></div>
          </dl>
          {role === "vendor" && (
            <div className="mt-4 border-t border-line/65 pt-3 text-sm">
              <p className="font-semibold">Customer message</p>
              <p className={cn("mt-1 whitespace-pre-wrap break-words text-muted-foreground", !details && "line-clamp-2")}>
                {booking.message || "No message provided."}
              </p>
            </div>
          )}
          <div className="mt-4 flex flex-wrap gap-2">
            {!details && <Link href={bookingsPath(role, booking.id)} className={cn(buttonVariants({ variant: "outline" }), "h-9 px-3")}
              aria-label={`View details for ${booking.service.title}`}>View details</Link>}
            <BookingControls booking={booking} role={role} />
          </div>
        </div>
      </div>
    </article>
  );
}

function BookingError({ message }: { message: string }) {
  return <p role="alert" className="workspace-panel text-sm">{message}</p>;
}

export function BookingLoading() {
  return <p role="status" className="workspace-panel text-sm text-muted-foreground motion-safe:animate-pulse">Loading bookings…</p>;
}

export async function BookingList({ role, search }: { role: BookingRole; search: Promise<{ page?: string | string[] }> }) {
  const { page: requestedPage } = await search;
  const page = typeof requestedPage === "string" && /^[1-9]\d{0,5}$/.test(requestedPage) ? Number(requestedPage) : 1;
  const response = await fetchDashboardApi(role, `/api/bookings?page=${page}`);
  if (!response.ok) return <BookingError message="Bookings could not be loaded. Refresh the page to try again." />;

  const result = await response.json() as { bookings: Booking[]; hasNext: boolean };
  const path = bookingsPath(role);
  return (
    <div className="grid gap-5">
      {result.bookings.length ? (
        <ul className="grid gap-4">{result.bookings.map((booking) => <li key={booking.id}><BookingCard role={role} booking={booking} /></li>)}</ul>
      ) : (
        <div className="border border-dashed border-line bg-paper p-8 text-center">
          <CalendarDays aria-hidden="true" className="mx-auto mb-3 text-berry" />
          <h2 className="font-display text-2xl">{page > 1 ? "No bookings on this page" : role === "customer" ? "No bookings yet" : "No booking requests yet"}</h2>
          {page === 1 && role === "customer" && <Link href="/services" className={cn(buttonVariants(), "mt-4 h-9 px-3")}>Browse Services</Link>}
        </div>
      )}
      {(page > 1 || result.hasNext) && <nav aria-label="Booking results" className="flex items-center gap-3">
        {page > 1 && <Link href={`${path}?page=${page - 1}`} className={buttonVariants({ variant: "outline" })}>Previous</Link>}
        <span className="text-sm">Page {page}</span>
        {result.hasNext && <Link href={`${path}?page=${page + 1}`} className={buttonVariants({ variant: "outline" })}>Next</Link>}
      </nav>}
    </div>
  );
}

export async function BookingDetails({ role, id }: { role: BookingRole; id: string }) {
  const response = /^[\da-f]{24}$/i.test(id) ? await fetchDashboardApi(role, `/api/bookings/${id}`) : null;
  const result = response?.ok ? await response.json() as { booking: Booking } : null;
  return (
    <div className="grid gap-5">
      <Link href={bookingsPath(role)} className="w-fit text-sm font-semibold underline underline-offset-4">
        {role === "customer" ? "Back to My Bookings" : "Back to Booking Requests"}
      </Link>
      {result ? <BookingCard role={role} booking={result.booking} details /> : <BookingError message={!response || response.status === 404
        ? "This booking could not be found." : "Booking details could not be loaded. Refresh the page to try again."} />}
    </div>
  );
}
