"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { Heart, House, LayoutGrid, LogOut, Menu, X } from "lucide-react";
import type { DashboardRole } from "@/lib/dashboard-session";

function DashboardLinks({
  role,
  onNavigate,
}: {
  role: DashboardRole;
  onNavigate?: () => void;
}) {
  return (
    <nav className="dashboard-links" aria-label="Dashboard">
      <Link href="/" onClick={onNavigate}>
        <House size={18} aria-hidden="true" />
        Home
      </Link>
      <Link
        href={`/dashboard/${role}`}
        aria-current="page"
        onClick={onNavigate}
      >
        <LayoutGrid size={18} aria-hidden="true" />
        Overview
      </Link>
      <form action="/dashboard/sign-out" method="post">
        <button type="submit">
          <LogOut size={18} aria-hidden="true" />
          Sign Out
        </button>
      </form>
    </nav>
  );
}

function Identity({ name, role }: { name: string; role: DashboardRole }) {
  return (
    <div className="dashboard-identity">
      <strong>{name}</strong>
      <span>{role}</span>
    </div>
  );
}

export function DashboardNavigation({
  name,
  role,
}: {
  name: string;
  role: DashboardRole;
}) {
  const drawer = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 768px)");
    const closeOnDesktop = () => {
      if (desktop.matches) drawer.current?.close();
    };
    desktop.addEventListener("change", closeOnDesktop);
    return () => desktop.removeEventListener("change", closeOnDesktop);
  }, []);

  return (
    <>
      <aside className="dashboard-sidebar">
        <Link className="invitation-brand" href="/">
          <Heart size={20} aria-hidden="true" />
          WedPlan
        </Link>
        <Identity name={name} role={role} />
        <DashboardLinks role={role} />
      </aside>

      <header className="dashboard-mobile">
        <Link className="invitation-brand" href="/">
          <Heart size={20} aria-hidden="true" />
          WedPlan
        </Link>
        <button
          type="button"
          aria-label="Open dashboard menu"
          aria-haspopup="dialog"
          onClick={() => drawer.current?.showModal()}
        >
          <Menu aria-hidden="true" />
        </button>
      </header>

      <dialog
        ref={drawer}
        className="dashboard-drawer"
        aria-labelledby="drawer-heading"
      >
        <div className="dashboard-drawer-header">
          <h2 id="drawer-heading">Dashboard</h2>
          <button
            type="button"
            aria-label="Close dashboard menu"
            onClick={() => drawer.current?.close()}
          >
            <X aria-hidden="true" />
          </button>
        </div>
        <Identity name={name} role={role} />
        <DashboardLinks
          role={role}
          onNavigate={() => drawer.current?.close()}
        />
      </dialog>
    </>
  );
}
