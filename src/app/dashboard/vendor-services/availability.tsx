"use client";

import { setServiceAvailability } from "./actions";
import { ServiceConfirmation } from "./confirm";
import type { VendorService } from "./model";

export function AvailabilityControl({
  id,
  title,
  status,
  isActive,
}: VendorService) {
  if (!isActive && status !== "approved") return null;

  return (
    <ServiceConfirmation
      label={isActive ? "Deactivate" : "Activate"}
      title={title}
      description={
        isActive
          ? "This listing will no longer be active."
          : "This approved listing will become active."
      }
      success={isActive ? "Service deactivated." : "Service activated."}
      mutate={() => setServiceAvailability(id, !isActive)}
    />
  );
}
