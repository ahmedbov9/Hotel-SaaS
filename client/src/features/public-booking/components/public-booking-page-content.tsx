"use client";

import { useEffect, useState } from "react";
import {
  createPublicBooking,
  getPublicAvailability,
  getPublicHotel,
} from "@/features/public-booking/api";
import type {
  CreatePublicBookingPayload,
  PublicAvailabilityResponse,
  PublicBookingResult,
  PublicHotel,
} from "@/types/public-booking";
import { getErrorMessage } from "@/lib/utils/get-error-message";
import { HotelHero } from "./hotel-hero";
import { AvailabilitySearchForm } from "./availability-search";
import { AvailabilityResults } from "./availability-results";

type PublicBookingPageContentProps = {
  slug: string;
};

export function PublicBookingPageContent({
  slug,
}: PublicBookingPageContentProps) {
  const [hotel, setHotel] = useState<PublicHotel | null>(null);
  const [availability, setAvailability] =
    useState<PublicAvailabilityResponse | null>(null);
  const [bookingResult, setBookingResult] = useState<PublicBookingResult | null>(
    null,
  );
  const [isHotelLoading, setIsHotelLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadHotel() {
      try {
        setIsHotelLoading(true);
        setError("");
        const result = await getPublicHotel(slug);
        setHotel(result);
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setIsHotelLoading(false);
      }
    }

    void loadHotel();
  }, [slug]);

  async function handleSearch(payload: {
    checkInDate: string;
    checkOutDate: string;
    adults: number;
    children: number;
  }) {
    try {
      setIsSearching(true);
      setError("");
      setBookingResult(null);

      const result = await getPublicAvailability(slug, payload);
      setAvailability(result);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsSearching(false);
    }
  }

  async function handleBooking(payload: CreatePublicBookingPayload) {
    const result = await createPublicBooking(slug, payload);
    setBookingResult(result);
  }

  if (isHotelLoading) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-6 text-sm text-slate-500 shadow-sm">
        Loading hotel information...
      </div>
    );
  }

  if (error && !hotel) {
    return (
      <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
        {error}
      </div>
    );
  }

  if (!hotel) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-6 text-sm text-slate-500 shadow-sm">
        Hotel not found.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <HotelHero hotel={hotel} />

      {bookingResult ? (
        <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-6 text-sm text-emerald-800">
          Booking created successfully. Your booking number is{" "}
          <span className="font-semibold">{bookingResult.bookingNumber}</span>.
        </div>
      ) : null}

      {error && hotel ? (
        <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      <AvailabilitySearchForm onSubmit={handleSearch} />

      {isSearching ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 text-sm text-slate-500 shadow-sm">
          Searching availability...
        </div>
      ) : availability ? (
        <AvailabilityResults
          items={availability.roomTypes}
          checkInDate={availability.search.checkInDate}
          checkOutDate={availability.search.checkOutDate}
          adults={availability.search.adults}
          childrenCount={availability.search.children}
          onBook={handleBooking}
        />
      ) : null}
    </div>
  );
}