"use client";

import { ActionConfirmation } from "@/components/ui/action-confirmation";
import { changeAccountStatus } from "./actions";
import type { AdminUser } from "./model";

export function AccountControls({ user }: { user: AdminUser }) {
  return (
    <ActionConfirmation
      label={user.blocked ? "Unblock" : "Block"}
      title={user.name}
      subject="account"
      description={user.blocked
        ? "This account will regain access to protected pages and actions."
        : "This account will lose access to protected pages and actions, even if it’s already signed in."}
      success={user.blocked ? "Account unblocked." : "Account blocked."}
      errorMessage="The account could not be updated. Try again."
      destructive={!user.blocked}
      mutate={() => changeAccountStatus(user.id, !user.blocked)}
    />
  );
}
