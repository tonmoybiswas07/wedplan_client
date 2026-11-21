import Image from "next/image";
import { WedPlanToasts } from "@/components/ui/toasts";
import { SiteFooter, SiteHeader } from "@/components/public/site-layout";
import type { ReactNode } from "react";
import "./invitation.css";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="invitation flex min-h-screen flex-col">
      <SiteHeader />
      <main className="invitation-shell flex-1">
        <div className="invitation-grid">
          <section className="invitation-panel" aria-labelledby="auth-heading">
            {children}
          </section>

          <figure className="invitation-photo">
            <div className="invitation-frame">
              <Image
                src="/bloom/styling.webp"
                alt="A stylist preparing bridal makeup and attire"
                fill
                priority
                sizes="(min-width: 1100px) 470px, (min-width: 768px) 42vw, 90vw"
              />
            </div>
            <figcaption>✨ Discover & reserve your dream wedding team on WedPlan.</figcaption>
          </figure>
        </div>
      </main>
      <SiteFooter />
      <WedPlanToasts />
    </div>
  );
}
