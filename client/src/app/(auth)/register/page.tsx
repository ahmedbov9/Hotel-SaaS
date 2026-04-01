import { GuestOnlyRoute } from "@/components/auth/guest-only-route";
import { RegisterForm } from "@/components/auth/register-form";

export default function RegisterPage() {
  return (
    <GuestOnlyRoute>
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6">
            <p className="text-sm font-medium text-slate-500">Hotel SaaS PMS</p>
            <h1 className="mt-2 text-2xl font-bold text-slate-900">Register</h1>
            <p className="mt-2 text-sm text-slate-600">
              Create your account to start setting up your hotel workspace.
            </p>
          </div>

          <RegisterForm />
        </div>
      </main>
    </GuestOnlyRoute>
  );
}