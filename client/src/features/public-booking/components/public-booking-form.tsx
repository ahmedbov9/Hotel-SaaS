"use client";

import { useState } from "react";
import type {
  CreatePublicBookingPayload,
  PublicAvailabilityRoomType,
} from "@/types/public-booking";
import { getErrorMessage } from "@/lib/utils/get-error-message";

type PublicBookingFormProps = {
  roomType: PublicAvailabilityRoomType;
  checkInDate: string;
  checkOutDate: string;
  adults: number;
  childrenCount: number;
  onSubmit: (payload: CreatePublicBookingPayload) => Promise<void>;
};

export function PublicBookingForm({
  roomType,
  checkInDate,
  checkOutDate,
  adults,
  childrenCount,
  onSubmit,
}: PublicBookingFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    nationality: "",
    specialRequests: "",
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      await onSubmit({
        roomTypeId: roomType.roomType.id,
        checkInDate,
        checkOutDate,
        adults,
        childrenCount,
        specialRequests: form.specialRequests.trim() || undefined,
        guest: {
          firstName: form.firstName.trim(),
          lastName: form.lastName.trim(),
          email: form.email.trim() || undefined,
          phone: form.phone.trim() || undefined,
          nationality: form.nationality.trim() || undefined,
        },
      });

      setIsOpen(false);
      setForm({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        nationality: "",
        specialRequests: "",
      });
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white"
      >
        Book This Room
      </button>

      {isOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4">
          <div className="w-full max-w-2xl rounded-3xl bg-white p-6 shadow-xl">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <h3 className="text-xl font-semibold text-slate-900">
                  Complete Your Booking
                </h3>
                <p className="mt-1 text-sm text-slate-600">
                  {roomType.roomType.name} • {roomType.pricing.currency}{" "}
                  {roomType.pricing.subtotal}
                </p>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-700"
              >
                Close
              </button>
            </div>

            <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  First Name
                </label>
                <input
                  value={form.firstName}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, firstName: e.target.value }))
                  }
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-900"
                  required
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Last Name
                </label>
                <input
                  value={form.lastName}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, lastName: e.target.value }))
                  }
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-900"
                  required
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Email
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, email: e.target.value }))
                  }
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-900"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Phone
                </label>
                <input
                  value={form.phone}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, phone: e.target.value }))
                  }
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-900"
                />
              </div>

              <div className="md:col-span-2">
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Nationality
                </label>
                <input
                  value={form.nationality}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, nationality: e.target.value }))
                  }
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-900"
                />
              </div>

              <div className="md:col-span-2">
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Special Requests
                </label>
                <textarea
                  value={form.specialRequests}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      specialRequests: e.target.value,
                    }))
                  }
                  className="min-h-24 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-900"
                />
              </div>

              {error ? (
                <div className="md:col-span-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              ) : null}

              <div className="md:col-span-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-xl bg-slate-900 px-4 py-3 text-sm font-medium text-white disabled:opacity-60"
                >
                  {isSubmitting ? "Submitting..." : "Confirm Booking"}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
}