"use client";

import { NavLink } from "./nav-link";
import { usePermissions } from "@/hooks/use-permissions";
import clsx from "clsx";

type SidebarProps = {
  isMobile?: boolean;
  onNavigate?: () => void;
};

export function Sidebar({
  isMobile = false,
  onNavigate,
}: SidebarProps) {
  const { can } = usePermissions();

  return (
    <aside
      className={clsx(
        "bg-white",
        isMobile
          ? "h-full w-full border-none"
          : "hidden w-64 shrink-0 border-r border-slate-200 lg:block",
      )}
    >
      <div className="flex h-full flex-col px-4 py-6">
        {!isMobile ? (
          <div className="mb-8">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Hotel SaaS PMS
            </p>
            <h2 className="mt-2 text-lg font-bold text-slate-900">Dashboard</h2>
          </div>
        ) : null}

        <nav className="flex flex-col gap-2">
          <NavLink href="/dashboard" label="Overview" onNavigate={onNavigate} />

          {can("rooms.read") ? (
            <NavLink href="/room-types" label="Room Types" onNavigate={onNavigate} />
          ) : null}

          {can("rooms.read") ? (
            <NavLink href="/rooms" label="Rooms" onNavigate={onNavigate} />
          ) : null}

          {can("inventory.read") ? (
            <NavLink href="/inventory" label="Inventory" onNavigate={onNavigate} />
          ) : null}

          {can("guests.read") ? (
            <NavLink href="/guests" label="Guests" onNavigate={onNavigate} />
          ) : null}

          {can("bookings.read") ? (
            <NavLink href="/bookings" label="Bookings" onNavigate={onNavigate} />
          ) : null}

          {can("payments.read") ? (
            <NavLink href="/payments" label="Payments" onNavigate={onNavigate} />
          ) : null}

          {can("payments.read") ? (
            <NavLink href="/invoices" label="Invoices" onNavigate={onNavigate} />
          ) : null}

          {can("staff.read") ? (
            <NavLink href="/memberships" label="Staff" onNavigate={onNavigate} />
          ) : null}
        </nav>
      </div>
    </aside>
  );
}