import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      <section className="mx-auto flex min-h-screen max-w-5xl flex-col items-center justify-center px-6 text-center">


        <h1 className="mb-4 text-3xl font-bold tracking-tight sm:text-5xl">
         Hotel SaaS PMS System
        </h1>

        <p className="max-w-2xl text-base text-center text-slate-600 sm:text-lg">
          Welcome to my Hotel SaaS PMS System! This is a demo application built with Next.js, TypeScript, and Tailwind CSS. It provides a platform for hotel owners and staff to manage their hotel operations efficiently. You can register, create hotels, manage rooms, bookings, and guests all in one place. Explore the dashboard to see the features in action!
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href="/register"
            className="rounded-xl bg-slate-900 px-4 py-3 text-sm font-medium text-white"
          >
            Register
          </Link>

          <Link
            href="/login"
            className="rounded-xl border border-slate-300 px-4 py-3 text-sm font-medium text-slate-900"
          >
            Login
          </Link>

          <Link
            href="/dashboard"
            className="rounded-xl border border-slate-300 px-4 py-3 text-sm font-medium text-slate-900"
          >
            Dashboard
          </Link>
        </div>
      </section>
    </main>
  );
}