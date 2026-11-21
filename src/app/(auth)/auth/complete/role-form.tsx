"use client";

import { useActionState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { chooseAccountRole } from "./actions";

export function RoleForm({ returnTo }: { returnTo?: string }) {
  const [state, action, pending] = useActionState(chooseAccountRole, {});
  useEffect(() => {
    if (state.destination) window.location.replace(state.destination);
  }, [state.destination]);

  return (
    <form action={action} className="invitation-form">
      {returnTo && <input type="hidden" name="returnTo" value={returnTo} />}
      <fieldset disabled={pending} className="invitation-roles">
        <legend>Account type</legend>
        <div className="invitation-role-grid">
          <label className="invitation-role">
            <input type="radio" name="role" value="customer" required />
            Customer
          </label>
          <label className="invitation-role">
            <input type="radio" name="role" value="vendor" required />
            Vendor
          </label>
        </div>
      </fieldset>
      {state.message && (
        <p role="alert" className="invitation-error">
          {state.message}
        </p>
      )}
      <Button type="submit" className="invitation-submit" disabled={pending}>
        {pending ? "Saving…" : "Continue"}
      </Button>
    </form>
  );
}
