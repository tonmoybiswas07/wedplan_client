"use client";

import { useState, useTransition } from "react";
import { CalendarCheck, Send, Sparkles } from "lucide-react";
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
    return error && <p id={`booking-${name}-error`} className="mt-1 text-xs text-destructive">{error}</p>;
  }

  return (
    <section aria-labelledby="booking-heading" className="rounded-2xl border border-border/80 bg-card p-6 shadow-sm">
      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary">
        <Sparkles size={14} /> Official Request
      </div>
      <h2 id="booking-heading" className="mt-1 font-display text-2xl font-bold text-foreground">
        Reserve This Service
      </h2>
      <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
        Send an inquiry with your wedding date and venue. The vendor will review and accept your booking.
      </p>

      {state?.ok ? (
        <div role="status" className="mt-5 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-emerald-800 dark:text-emerald-300">
          <div className="flex items-start gap-3">
            <CalendarCheck className="mt-0.5 size-5 shrink-0 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
            <div>
              <p className="font-semibold text-sm">Booking Request Submitted!</p>
              <p className="mt-0.5 text-xs opacity-90">
                Your request has been routed to the vendor&apos;s dashboard. You can track its status in your Customer Dashboard.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <form 
          method="post" 
          className="mt-5" 
          aria-busy={pending} 
          onSubmit={(event) => {
            event.preventDefault();
            const form = new FormData(event.currentTarget);
            setState(null);
            startTransition(async () => {
              try {
                const result = await requestBooking(serviceId, form);
                setState(result);
                if (result.ok) toast.success("Booking request sent successfully!");
                else toast.error(result.message);
              } catch {
                const message = "Your booking request could not be sent. Please try again.";
                setState({ ok: false, message });
                toast.error(message);
              }
            });
          }}
        >
          <fieldset disabled={pending} className="grid gap-4 disabled:opacity-70">
            <div>
              <label htmlFor="event-date" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Wedding / Event Date
              </label>
              <Input 
                id="event-date" 
                name="eventDate" 
                type="date" 
                min={earliestDate} 
                required 
                className="h-11 rounded-xl bg-background text-sm"
                aria-invalid={Boolean(errors?.eventDate)} 
                aria-describedby={errors?.eventDate ? "booking-eventDate-error" : undefined} 
              />
              {fieldError("eventDate")}
            </div>

            <div>
              <label htmlFor="event-location" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Event Location / Venue
              </label>
              <Input 
                id="event-location" 
                name="eventLocation" 
                type="text" 
                placeholder="e.g. Radisson Blu Ballroom, Dhaka" 
                minLength={2} 
                maxLength={160} 
                required
                className="h-11 rounded-xl bg-background text-sm" 
                aria-invalid={Boolean(errors?.eventLocation)}
                aria-describedby={errors?.eventLocation ? "booking-eventLocation-error" : undefined} 
              />
              {fieldError("eventLocation")}
            </div>

            <div>
              <label htmlFor="booking-message" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Additional Notes <span className="font-normal lowercase text-muted-foreground/70">(optional)</span>
              </label>
              <textarea 
                id="booking-message" 
                name="message" 
                rows={3} 
                maxLength={1000} 
                placeholder="Number of guests, special styling requirements, specific hours..."
                className="w-full rounded-xl border border-input bg-background p-3 text-sm outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20"
                aria-invalid={Boolean(errors?.message)} 
                aria-describedby={errors?.message ? "booking-message-error" : undefined} 
              />
              {fieldError("message")}
            </div>
          </fieldset>

          {state?.ok === false && (
            <p role="alert" className="mt-3 text-xs text-destructive font-medium">{state.message}</p>
          )}

          <Button 
            type="submit" 
            disabled={pending} 
            className="mt-5 h-11 w-full rounded-xl font-semibold shadow-sm"
          >
            {pending ? "Sending Inquiry…" : (
              <span className="flex items-center justify-center gap-1.5">
                <Send size={14} /> Send Booking Request
              </span>
            )}
          </Button>
        </form>
      )}
    </section>
  );
}
