"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import {
  CalendarDays, ChevronDown, CircleUserRound, CreditCard, Heart, LayoutGrid,
  LogOut, Menu, PackagePlus, ReceiptText, Store, Users, X, ArrowLeft
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
    <Link href="/" aria-label="WedPlan home" className="group inline-flex items-center gap-2.5">
      <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm transition-transform group-hover:scale-105">
        <Heart size={18} className="fill-current" aria-hidden="true" />
      </span>
      <div className="flex flex-col">
        <span className="font-display text-2xl font-bold tracking-tight text-foreground">
          Wed<span className="text-primary font-normal italic">Plan</span>
        </span>
      </div>
    </Link>
  );
}

function DashboardLinks({ role, section, onNavigate }: {
  role: DashboardRole;
  section: DashboardSection;
  onNavigate?: () => void;
}) {
  return (
    <nav aria-label="Dashboard navigation" className="grid gap-1">
      {dashboardRoles[role].sections.map((item) => {
        const Icon = icons[item];
        const isActive = section === item;
        return (
          <Link 
            key={item} 
            href={dashboardPath(role, item)} 
            prefetch={false}
            onClick={onNavigate} 
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "flex min-h-11 items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
              isActive 
                ? "bg-primary text-primary-foreground font-semibold shadow-sm" 
                : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground",
            )}
          >
            <Icon size={18} aria-hidden="true" className={isActive ? "text-primary-foreground" : "text-muted-foreground"} />
            <span>{sections[item].label}</span>
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
        className="flex min-h-10 cursor-pointer list-none items-center gap-2.5 rounded-full border border-border bg-card px-3 py-1.5 text-foreground shadow-sm transition-colors hover:border-primary/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary [&::-webkit-details-marker]:hidden">
        <AccountAvatar image={image} />
        <span className={cn("max-w-40 truncate text-xs font-semibold", align === "end" && "hidden sm:block")}>{name}</span>
        <ChevronDown size={14} className="text-muted-foreground" aria-hidden="true" />
      </summary>
      <div className={cn("absolute top-full z-30 mt-2 w-56 max-w-[80vw] rounded-2xl border border-border bg-card p-2 shadow-xl backdrop-blur-md", align === "start" ? "start-0" : "end-0")}>
        <div className="border-b border-border/70 px-3 py-2 text-xs">
          <p className="truncate font-bold text-foreground">{name}</p>
          <p className="text-primary font-medium mt-0.5 capitalize">{dashboardRoles[role].label} Account</p>
        </div>
        <nav aria-label="Account links" className="grid gap-1 pt-1.5">
          <Link href="/dashboard" prefetch={false} onClick={() => details.current?.removeAttribute("open")}
            className="rounded-xl px-3 py-2 text-xs font-medium text-foreground hover:bg-secondary transition-colors">Dashboard Overview</Link>
          <Link href={dashboardPath(role, "profile-settings")} prefetch={false} onClick={() => details.current?.removeAttribute("open")}
            className="rounded-xl px-3 py-2 text-xs font-medium text-foreground hover:bg-secondary transition-colors">Profile Settings</Link>
        </nav>
        <form action="/dashboard/sign-out" method="post" className="border-t border-border/70 pt-1.5 mt-1.5">
          <Button type="submit" variant="ghost" className="h-9 w-full justify-start gap-2 rounded-xl px-3 text-xs text-destructive hover:bg-destructive/10 hover:text-destructive">
            <LogOut size={14} aria-hidden="true" /> Sign Out
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
      <aside className="hidden border-e border-border bg-card md:block">
        <div className="sticky top-0 flex min-h-svh flex-col justify-between p-5">
          <div>
            <div className="mb-6 border-b border-border/70 pb-5">
              <Brand />
            </div>
            
            <div className="mb-3 px-3">
              <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-bold text-primary uppercase tracking-wider">
                {dashboardRoles[role].label} Space
              </span>
            </div>

            <DashboardLinks role={role} section={section} />
          </div>

          <div className="border-t border-border/70 pt-4">
            <Link 
              href="/" 
              className="flex min-h-10 items-center gap-2 rounded-xl px-3 text-xs font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              <ArrowLeft size={15} /> Back to Public Site
            </Link>
          </div>
        </div>
      </aside>

      <header className="col-span-full flex items-center justify-between border-b border-border bg-card px-4 py-3 md:hidden">
        <Brand />
        <Button 
          type="button" 
          variant="outline" 
          size="icon" 
          aria-label="Open dashboard menu"
          aria-haspopup="dialog" 
          aria-controls="dashboard-drawer" 
          onClick={() => drawer.current?.showModal()}
          className="size-10 rounded-xl"
        >
          <Menu size={18} aria-hidden="true" />
        </Button>
      </header>

      <dialog 
        id="dashboard-drawer" 
        ref={drawer} 
        aria-labelledby="drawer-heading"
        className="fixed inset-y-0 start-0 end-auto m-0 h-dvh max-h-none w-[min(85vw,20rem)] max-w-none overflow-auto border-e border-border bg-card p-5 text-foreground backdrop:bg-black/50"
      >
        <div className="mb-6 flex items-center justify-between border-b border-border/70 pb-4">
          <Brand />
          <Button 
            type="button" 
            variant="ghost" 
            size="icon" 
            aria-label="Close dashboard menu"
            onClick={() => drawer.current?.close()}
            className="size-9 rounded-xl"
          >
            <X size={18} aria-hidden="true" />
          </Button>
        </div>
        <div className="mb-4">
          <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-bold text-primary uppercase tracking-wider">
            {dashboardRoles[role].label} Space
          </span>
        </div>
        <DashboardLinks role={role} section={section} onNavigate={() => drawer.current?.close()} />
        <div className="mt-8 border-t border-border/70 pt-5 flex items-center justify-between">
          <Link href="/" className="text-xs text-muted-foreground hover:underline">WedPlan Home</Link>
          <ThemeSwitcher />
        </div>
      </dialog>
    </>
  );
}
