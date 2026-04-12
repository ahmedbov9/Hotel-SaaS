const features = [
  {
    title: "Hotel Dashboard",
    description:
      "Manage rooms, guests, bookings, staff, and finances from one dashboard.",
  },
  {
    title: "Inventory Control",
    description:
      "Control availability, stop-sell, minimum stay, and nightly pricing overrides.",
  },
  {
    title: "Public Booking Flow",
    description:
      "Allow guests to search availability and create bookings through a public page.",
  },
  {
    title: "Permission-Based Access",
    description:
      "Show different tools and actions based on the staff member’s permissions.",
  },
];

export function FeaturesSection() {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 max-w-2xl">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">
            Everything your hotel needs in one place
          </h2>
          <p className="mt-3 text-base text-slate-600">
            Built to handle daily hotel operations with a structure that feels
            closer to a real SaaS product than a basic CRUD dashboard.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <h3 className="text-lg font-semibold text-slate-900">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}