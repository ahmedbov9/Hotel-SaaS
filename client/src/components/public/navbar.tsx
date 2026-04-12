import Link from "next/link";

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            Hotel SaaS PMS
          </p>
        </div>

        <nav className="flex items-center gap-3">
          <Link
            href="/register"
            className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white"
          >
            Get Started
          </Link>

          <Link
            href="/login"
            className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700"
          >
            Login
          </Link>
        </nav>
      </div>
    </header>
  );
}