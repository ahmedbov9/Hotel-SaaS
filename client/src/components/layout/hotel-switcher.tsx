"use client";

import { useHotel } from "@/hooks/use-hotel";
import { getErrorMessage } from "@/lib/utils/get-error-message";
import { useEffect, useRef, useState } from "react";

export function HotelSwitcher() {
  const { hotel, hotelId, availableHotels, setHotelId, isLoading } = useHotel();
  const [error, setError] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  async function handleApply(nextHotelId: string | null) {
    setError("");

    try {
      await setHotelId(nextHotelId);
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }

  const hotels = Array.isArray(availableHotels) ? availableHotels : [];
  const currentIndex = hotels.findIndex((item) => item.hotel._id === hotelId);
  const selectedHotel = currentIndex >= 0 ? hotels[currentIndex] : hotels[0] ?? null;

  useEffect(() => {
    function handlePointerDown(event: PointerEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    window.addEventListener("pointerdown", handlePointerDown);

    return () => {
      window.removeEventListener("pointerdown", handlePointerDown);
    };
  }, []);

  async function handleSelect(nextHotelId: string) {
    setIsOpen(false);

    if (nextHotelId === hotelId) {
      return;
    }

    await handleApply(nextHotelId);
  }

  if (hotels.length <= 1 && hotel) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <p className="text-sm font-semibold text-slate-900">Current Hotel</p>

        <p className="mt-2 text-sm text-slate-600">
          {hotel ? `${hotel.name} (${hotel.slug})` : "No hotel selected"}
        </p>
      </div>
    );
  }


  return (
    <div className="rounded-2xl border border-slate-200 p-4 shadow-sm">


      <div className="mt-4" ref={containerRef}>
        <button
          type="button"
          onClick={() => setIsOpen((open) => !open)}
          disabled={isLoading || hotels.length === 0}
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          className="flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-linear-to-br from-slate-50 via-white to-slate-100 px-4 py-4 text-left shadow-sm transition hover:border-slate-300 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
              Active hotel
            </p>
            <p className="mt-2 truncate text-base font-semibold text-slate-900">
              {selectedHotel?.hotel.name ?? "Choose a hotel"}
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-slate-600">
              <span className="rounded-full bg-slate-900 px-2.5 py-1 font-medium text-white">
                {selectedHotel?.membership.role ?? "No role"}
              </span>
              <span className="truncate rounded-full border border-slate-200 bg-white px-2.5 py-1">
                {selectedHotel?.hotel.slug ?? "No slug"}
              </span>
              <span>{hotels.length} hotels</span>
            </div>
          </div>

          <span
            className={`ml-4 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 transition ${isOpen ? "rotate-180" : ""}`}
            aria-hidden="true"
          >
            <svg viewBox="0 0 20 20" fill="none" className="h-5 w-5">
              <path
                d="M5 7.5L10 12.5L15 7.5"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </button>

        {isOpen ? (
          <div className="relative">
            <div className="absolute left-0 right-0 top-3 z-20 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_20px_60px_-20px_rgba(15,23,42,0.35)]">
              <div className="border-b border-slate-100 px-4 py-3">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                  Switch hotel
                </p>
              </div>

              <div role="listbox" className="max-h-72 overflow-y-auto p-2">
                {hotels.map((item) => {
                  const isSelected = item.hotel._id === hotelId;

                  return (
                    <button
                      key={item.hotel._id}
                      type="button"
                      role="option"
                      aria-selected={isSelected}
                      onClick={() => void handleSelect(item.hotel._id)}
                      className={`flex w-full items-center justify-between outline-0
                         cursor-pointer ${!isSelected && "hover:bg-slate-100 hover:text-black"} rounded-xl px-3 py-3 text-left transition ${
                        isSelected
                          ? "bg-slate-900 text-white"
                          : "text-slate-700"
                      }`}
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold">{item.hotel.name}</p>
                        <p
                          className={`mt-1 truncate text-xs ${
                            isSelected ? "text-slate-300" : "text-slate-500"
                          }`}
                        >
                          {item.hotel.slug}
                        </p>
                      </div>

                      <div className="ml-3 flex shrink-0 items-center gap-2">
                        <span
                          className={`rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] ${
                            isSelected
                              ? "bg-white/10 text-white"
                              : "bg-slate-100 text-slate-700"
                          }`}
                        >
                          {item.membership.role}
                        </span>
                        {isSelected ? (
                          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-inherit">
                            Current
                          </span>
                        ) : null}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        ) : null}
      </div>

      {error ? (
        <div className="mt-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}
    </div>
  );
}