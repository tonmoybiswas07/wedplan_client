"use client";

import { useState, useTransition } from "react";
import { CalendarCheck } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { requestBooking, type BookingState } from "./booking-action";

export function BookingForm({ serviceId, earliestDate }: { serviceId: string; earliestDate: string }) {
  const [state, setState] = useState<BookingState | null>(null);
  const [pending, startTransition] = useTransition();
  const errors = state?.ok === false ? state.errors : undefined;

  function fieldError(name: "eventDate" | "eventLocation" | "message") {
    const error = errors?.[name]?.[0];
    return error && <p id={`booking-${name}-error`} className="mt-1 text-sm text-destructive">{error}</p>;
  }

  return (
    <section aria-labelledby="booking-heading" className="border border-line bg-paper p-1">
      <div className="border border-line/65 p-5 sm:p-6">
        <h2 id="booking-heading" className="font-editorial text-3xl text-ink">Request a booking</h2>
        {state?.ok ? (
          <div role="status" className="mt-4 flex items-start gap-3 bg-sage/60 p-4">
            <CalendarCheck className="mt-0.5 size-5 shrink-0 text-earth" aria-hidden="true" />
            <div>
              <p className="font-semibold">Request sent</p>
              <p className="mt-1 text-sm text-muted-foreground">Your request is pending vendor review.</p>
            </div>
          </div>
        ) : (
          <>
            <p className="mt-2 text-sm text-muted-foreground">Share your event date and location with the vendor.</p>
            <form method="post" className="mt-5" aria-busy={pending} onSubmit={(event) => {
              event.preventDefault();
              const form = new FormData(event.currentTarget);
              setState(null);
              startTransition(async () => {
                try {
                  const result = await requestBooking(serviceId, form);
                  setState(result);
                  if (result.ok) toast.success("Booking request sent.");
                  else toast.error(result.message);
                } catch {
                  const message = "Your request could not be sent. Try again.";
                  setState({ ok: false, message });
                  toast.error(message);
                }
              });
            }}>
              <fieldset disabled={pending} className="grid min-w-0 gap-4 disabled:opacity-70">
                <div className="min-w-0">
                  <label htmlFor="event-date" className="mb-1.5 block text-sm font-semibold">Event date</label>
                  <Input id="event-date" name="eventDate" type="date" min={earliestDate} required className="h-11 max-w-full bg-paper"
                    aria-invalid={Boolean(errors?.eventDate)} aria-describedby={errors?.eventDate ? "booking-eventDate-error" : undefined} />
                  {fieldError("eventDate")}
                </div>
                <div>
                  <label htmlFor="event-location" className="mb-1.5 block text-sm font-semibold">Event location</label>
                  <Input id="event-location" name="eventLocation" type="text" placeholder="Venue or city" minLength={2} maxLength={160} required
                    className="h-11 bg-paper" aria-invalid={Boolean(errors?.eventLocation)}
                    aria-describedby={errors?.eventLocation ? "booking-eventLocation-error" : undefined} />
                  {fieldError("eventLocation")}
                </div>
                <div>
                  <label htmlFor="booking-message" className="mb-1.5 block text-sm font-semibold">Message <span className="font-normal text-muted-foreground">(optional)</span></label>
                  <textarea id="booking-message" name="message" rows={4} maxLength={1000} placeholder="Tell the vendor a little about your event."
                    className="w-full rounded-md border border-input bg-paper px-3 py-2 outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/40 aria-invalid:border-destructive"
                    aria-invalid={Boolean(errors?.message)} aria-describedby={errors?.message ? "booking-message-error" : undefined} />
                  {fieldError("message")}
                </div>
              </fieldset>
              {state?.ok === false && <p role="alert" className="mt-4 text-sm text-destructive">{state.message}</p>}
              <Button type="submit" disabled={pending} className="mt-5 h-11 w-full px-4">{pending ? "Sending request…" : "Send booking request"}</Button>
            </form>
          </>
        )}
      </div>
    </section>
  );
}
