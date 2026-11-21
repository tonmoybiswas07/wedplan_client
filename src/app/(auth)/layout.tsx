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
            <div aria-hidden="true" className="alpana pointer-events-none absolute -inset-3 opacity-45" />
            <div className="invitation-frame">
              <Image
                src="/wedding-editorial.webp"
                alt="A Bangladeshi bride and groom at their wedding"
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
