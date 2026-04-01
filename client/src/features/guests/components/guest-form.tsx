"use client";

import { useState } from "react";
import type { CreateGuestPayload } from "@/types/guest";
import { getErrorMessage } from "@/lib/utils/get-error-message";

type GuestFormProps = {
  onSubmit: (payload: CreateGuestPayload) => Promise<void>;
};

export function GuestForm({ onSubmit }: GuestFormProps) {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    nationality: "",
    idType: "",
    idNumber: "",
    dateOfBirth: "",
    notes: "",
    tags: "",
  });

  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const payload: CreateGuestPayload = {
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        email: form.email.trim() || undefined,
        phone: form.phone.trim() || undefined,
        nationality: form.nationality.trim() || undefined,
        idType: form.idType.trim() || undefined,
        idNumber: form.idNumber.trim() || undefined,
        dateOfBirth: form.dateOfBirth
          ? new Date(form.dateOfBirth).toISOString()
          : undefined,
        notes: form.notes.trim() || undefined,
        tags: form.tags
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
      };

      await onSubmit(payload);

      setForm({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        nationality: "",
        idType: "",
        idNumber: "",
        dateOfBirth: "",
        notes: "",
        tags: "",
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
        <h3 className="text-lg font-semibold text-slate-900">Create Guest</h3>
        <p className="mt-1 text-sm text-slate-600">
          Add a guest profile for the selected hotel.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
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
            placeholder="Ahmed"
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
            placeholder="Alfeifi"
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
            placeholder="guest@example.com"
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
            placeholder="0500000000"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Nationality
          </label>
          <input
            value={form.nationality}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, nationality: e.target.value }))
            }
            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-900"
            placeholder="Saudi"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Date of Birth
          </label>
          <input
            type="date"
            value={form.dateOfBirth}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, dateOfBirth: e.target.value }))
            }
            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-900"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            ID Type
          </label>
          <select
            value={form.idType}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, idType: e.target.value }))
            }
            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-900"
          >
            <option value="">Select ID type</option>
            <option value="national_id">National ID</option>
            <option value="iqama">Iqama</option>
            <option value="passport">Passport</option>
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            ID Number
          </label>
          <input
            value={form.idNumber}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, idNumber: e.target.value }))
            }
            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-900"
            placeholder="1234567890"
          />
        </div>

        <div className="md:col-span-2">
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Tags
          </label>
          <input
            value={form.tags}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, tags: e.target.value }))
            }
            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-900"
            placeholder="vip, returning"
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
            placeholder="VIP guest"
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
        {isSubmitting ? "Creating..." : "Create Guest"}
      </button>
    </form>
  );
}