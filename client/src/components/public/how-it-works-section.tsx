const steps = [
  "Create an account",
  "Create your hotel workspace",
  "Add room types and rooms",
  "Manage guests, bookings, and payments",
];

export function HowItWorksSection() {
  return (
    <section className="border-y border-slate-200 bg-slate-50 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 max-w-2xl">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">
            How it works
          </h2>
          <p className="mt-3 text-base text-slate-600">
            A simple onboarding flow to start managing your hotel operations quickly.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {steps.map((step, index) => (
            <div
              key={step}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <p className="text-sm font-semibold text-slate-500">
                Step {index + 1}
              </p>
              <h3 className="mt-2 text-lg font-semibold text-slate-900">
                {step}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}