"use client";

import { useState } from "react";
import type { Booking } from "@/types/booking";
import type { CreatePaymentPayload } from "@/types/payment";
import { getErrorMessage } from "@/lib/utils/get-error-message";

type PaymentFormProps = {
  bookings: Booking[];
  onSubmit: (payload: CreatePaymentPayload) => Promise<void>;
};

export function PaymentForm({ bookings, onSubmit }: PaymentFormProps) {
  const [form, setForm] = useState({
    bookingId: "",
    amount: "",
    currency: "SAR",
    method: "cash",
    provider: "manual",
    status: "paid",
    transactionId: "",
    paymentIntentId: "",
    notes: "",
  });

  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const payload: CreatePaymentPayload = {
        bookingId: form.bookingId,
        amount: Number(form.amount),
        currency: form.currency || "SAR",
        method: form.method as CreatePaymentPayload["method"],
        provider: form.provider as CreatePaymentPayload["provider"],
        status: form.status as CreatePaymentPayload["status"],
        transactionId: form.transactionId.trim() || undefined,
        paymentIntentId: form.paymentIntentId.trim() || undefined,
        notes: form.notes.trim() || undefined,
      };

      await onSubmit(payload);

      setForm({
        bookingId: "",
        amount: "",
        currency: "SAR",
        method: "cash",
        provider: "manual",
        status: "paid",
        transactionId: "",
        paymentIntentId: "",
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
        <h3 className="text-lg font-semibold text-slate-900">Create Payment</h3>
        <p className="mt-1 text-sm text-slate-600">
          Record a payment for an existing booking.
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
                {booking.bookingNumber} — {booking.guestSnapshot?.fullName ?? "Guest"} — Due: SAR {booking.dueAmount}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Amount
          </label>
          <input
            type="number"
            min={0.01}
            step="0.01"
            value={form.amount}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, amount: e.target.value }))
            }
            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-900"
            placeholder="200"
            required
          />
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
            Method
          </label>
          <select
            value={form.method}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, method: e.target.value }))
            }
            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-900"
          >
            <option value="cash">Cash</option>
            <option value="card">Card</option>
            <option value="bank_transfer">Bank Transfer</option>
            <option value="online">Online</option>
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Provider
          </label>
          <select
            value={form.provider}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, provider: e.target.value }))
            }
            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-900"
          >
            <option value="manual">Manual</option>
            <option value="stripe">Stripe</option>
            <option value="paypal">PayPal</option>
            <option value="moyasar">Moyasar</option>
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Status
          </label>
          <select
            value={form.status}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, status: e.target.value }))
            }
            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-900"
          >
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
            <option value="refunded">Refunded</option>
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Transaction ID
          </label>
          <input
            value={form.transactionId}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, transactionId: e.target.value }))
            }
            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-900"
            placeholder="txn_123"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Payment Intent ID
          </label>
          <input
            value={form.paymentIntentId}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, paymentIntentId: e.target.value }))
            }
            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-900"
            placeholder="pi_123"
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
            placeholder="Front desk payment"
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
        {isSubmitting ? "Creating..." : "Create Payment"}
      </button>
    </form>
  );
}