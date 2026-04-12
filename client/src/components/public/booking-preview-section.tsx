import Link from "next/link";

export function BookingPreviewSection() {
  return (
    <section className="py-20">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">For hotel teams</p>
          <h3 className="mt-2 text-2xl font-bold text-slate-900">
            Run your operations with a modern dashboard
          </h3>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Handle bookings, guests, payments, invoices, staff permissions, and
            daily inventory from a single interface.
          </p>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">For guests</p>
          <h3 className="mt-2 text-2xl font-bold text-slate-900">
            Give guests a direct booking experience
          </h3>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Publish a hotel page, allow availability search, and accept direct
            booking requests without sending guests into the admin dashboard.
          </p>

          <Link
            href="/hotel/al-noor-hotel"
            className="mt-5 inline-flex rounded-xl bg-slate-900 px-4 py-3 text-sm font-medium text-white"
          >
            Try Public Booking Page
          </Link>
        </div>
      </div>
    </section>
  );
}