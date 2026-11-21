import type { ReactNode } from "react";
import "../(auth)/invitation.css";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return <div className="invitation">{children}</div>;
}
