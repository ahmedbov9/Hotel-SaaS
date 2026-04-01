"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { useHotel } from "@/hooks/use-hotel";

type TopbarProps = {
  onOpenSidebar: () => void;
};

export function Topbar({ onOpenSidebar }: TopbarProps) {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { hotel } = useHotel();

  function handleLogout() {
    logout();
    router.replace("/login");
  }

  return (
    <header className="flex min-h-16 items-center justify-between border-b border-slate-200 bg-white px-4 lg:px-6">
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenSidebar}
          className="inline-flex rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-700 lg:hidden"
        >
          Menu
        </button>

        <div>
          <h1 className="text-base font-semibold text-slate-900">
            {hotel?.name ?? "Hotel Dashboard"}
          </h1>
          <p className="text-sm text-slate-500">
            Manage rooms, bookings, guests, and operations.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-600 sm:block">
          {user?.fullName ?? "Authenticated User"}
        </div>

        <button
          onClick={handleLogout}
          className="rounded-xl border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
        >
          Logout
        </button>
      </div>
    </header>
  );
}