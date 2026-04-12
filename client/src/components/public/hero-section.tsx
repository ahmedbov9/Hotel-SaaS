import Link from "next/link";

export function HeroSection() {
  return (
    <section className="border-b border-slate-200 bg-slate-50">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-24">
        <div className="flex flex-col justify-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">
            Multi-tenant Hotel Management Platform
          </p>

          <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            Manage your hotel operations and public bookings in one system
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
            A complete hotel SaaS platform for managing rooms, guests, bookings,
            inventory, payments, invoices, and staff permissions with a modern
            dashboard and public booking experience.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/register"
              className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-medium text-white"
            >
              Start Free
            </Link>

            <Link
              href="/hotel/al-noor-hotel"
              className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-medium text-slate-700"
            >
              View Public Hotel Demo
            </Link>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <p className="text-sm font-medium text-slate-500">Bookings</p>
              <p className="mt-3 text-3xl font-bold text-slate-900">0</p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <p className="text-sm font-medium text-slate-500">Guests</p>
              <p className="mt-3 text-3xl font-bold text-slate-900">0</p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <p className="text-sm font-medium text-slate-500">Revenue</p>
              <p className="mt-3 text-3xl font-bold text-slate-900">SAR 0</p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <p className="text-sm font-medium text-slate-500">Rooms</p>
              <p className="mt-3 text-3xl font-bold text-slate-900">0</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}