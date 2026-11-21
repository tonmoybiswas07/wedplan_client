import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import "./(auth)/invitation.css";

export default function NotFound() {
  return <main className="invitation grid place-items-center px-4 py-12">
    <section className="w-full max-w-xl border border-line bg-paper p-7 sm:p-10">
      <h1 className="font-display text-4xl">Page not found</h1>
      <p className="mt-3 text-muted-foreground">The address may have changed or the page is unavailable.</p>
      <Link href="/services" className={buttonVariants({ className: "mt-5 h-10 px-4" })}>Browse Services</Link>
    </section>
  </main>;
}
