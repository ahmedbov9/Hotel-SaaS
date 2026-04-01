"use client";

import { useState } from "react";
import type { CreateRoomPayload } from "@/types/room";
import type { RoomType } from "@/types/room-type";
import { getErrorMessage } from "@/lib/utils/get-error-message";

type RoomFormProps = {
  roomTypes: RoomType[];
  onSubmit: (payload: CreateRoomPayload) => Promise<void>;
};

export function RoomForm({ roomTypes, onSubmit }: RoomFormProps) {
  const [form, setForm] = useState({
    roomTypeId: "",
    roomNumber: "",
    floor: "",
    status: "available",
    notes: "",
  });

  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const payload: CreateRoomPayload = {
        roomTypeId: form.roomTypeId,
        roomNumber: form.roomNumber.trim(),
        floor: form.floor ? Number(form.floor) : undefined,
        status: form.status as CreateRoomPayload["status"],
        notes: form.notes.trim() || undefined,
      };

      await onSubmit(payload);

      setForm({
        roomTypeId: "",
        roomNumber: "",
        floor: "",
        status: "available",
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
        <h3 className="text-lg font-semibold text-slate-900">Create Room</h3>
        <p className="mt-1 text-sm text-slate-600">
          Add a physical room for the selected hotel.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Room Type
          </label>
          <select
            value={form.roomTypeId}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, roomTypeId: e.target.value }))
            }
            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-900"
            required
          >
            <option value="">Select room type</option>
            {roomTypes.map((roomType) => (
              <option key={roomType._id} value={roomType._id}>
                {roomType.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Room Number
          </label>
          <input
            value={form.roomNumber}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, roomNumber: e.target.value }))
            }
            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-900"
            placeholder="101"
            required
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Floor
          </label>
          <input
            type="number"
            value={form.floor}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, floor: e.target.value }))
            }
            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-900"
            placeholder="1"
          />
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
            <option value="available">Available</option>
            <option value="occupied">Occupied</option>
            <option value="maintenance">Maintenance</option>
            <option value="inactive">Inactive</option>
          </select>
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
            placeholder="Near elevator"
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
        {isSubmitting ? "Creating..." : "Create Room"}
      </button>
    </form>
  );
}