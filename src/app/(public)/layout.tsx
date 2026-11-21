import { Suspense, type ReactNode } from "react";
import Link from "next/link";
import { Heart } from "lucide-react";
import { PublicAccountLink } from "./account-link";
import "../(auth)/invitation.css";

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="invitation">
      <header className="border-b border-stationery-line bg-stationery-ivory">
        <div className="mx-auto flex min-h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:px-8">
          <Link href="/" className="invitation-brand shrink-0">
            <span className="invitation-mark hidden sm:grid">
              <Heart size={16} aria-hidden="true" />
            </span>
            WedPlan
          </Link>
          <nav
            aria-label="Main navigation"
            className="flex items-center gap-3 text-sm sm:gap-6"
          >
            <Link href="/services" className="font-medium hover:underline">
              Browse Services
            </Link>
            <Suspense fallback={<span className="h-9 w-14" aria-hidden="true" />}>
              <PublicAccountLink />
            </Suspense>
          </nav>
        </div>
      </header>
      {children}
      <footer className="border-t border-stationery-line bg-stationery-paper">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-8 sm:px-8">
          <Link href="/" className="font-stationery text-2xl font-semibold">
            WedPlan
          </Link>
          <Link
            href="/services"
            className="text-sm font-medium underline-offset-4 hover:underline"
          >
            Browse Wedding Services
          </Link>
        </div>
      </footer>
    </div>
  );
}
