"use client";

import { deleteVendorService } from "./actions";
import { ServiceConfirmation } from "./confirm";

export function DeleteService({ id, title }: { id: string; title: string }) {
  return <ServiceConfirmation label="Delete" title={title} description="This listing will be removed from My Services."
    success="Service deleted." destructive mutate={() => deleteVendorService(id)} />;
}
