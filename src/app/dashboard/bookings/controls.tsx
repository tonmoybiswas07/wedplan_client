"use client";

import { ActionConfirmation } from "@/components/ui/action-confirmation";
import { changeBookingStatus } from "./actions";
import type { Booking, BookingAction, BookingRole } from "./model";

const actions = {
  accepted: { label: "Accept", description: "The booking status will be visible to the customer.", result: "Booking accepted." },
  rejected: { label: "Reject", description: "The request will close and the customer will see it as rejected.", result: "Booking rejected." },
  cancelled: { label: "Cancel", description: "The vendor will see this request as cancelled.", result: "Booking cancelled." },
} satisfies Record<BookingAction, { label: string; description: string; result: string }>;

export function BookingControls({ booking, role }: { booking: Pick<Booking, "id" | "status" | "service">; role: BookingRole }) {
  if (booking.status !== "pending") return null;

  const available: BookingAction[] = role === "customer" ? ["cancelled"] : ["accepted", "rejected"];
  return (
    <div className="flex flex-wrap gap-2">
      {available.map((status) => {
        const action = actions[status];
        return <ActionConfirmation key={status} label={action.label} title={booking.service.title} subject="booking"
          description={action.description} success={action.result} destructive={status !== "accepted"}
          errorMessage="The booking could not be updated. Try again." mutate={() => changeBookingStatus(booking.id, status)} />;
      })}
    </div>
  );
}
