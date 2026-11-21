"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import {
  CalendarDays, ChevronDown, CircleUserRound, CreditCard, Heart, LayoutGrid,
  LogOut, Menu, PackagePlus, ReceiptText, Store, Users, X,
} from "lucide-react";
import { AccountAvatar } from "@/components/ui/account-avatar";
import { ThemeSwitcher } from "@/components/ui/theme";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { dashboardPath, dashboardRoles, sections, type DashboardRole, type DashboardSection } from "./sections";

const icons = {
  overview: LayoutGrid,
  "my-bookings": CalendarDays,
  "profile-settings": CircleUserRound,
  "my-services": Store,
  "add-service": PackagePlus,
  "booking-requests": CalendarDays,
  subscription: CreditCard,
  "manage-users": Users,
  "manage-services": Store,
  transactions: ReceiptText,
};

function Brand() {
  return (
    <Link href="/" aria-label="WedPlan home" className="inline-flex items-center gap-3 text-on-olive">
      <span className="grid size-9 place-items-center rounded-full border border-sage/40">
        <Heart size={17} aria-hidden="true" />
      </span>
      <span className="font-editorial text-2xl font-semibold">WedPlan</span>
    </Link>
  );
}

function DashboardLinks({ role, section, onNavigate }: {
  role: DashboardRole;
  section: DashboardSection;
  onNavigate?: () => void;
}) {
  return (
    <nav aria-label="Dashboard" className="grid gap-1.5">
      {dashboardRoles[role].sections.map((item) => {
        const Icon = icons[item];
        return (
          <Link key={item} href={dashboardPath(role, item)} prefetch={false}
            onClick={onNavigate} aria-current={section === item ? "page" : undefined}
            className={cn(
              "flex min-h-11 items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sage",
              section === item ? "bg-sage text-ink" : "text-on-olive hover:bg-on-olive/10",
            )}>
            <Icon size={17} aria-hidden="true" />
            {sections[item].label}
          </Link>
        );
      })}
    </nav>
  );
}

export function DashboardAccount({ name, role, image, align = "end" }: { name: string; role: DashboardRole; image?: string; align?: "start" | "end" }) {
  const details = useRef<HTMLDetailsElement>(null);
  const trigger = useRef<HTMLElement>(null);

  useEffect(() => {
    const closeOutside = (event: PointerEvent) => {
      if (event.target instanceof Node && !details.current?.contains(event.target) && details.current) {
        details.current.open = false;
      }
    };
    document.addEventListener("pointerdown", closeOutside);
    return () => document.removeEventListener("pointerdown", closeOutside);
  }, []);

  return (
    <details ref={details} className="relative shrink-0" onKeyDown={(event) => {
      if (event.key === "Escape" && details.current?.open) {
        details.current.open = false;
        trigger.current?.focus();
      }
    }}>
      <summary ref={trigger} aria-label="Account menu"
        className="flex min-h-11 cursor-pointer list-none items-center gap-2 rounded-lg border border-line bg-paper px-2.5 text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-earth [&::-webkit-details-marker]:hidden">
        <AccountAvatar image={image} />
        <span className={cn("max-w-40 truncate text-sm font-medium", align === "end" && "hidden sm:block")}>{name}</span>
        <ChevronDown size={15} aria-hidden="true" />
      </summary>
      <div className={cn("absolute top-full z-20 mt-2 w-56 max-w-[75vw] rounded-lg border border-line bg-paper p-2 shadow-lg", align === "start" ? "start-0" : "end-0")}>
        <div className="border-b border-line px-2.5 py-2 text-sm">
          <p className="break-words font-semibold">{name}</p>
          <p className="text-muted-foreground">{dashboardRoles[role].label}</p>
        </div>
        <nav aria-label="Account" className="grid gap-1 pt-1">
          <Link href="/dashboard" prefetch={false} onClick={() => details.current?.removeAttribute("open")}
            className="rounded-md px-2.5 py-2 text-sm hover:bg-sage">Dashboard</Link>
          <Link href={dashboardPath(role, "profile-settings")} prefetch={false} onClick={() => details.current?.removeAttribute("open")}
            className="rounded-md px-2.5 py-2 text-sm hover:bg-sage">Profile Settings</Link>
        </nav>
        <form action="/dashboard/sign-out" method="post" className="pt-1">
          <Button type="submit" variant="ghost" className="h-10 w-full justify-start gap-2 px-2.5 hover:bg-sage">
            <LogOut size={16} aria-hidden="true" /> Sign Out
          </Button>
        </form>
      </div>
    </details>
  );
}

export function DashboardNavigation({ role, section }: { role: DashboardRole; section: DashboardSection }) {
  const drawer = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 48rem)");
    const closeOnDesktop = () => { if (desktop.matches) drawer.current?.close(); };
    desktop.addEventListener("change", closeOnDesktop);
    return () => desktop.removeEventListener("change", closeOnDesktop);
  }, []);

  return (
    <>
      <aside className="hidden bg-olive p-5 md:block lg:p-6">
        <div className="mb-5 border-b border-sage/30 pb-5"><Brand /></div>
        <DashboardLinks role={role} section={section} />
      </aside>
      <header className="col-span-full flex items-center justify-between bg-olive px-4 py-3 md:hidden">
        <Brand />
        <Button type="button" variant="ghost" size="icon" aria-label="Open dashboard menu"
          aria-haspopup="dialog" aria-controls="dashboard-drawer" onClick={() => drawer.current?.showModal()}
          className="size-11 border-sage/40 text-on-olive hover:bg-on-olive/10 hover:text-on-olive">
          <Menu aria-hidden="true" />
        </Button>
      </header>
      <dialog id="dashboard-drawer" ref={drawer} aria-labelledby="drawer-heading"
        className="fixed inset-y-0 start-0 end-auto m-0 h-dvh max-h-none w-[min(85vw,21rem)] max-w-none overflow-auto bg-olive p-5 text-on-olive backdrop:bg-overlay/60">
        <div className="mb-5 flex items-center justify-between border-b border-sage/30 pb-4">
          <h2 id="drawer-heading" className="font-editorial text-2xl">Dashboard</h2>
          <Button type="button" variant="ghost" size="icon" aria-label="Close dashboard menu"
            onClick={() => drawer.current?.close()}
            className="size-11 text-on-olive hover:bg-on-olive/10 hover:text-on-olive">
            <X aria-hidden="true" />
          </Button>
        </div>
        <DashboardLinks role={role} section={section} onNavigate={() => drawer.current?.close()} />
        <div className="mt-5"><ThemeSwitcher /></div>
      </dialog>
    </>
  );
}
