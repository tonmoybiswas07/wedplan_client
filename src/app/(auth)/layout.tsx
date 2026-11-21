import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";
import type { ReactNode } from "react";
import "./invitation.css";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <main className="invitation">
      <div className="invitation-shell">
        <header className="invitation-header">
          <Link href="/" className="invitation-brand">
            <span className="invitation-mark"><Heart size={16} aria-hidden="true" /></span>
            WedPlan
          </Link>
        </header>

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
      </div>
    </main>
  );
}
