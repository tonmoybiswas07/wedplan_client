import Image from "next/image";
import { WedPlanToasts } from "@/components/ui/toasts";
import { SiteFooter, SiteHeader } from "@/components/public/site-layout";
import type { ReactNode } from "react";
import "./invitation.css";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="invitation"><SiteHeader />
      <main className="invitation-shell">
        <div className="invitation-grid">
          <section className="invitation-panel" aria-labelledby="auth-heading">
            {children}
          </section>

          <figure className="invitation-photo">
            <div className="invitation-frame">
              <Image
                src="/wedding-invitation.webp"
                alt="A couple walking up a garden stairway on their wedding day"
                fill
                preload
                sizes="(min-width: 1100px) 470px, (min-width: 768px) 42vw, 90vw"
              />
            </div>
            <figcaption>For the day you’ll always remember.</figcaption>
          </figure>
        </div>
      </main>
      <SiteFooter /><WedPlanToasts />
    </div>
  );
}
