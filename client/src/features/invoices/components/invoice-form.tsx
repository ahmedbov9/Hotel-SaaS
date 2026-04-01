"use client";

import { useState } from "react";
import type { Booking } from "@/types/booking";
import type { CreateInvoicePayload } from "@/types/invoice";
import { getErrorMessage } from "@/lib/utils/get-error-message";

type InvoiceFormProps = {
  bookings: Booking[];
  onSubmit: (payload: CreateInvoicePayload) => Promise<void>;
};

export function InvoiceForm({ bookings, onSubmit }: InvoiceFormProps) {
  const [form, setForm] = useState({
    bookingId: "",
    currency: "SAR",
    dueAt: "",
    notes: "",
  });

  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const payload: CreateInvoicePayload = {
        bookingId: form.bookingId,
        currency: form.currency || "SAR",
        dueAt: form.dueAt ? new Date(form.dueAt).toISOString() : undefined,
        notes: form.notes.trim() || undefined,
      };

      await onSubmit(payload);

      setForm({
        bookingId: "",
        currency: "SAR",
        dueAt: "",
        notes: "",
      });
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
    >
      <div className="mb-5">
        <h3 className="text-lg font-semibold text-slate-900">Create Invoice</h3>
        <p className="mt-1 text-sm text-slate-600">
          Generate an invoice for an existing booking.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="md:col-span-2">
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Booking
          </label>
          <select
            value={form.bookingId}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, bookingId: e.target.value }))
            }
            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-900"
            required
          >
            <option value="">Select booking</option>
            {bookings.map((booking) => (
              <option key={booking._id} value={booking._id}>
                {booking.bookingNumber} — {booking.guestSnapshot?.fullName ?? "Guest"} — Total: SAR {booking.total}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Currency
          </label>
          <input
            value={form.currency}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, currency: e.target.value }))
            }
            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-900"
            placeholder="SAR"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Due Date
          </label>
          <input
            type="datetime-local"
            value={form.dueAt}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, dueAt: e.target.value }))
            }
            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-900"
          />
        </div>

        <div className="md:col-span-2">
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Notes
          </label>
          <textarea
            value={form.notes}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, notes: e.target.value }))
            }
            className="min-h-24 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-900"
            placeholder="Front desk generated invoice"
          />
        </div>
      </div>

      {error ? (
        <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-5 rounded-xl bg-slate-900 px-4 py-3 text-sm font-medium text-white disabled:opacity-60"
      >
        {isSubmitting ? "Creating..." : "Create Invoice"}
      </button>
    </form>
  );
}