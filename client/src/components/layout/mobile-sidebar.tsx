"use client";

import { Sidebar } from "./sidebar";

type MobileSidebarProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function MobileSidebar({ isOpen, onClose }: MobileSidebarProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <button
        aria-label="Close sidebar overlay"
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/40"
      />

      <div className="absolute left-0 top-0 h-full w-72 max-w-[85vw] bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Hotel SaaS PMS
            </p>
            <h2 className="mt-1 text-base font-bold text-slate-900">Menu</h2>
          </div>

          <button
            onClick={onClose}
            className="rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-700"
          >
            Close
          </button>
        </div>

        <div className="h-[calc(100%-73px)] overflow-y-auto">
          <Sidebar isMobile onNavigate={onClose} />
        </div>
      </div>
    </div>
  );
}