import Link from "next/link";
import { LoginForm } from "@/components/auth/login-form";
import { GuestOnlyRoute } from "@/components/auth/guest-only-route";

export default function LoginPage() {
  return (
    <GuestOnlyRoute>
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6">
            <p className="text-sm font-medium text-slate-500">Hotel SaaS PMS</p>
            <h1 className="mt-2 text-2xl font-bold text-slate-900">Login</h1>
            <p className="mt-2 text-sm text-slate-600">
              Sign in to access your hotel dashboard.
            </p>
          </div>

          <LoginForm />

          <p className="mt-4 text-sm text-slate-600">
            Do not have an account?{" "}
            <Link href="/register" className="font-medium text-slate-900 underline">
              Register
            </Link>
          </p>
        </div>
      </main>
    </GuestOnlyRoute>
  );
}