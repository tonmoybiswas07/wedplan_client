"use client";

import { ActionConfirmation } from "@/components/ui/action-confirmation";
import type { ComponentProps } from "react";

export function ServiceConfirmation(props: Omit<ComponentProps<typeof ActionConfirmation>, "subject" | "errorMessage">) {
  return <ActionConfirmation {...props} subject="service" errorMessage="The service could not be updated. Try again." />;
}
