"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import {
  CalendarDays, ChevronDown, CircleUserRound, CreditCard, Heart, LayoutGrid,
  LogOut, Menu, PackagePlus, ReceiptText, Store, Users, X,
} from "lucide-react";
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
    <Link href="/" aria-label="WedPlan home" className="inline-flex items-center gap-3 text-stationery-ivory">
      <span className="grid size-9 place-items-center rounded-full border border-stationery-blush/40">
        <Heart size={17} aria-hidden="true" />
      </span>
      <span className="font-stationery text-2xl font-semibold">WedPlan</span>
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
              "flex min-h-11 items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stationery-blush",
              section === item ? "bg-stationery-blush text-stationery-plum" : "text-stationery-ivory hover:bg-white/10",
            )}>
            <Icon size={17} aria-hidden="true" />
            {sections[item].label}
          </Link>
        );
      })}
    </nav>
  );
}

export function DashboardAccount({ name, role }: { name: string; role: DashboardRole }) {
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
        className="flex min-h-11 cursor-pointer list-none items-center gap-2 rounded-lg border border-stationery-line bg-stationery-paper px-2.5 text-stationery-plum focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stationery-rose [&::-webkit-details-marker]:hidden">
        <CircleUserRound size={20} aria-hidden="true" />
        <span className="hidden max-w-40 truncate text-sm font-medium sm:block">{name}</span>
        <ChevronDown size={15} aria-hidden="true" />
      </summary>
      <div className="absolute end-0 top-full z-20 mt-2 w-56 max-w-[80vw] rounded-lg border border-stationery-line bg-stationery-paper p-2 shadow-lg">
        <div className="border-b border-stationery-line px-2.5 py-2 text-sm">
          <p className="break-words font-semibold">{name}</p>
          <p className="text-muted-foreground">{dashboardRoles[role].label}</p>
        </div>
        <form action="/dashboard/sign-out" method="post" className="pt-1">
          <Button type="submit" variant="ghost" className="h-10 w-full justify-start gap-2 px-2.5 hover:bg-stationery-blush">
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
      <aside className="hidden bg-stationery-plum p-5 md:block lg:p-6">
        <div className="mb-5 border-b border-stationery-blush/30 pb-5"><Brand /></div>
        <DashboardLinks role={role} section={section} />
      </aside>
      <header className="col-span-full flex items-center justify-between bg-stationery-plum px-4 py-3 md:hidden">
        <Brand />
        <Button type="button" variant="ghost" size="icon" aria-label="Open dashboard menu"
          aria-haspopup="dialog" aria-controls="dashboard-drawer" onClick={() => drawer.current?.showModal()}
          className="size-11 border-stationery-blush/40 text-stationery-ivory hover:bg-white/10 hover:text-stationery-ivory">
          <Menu aria-hidden="true" />
        </Button>
      </header>
      <dialog id="dashboard-drawer" ref={drawer} aria-labelledby="drawer-heading"
        className="fixed inset-y-0 start-0 end-auto m-0 h-dvh max-h-none w-[min(85vw,21rem)] max-w-none overflow-auto bg-stationery-plum p-5 text-stationery-ivory backdrop:bg-stationery-plum/60">
        <div className="mb-5 flex items-center justify-between border-b border-stationery-blush/30 pb-4">
          <h2 id="drawer-heading" className="font-stationery text-2xl">Dashboard</h2>
          <Button type="button" variant="ghost" size="icon" aria-label="Close dashboard menu"
            onClick={() => drawer.current?.close()}
            className="size-11 text-stationery-ivory hover:bg-white/10 hover:text-stationery-ivory">
            <X aria-hidden="true" />
          </Button>
        </div>
        <DashboardLinks role={role} section={section} onNavigate={() => drawer.current?.close()} />
      </dialog>
    </>
  );
}
