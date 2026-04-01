"use client";

import { useState } from "react";
import type { BulkUpsertInventoryPayload } from "@/types/inventory";
import { getErrorMessage } from "@/lib/utils/get-error-message";

type InventoryBulkFormProps = {
  roomTypeOptions: { _id: string; name: string }[];
  onSubmit: (payload: BulkUpsertInventoryPayload) => Promise<void>;
};

export function InventoryBulkForm({
  roomTypeOptions,
  onSubmit,
}: InventoryBulkFormProps) {
  const [form, setForm] = useState({
    roomTypeId: "",
    date: "",
    totalInventory: "",
    reservedCount: "",
    stopSell: false,
    minStay: "1",
    priceOverride: "",
  });

  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      await onSubmit({
        roomTypeId: form.roomTypeId,
        entries: [
          {
            date: new Date(form.date).toISOString(),
            totalInventory: Number(form.totalInventory),
            reservedCount: form.reservedCount ? Number(form.reservedCount) : 0,
            stopSell: form.stopSell,
            minStay: Number(form.minStay),
            priceOverride:
              form.priceOverride === ""
                ? null
                : Number(form.priceOverride),
          },
        ],
      });

      setForm({
        roomTypeId: "",
        date: "",
        totalInventory: "",
        reservedCount: "",
        stopSell: false,
        minStay: "1",
        priceOverride: "",
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
        <h3 className="text-lg font-semibold text-slate-900">Update Inventory</h3>
        <p className="mt-1 text-sm text-slate-600">
          Create or update inventory for a specific room type and date.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
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
            {roomTypeOptions.map((item) => (
              <option key={item._id} value={item._id}>
                {item.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Date
          </label>
          <input
            type="datetime-local"
            value={form.date}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, date: e.target.value }))
            }
            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-900"
            required
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Total Inventory
          </label>
          <input
            type="number"
            min={0}
            value={form.totalInventory}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, totalInventory: e.target.value }))
            }
            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-900"
            required
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Reserved Count
          </label>
          <input
            type="number"
            min={0}
            value={form.reservedCount}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, reservedCount: e.target.value }))
            }
            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-900"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Minimum Stay
          </label>
          <input
            type="number"
            min={1}
            value={form.minStay}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, minStay: e.target.value }))
            }
            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-900"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Price Override
          </label>
          <input
            type="number"
            min={0}
            value={form.priceOverride}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, priceOverride: e.target.value }))
            }
            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-900"
            placeholder="Optional"
          />
        </div>

        <div className="flex items-end">
          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={form.stopSell}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, stopSell: e.target.checked }))
              }
            />
            Stop Sell
          </label>
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
        {isSubmitting ? "Saving..." : "Save Inventory"}
      </button>
    </form>
  );
}