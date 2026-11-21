import type { ReactNode } from "react";
import { WedPlanToasts } from "@/components/ui/toasts";
import { SiteFooter, SiteHeader } from "@/components/public/site-layout";
import "../(auth)/invitation.css";

export default function PublicLayout({ children }: { children: ReactNode }) {
  return <div className="invitation"><SiteHeader />{children}<SiteFooter /><WedPlanToasts /></div>;
}
