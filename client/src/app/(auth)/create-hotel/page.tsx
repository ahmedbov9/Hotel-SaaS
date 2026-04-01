"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { CreateHotelForm } from "@/components/auth/create-hotel-form";
import { useAuth } from "@/hooks/use-auth";
import { useHotel } from "@/hooks/use-hotel";

export default function CreateHotelPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();
  const { hotelId } = useHotel();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/login");
      return;
    }

    if (!isLoading && isAuthenticated && hotelId) {
      router.replace("/dashboard");
    }
  }, [isAuthenticated, isLoading, hotelId, router]);

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50">
        <p className="text-sm text-slate-500">Checking session...</p>
      </main>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-2xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-6">
          <p className="text-sm font-medium text-slate-500">Hotel SaaS PMS</p>
          <h1 className="mt-2 text-2xl font-bold text-slate-900">Create Hotel</h1>
          <p className="mt-2 text-sm text-slate-600">
            Set up your first hotel workspace to start using the dashboard.
          </p>
        </div>

        <CreateHotelForm />
      </div>
    </main>
  );
}