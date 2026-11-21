import type { ReactNode } from "react";
import { WedPlanToasts } from "@/components/ui/toasts";
import "../(auth)/invitation.css";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return <div className="invitation">{children}<WedPlanToasts /></div>;
}
