import { ArrowRight } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function NavigationCta({ href, children, className }: { href: string; children: ReactNode; className?: string }) {
  return <Link href={href} className={cn(buttonVariants(), "h-13 gap-3 ps-5 pe-1.5", className)}>
    {children}
    <span className="grid size-9 place-items-center rounded-full bg-arrow-inset text-arrow-ink">
      <ArrowRight aria-hidden="true" className="size-4 motion-safe:transition-transform motion-safe:group-hover/button:translate-x-0.5" />
    </span>
  </Link>;
}
