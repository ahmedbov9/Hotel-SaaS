"use client";

import { useState } from "react";
import { useHotel } from "@/hooks/use-hotel";
import { getErrorMessage } from "@/lib/utils/get-error-message";

export function HotelSwitcher() {
  const { hotel, hotelId, availableHotels, setHotelId, isLoading } = useHotel();
  const [value, setValue] = useState(hotelId ?? "");
  const [error, setError] = useState("");

  async function handleApply() {
    setError("");

    try {
      await setHotelId(value || null);
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }

  const hotels = Array.isArray(availableHotels) ? availableHotels : [];

if(availableHotels.length <= 1 && hotel){
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <p className="text-sm font-semibold text-slate-900">Current Hotel Context</p>

        <p className="mt-2 text-sm text-slate-600">
          {hotel ? `${hotel.name} (${hotel.slug})` : "No hotel selected"}
        </p>
      </div>
    );
  }


  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-sm font-semibold text-slate-900">Current Hotel Context</p>

      <p className="mt-2 text-sm text-slate-600">
        {hotel ? `${hotel.name} (${hotel.slug})` : "No hotel selected"}
      </p>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row">
        <select
          value={value}
          onChange={(event) => setValue(event.target.value)}
          className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-900"
        >

          {hotels.map((item) => (
            <option key={item.hotel._id} value={item.hotel._id}>
              {item.hotel.name} — {item.membership.role}
            </option>
          ))}
        </select>

        <button
          onClick={handleApply}
          disabled={isLoading}
          className="rounded-xl bg-slate-900 px-4 py-3 text-sm font-medium text-white disabled:opacity-60"
        >
          Apply
        </button>
      </div>

      {error ? (
        <div className="mt-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}
    </div>
  );
}