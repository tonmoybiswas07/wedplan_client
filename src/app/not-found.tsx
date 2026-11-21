import { Flower2 } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import "./(auth)/invitation.css";

export default function NotFound() {
  return <main className="invitation grid place-items-center bg-[var(--hero-wash)] px-4 py-12">
    <section className="workspace-panel w-full max-w-xl text-center sm:p-10">
      <Flower2 aria-hidden="true" className="mx-auto mb-5 size-9 text-berry" />
      <h1 className="font-display text-4xl">Page not found</h1>
      <p className="mt-3 text-muted-foreground">The address may have changed or the page is unavailable.</p>
      <Link href="/services" className={buttonVariants({ className: "mt-5 h-10 px-4" })}>Browse Services</Link>
    </section>
  </main>;
}
