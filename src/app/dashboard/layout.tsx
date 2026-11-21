import type { ReactNode } from "react";
import "../(auth)/invitation.css";
import "./dashboard.css";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return <div className="invitation dashboard">{children}</div>;
}
