"use client";

import { useState } from "react";

type AvailabilitySearchFormProps = {
  onSubmit: (payload: {
    checkInDate: string;
    checkOutDate: string;
    adults: number;
    children: number;
  }) => Promise<void>;
};

export function AvailabilitySearchForm({
  onSubmit,
}: AvailabilitySearchFormProps) {
  const [form, setForm] = useState({
    checkInDate: "",
    checkOutDate: "",
    adults: 2,
    children: 0,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      await onSubmit({
        checkInDate: new Date(form.checkInDate).toISOString(),
        checkOutDate: new Date(form.checkOutDate).toISOString(),
        adults: Number(form.adults),
        children: Number(form.children),
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <h2 className="text-lg font-semibold text-slate-900">Search Availability</h2>

      <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Check-in
          </label>
          <input
            type="datetime-local"
            value={form.checkInDate}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, checkInDate: e.target.value }))
            }
            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-900"
            required
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Check-out
          </label>
          <input
            type="datetime-local"
            value={form.checkOutDate}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, checkOutDate: e.target.value }))
            }
            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-900"
            required
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Adults
          </label>
          <input
            type="number"
            min={1}
            value={form.adults}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, adults: Number(e.target.value) }))
            }
            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-900"
            required
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Children
          </label>
          <input
            type="number"
            min={0}
            value={form.children}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, children: Number(e.target.value) }))
            }
            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-900"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-5 rounded-xl bg-slate-900 px-4 py-3 text-sm font-medium text-white disabled:opacity-60"
      >
        {isSubmitting ? "Searching..." : "Search"}
      </button>
    </form>
  );
}