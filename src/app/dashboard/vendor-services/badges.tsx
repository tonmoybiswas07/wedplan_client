import { cn } from "@/lib/utils";
import type { VendorService } from "./model";

const approval = {
  pending: {
    label: "Pending approval",
    color: "bg-warning-surface text-warning-ink",
  },
  approved: { label: "Approved", color: "bg-success-surface text-success-ink" },
  rejected: { label: "Rejected", color: "bg-danger-surface text-danger-ink" },
};

export function ServiceBadges({
  status,
  isActive,
}: Pick<VendorService, "status" | "isActive">) {
  return (
    <div className="flex flex-wrap gap-2">
      <span
        className={cn(
          "rounded-full px-2.5 py-1 text-xs font-semibold",
          approval[status].color,
        )}
      >
        {approval[status].label}
      </span>
      <span className="rounded-full border border-line px-2.5 py-1 text-xs font-medium">
        {isActive ? "Active" : "Inactive"}
      </span>
    </div>
  );
}
