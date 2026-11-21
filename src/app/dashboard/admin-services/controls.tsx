"use client";

import { ServiceConfirmation } from "../vendor-services/confirm";
import type { VendorService } from "../vendor-services/model";
import { moderateService } from "./actions";

export function ModerationControls({ id, title, status }: VendorService) {
  return (
    <div className="flex flex-wrap gap-2">
      {status !== "approved" && (
        <ServiceConfirmation
          label="Approve"
          title={title}
          description="The vendor can activate this listing after approval."
          success="Service approved."
          mutate={() => moderateService(id, "approved")}
        />
      )}
      {status !== "rejected" && (
        <ServiceConfirmation
          label="Reject"
          title={title}
          description="Rejection also deactivates the listing."
          success="Service rejected and deactivated."
          destructive
          mutate={() => moderateService(id, "rejected")}
        />
      )}
    </div>
  );
}
