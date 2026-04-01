"use client";

import { useState } from "react";
import type { CreateRoomTypePayload } from "@/types/room-type";
import { getErrorMessage } from "@/lib/utils/get-error-message";

type RoomTypeFormProps = {
  onSubmit: (payload: CreateRoomTypePayload) => Promise<void>;
};

export function RoomTypeForm({ onSubmit }: RoomTypeFormProps) {
  const [form, setForm] = useState({
    name: "",
    description: "",
    baseCapacity: 2,
    maxCapacity: 2,
    bedType: "",
    sizeInSqm: "",
    amenities: "",
    basePrice: "",
    isActive: true,
  });

  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const payload: CreateRoomTypePayload = {
        name: form.name.trim(),
        description: form.description.trim() || undefined,
        baseCapacity: Number(form.baseCapacity),
        maxCapacity: Number(form.maxCapacity),
        bedType: form.bedType.trim(),
        sizeInSqm: form.sizeInSqm ? Number(form.sizeInSqm) : undefined,
        amenities: form.amenities
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
        basePrice: Number(form.basePrice),
        isActive: form.isActive,
        images: [],
      };

      await onSubmit(payload);

      setForm({
        name: "",
        description: "",
        baseCapacity: 2,
        maxCapacity: 2,
        bedType: "",
        sizeInSqm: "",
        amenities: "",
        basePrice: "",
        isActive: true,
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
        <h3 className="text-lg font-semibold text-slate-900">Create Room Type</h3>
        <p className="mt-1 text-sm text-slate-600">
          Add a new room category for your hotel.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="md:col-span-2">
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Name
          </label>
          <input
            value={form.name}
            onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-900"
            placeholder="Deluxe Room"
            required
          />
        </div>

        <div className="md:col-span-2">
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Description
          </label>
          <textarea
            value={form.description}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, description: e.target.value }))
            }
            className="min-h-28 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-900"
            placeholder="Sea view room with king bed"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Base Capacity
          </label>
          <input
            type="number"
            min={1}
            value={form.baseCapacity}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, baseCapacity: Number(e.target.value) }))
            }
            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-900"
            required
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Max Capacity
          </label>
          <input
            type="number"
            min={1}
            value={form.maxCapacity}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, maxCapacity: Number(e.target.value) }))
            }
            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-900"
            required
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Bed Type
          </label>
          <input
            value={form.bedType}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, bedType: e.target.value }))
            }
            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-900"
            placeholder="King Bed"
            required
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Size (sqm)
          </label>
          <input
            type="number"
            min={0}
            value={form.sizeInSqm}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, sizeInSqm: e.target.value }))
            }
            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-900"
            placeholder="35"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Base Price
          </label>
          <input
            type="number"
            min={0}
            value={form.basePrice}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, basePrice: e.target.value }))
            }
            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-900"
            placeholder="450"
            required
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Amenities
          </label>
          <input
            value={form.amenities}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, amenities: e.target.value }))
            }
            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-900"
            placeholder="WiFi, TV, Mini Bar"
          />
        </div>
      </div>

      <label className="mt-4 flex items-center gap-2 text-sm text-slate-700">
        <input
          type="checkbox"
          checked={form.isActive}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, isActive: e.target.checked }))
          }
        />
        Active
      </label>

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
        {isSubmitting ? "Creating..." : "Create Room Type"}
      </button>
    </form>
  );
}