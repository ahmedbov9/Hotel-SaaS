"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createHotel } from "@/features/hotels/api";
import { getErrorMessage } from "@/lib/utils/get-error-message";
import { setCurrentHotelId } from "@/lib/api/storage";
import { useHotel } from "@/hooks/use-hotel";

export function CreateHotelForm() {
  const router = useRouter();
  const {refreshHotel} = useHotel();
  const [form, setForm] = useState({
    name: "",
    legalName: "",
    email: "",
    phone: "",
    country: "Saudi Arabia",
    city: "",
    address: "",
    timezone: "Asia/Riyadh",
    currency: "SAR",
    taxNumber: "",
    starRating: "4",
    description: "",
  });

  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const result = await createHotel({
        name: form.name,
        legalName: form.legalName || undefined,
        email: form.email || undefined,
        phone: form.phone || undefined,
        country: form.country || undefined,
        city: form.city || undefined,
        address: form.address || undefined,
        timezone: form.timezone || undefined,
        currency: form.currency || undefined,
        taxNumber: form.taxNumber || undefined,
        starRating: form.starRating ? Number(form.starRating) : undefined,
        description: form.description || undefined,
      });

      const hotelId = result._id ?? result.id;
      if (hotelId) {
        setCurrentHotelId(hotelId);
      }
      await refreshHotel();
      router.replace("/dashboard");
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">
          Hotel Name
        </label>
        <input
          value={form.name}
          onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
          className="w-full rounded-xl border text-stone-950 border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-900"
          placeholder="Al Noor Hotel"
          required
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">
          Legal Name
        </label>
        <input
          value={form.legalName}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, legalName: e.target.value }))
          }
          className="w-full rounded-xl border text-stone-950 border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-900"
          placeholder="Al Noor Hotel Company"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <input
          value={form.email}
          onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
          className="w-full rounded-xl border text-stone-950 border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-900"
          placeholder="info@hotel.com"
        />

        <input
          value={form.phone}
          onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))}
          className="w-full rounded-xl border text-stone-950 border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-900"
          placeholder="0500000000"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <input
          value={form.city}
          onChange={(e) => setForm((prev) => ({ ...prev, city: e.target.value }))}
          className="w-full rounded-xl border text-stone-950 border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-900"
          placeholder="Jeddah"
        />

        <input
          value={form.address}
          onChange={(e) => setForm((prev) => ({ ...prev, address: e.target.value }))}
          className="w-full rounded-xl border text-stone-950 border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-900"
          placeholder="King Road"
        />
      </div>

      <textarea
        value={form.description}
        onChange={(e) =>
          setForm((prev) => ({ ...prev, description: e.target.value }))
        }
        className="min-h-24 w-full rounded-xl border text-stone-950 border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-900"
        placeholder="Modern hotel in Jeddah"
      />

      {error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-medium text-white disabled:opacity-60"
      >
        {isSubmitting ? "Creating hotel..." : "Create Hotel"}
      </button>
    </form>
  );
}