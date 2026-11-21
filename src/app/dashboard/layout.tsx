import type { ReactNode } from "react";
import { DashboardToasts } from "./vendor-services/toasts";
import "../(auth)/invitation.css";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return <div className="invitation">{children}<DashboardToasts /></div>;
}
