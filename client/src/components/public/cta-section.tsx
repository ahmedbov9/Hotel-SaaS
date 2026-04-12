import Link from "next/link";

export function CtaSection() {
  return (
    <section className="border-t border-slate-200 bg-slate-900 py-20 text-white">
      <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold tracking-tight">
          Start building your hotel workspace today
        </h2>
        <p className="mt-4 text-base text-slate-300">
          Create your account, set up your hotel, and start managing operations
          with a structured dashboard and booking system.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href="/register"
            className="rounded-xl bg-white px-5 py-3 text-sm font-medium text-slate-900"
          >
            Create Account
          </Link>

          <Link
            href="/login"
            className="rounded-xl border border-slate-600 px-5 py-3 text-sm font-medium text-white"
          >
            Login
          </Link>
        </div>
      </div>
    </section>
  );
}