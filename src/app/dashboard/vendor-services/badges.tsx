import { cn } from "@/lib/utils";
import type { VendorService } from "./model";

const approval = {
  pending: {
    label: "Pending approval",
    color: "bg-stationery-blush text-stationery-plum",
  },
  approved: { label: "Approved", color: "bg-green-100 text-green-900" },
  rejected: { label: "Rejected", color: "bg-red-100 text-red-900" },
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
      <span className="rounded-full border border-stationery-line px-2.5 py-1 text-xs font-medium">
        {isActive ? "Active" : "Inactive"}
      </span>
    </div>
  );
}
