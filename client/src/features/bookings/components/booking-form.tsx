"use client";

import { useState } from "react";
import type { CreateBookingPayload } from "@/types/booking";
import type { Guest } from "@/types/guest";
import type { RoomType } from "@/types/room-type";
import type { Room } from "@/types/room";
import { getErrorMessage } from "@/lib/utils/get-error-message";

type BookingFormProps = {
  guests: Guest[];
  roomTypes: RoomType[];
  rooms: Room[];
  onSubmit: (payload: CreateBookingPayload) => Promise<void>;
};

export function BookingForm({
  guests,
  roomTypes,
  rooms,
  onSubmit,
}: BookingFormProps) {
  const [form, setForm] = useState({
    guestId: "",
    roomTypeId: "",
    roomId: "",
    checkInDate: "",
    checkOutDate: "",
    adults: 1,
    children: 0,
    specialRequests: "",
    taxes: "",
    discounts: "",
    paidAmount: "",
  });

  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filteredRooms = rooms.filter((room) => {
    const roomTypeId =
      typeof room.roomTypeId === "string" ? room.roomTypeId : room.roomTypeId._id;
    return roomTypeId === form.roomTypeId;
  });

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const payload: CreateBookingPayload = {
        guestId: form.guestId,
        roomTypeId: form.roomTypeId,
        roomId: form.roomId,
        source: "admin",
        checkInDate: new Date(form.checkInDate).toISOString(),
        checkOutDate: new Date(form.checkOutDate).toISOString(),
        adults: Number(form.adults),
        children: Number(form.children),
        specialRequests: form.specialRequests.trim() || undefined,
        taxes: form.taxes ? Number(form.taxes) : undefined,
        discounts: form.discounts ? Number(form.discounts) : undefined,
        paidAmount: form.paidAmount ? Number(form.paidAmount) : undefined,
      };

      await onSubmit(payload);

      setForm({
        guestId: "",
        roomTypeId: "",
        roomId: "",
        checkInDate: "",
        checkOutDate: "",
        adults: 1,
        children: 0,
        specialRequests: "",
        taxes: "",
        discounts: "",
        paidAmount: "",
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
        <h3 className="text-lg font-semibold text-slate-900">Create Booking</h3>
        <p className="mt-1 text-sm text-slate-600">
          Create a booking for the selected hotel.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Guest</label>
          <select
            value={form.guestId}
            onChange={(e) => setForm((p) => ({ ...p, guestId: e.target.value }))}
            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-900"
            required
          >
            <option value="">Select guest</option>
            {guests.map((guest) => (
              <option key={guest._id} value={guest._id}>
                {guest.firstName} {guest.lastName}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Room Type</label>
          <select
            value={form.roomTypeId}
            onChange={(e) =>
              setForm((p) => ({ ...p, roomTypeId: e.target.value, roomId: "" }))
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
          <label className="mb-1 block text-sm font-medium text-slate-700">Room</label>
          <select
            value={form.roomId}
            onChange={(e) => setForm((p) => ({ ...p, roomId: e.target.value }))}
            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-900"
            required
          >
            <option value="">Select room</option>
            {filteredRooms.map((room) => (
              <option key={room._id} value={room._id}>
                Room {room.roomNumber}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Adults</label>
          <input
            type="number"
            min={1}
            value={form.adults}
            onChange={(e) => setForm((p) => ({ ...p, adults: Number(e.target.value) }))}
            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-900"
            required
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Check-in</label>
          <input
            type="datetime-local"
            value={form.checkInDate}
            onChange={(e) => setForm((p) => ({ ...p, checkInDate: e.target.value }))}
            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-900"
            required
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Check-out</label>
          <input
            type="datetime-local"
            value={form.checkOutDate}
            onChange={(e) => setForm((p) => ({ ...p, checkOutDate: e.target.value }))}
            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-900"
            required
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Children</label>
          <input
            type="number"
            min={0}
            value={form.children}
            onChange={(e) => setForm((p) => ({ ...p, children: Number(e.target.value) }))}
            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-900"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Paid Amount</label>
          <input
            type="number"
            min={0}
            value={form.paidAmount}
            onChange={(e) => setForm((p) => ({ ...p, paidAmount: e.target.value }))}
            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-900"
            placeholder="0"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Taxes</label>
          <input
            type="number"
            min={0}
            value={form.taxes}
            onChange={(e) => setForm((p) => ({ ...p, taxes: e.target.value }))}
            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-900"
            placeholder="0"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Discounts</label>
          <input
            type="number"
            min={0}
            value={form.discounts}
            onChange={(e) => setForm((p) => ({ ...p, discounts: e.target.value }))}
            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-900"
            placeholder="0"
          />
        </div>

        <div className="md:col-span-2">
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Special Requests
          </label>
          <textarea
            value={form.specialRequests}
            onChange={(e) =>
              setForm((p) => ({ ...p, specialRequests: e.target.value }))
            }
            className="min-h-24 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-900"
            placeholder="Late check-in"
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
        {isSubmitting ? "Creating..." : "Create Booking"}
      </button>
    </form>
  );
}