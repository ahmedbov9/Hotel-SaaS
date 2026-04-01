"use client";

import { useEffect, useState } from "react";
import { getDashboardSummary } from "@/features/dashboard/api";
import { MetricCard } from "./metric-card";
import { BookingList } from "./booking-list";
import type { DashboardSummary } from "@/types/reports";
import { getErrorMessage } from "@/lib/utils/get-error-message";
import { useHotel } from "@/hooks/use-hotel";
import { usePermissions } from "@/hooks/use-permissions";

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-SA", {
    style: "currency",
    currency: "SAR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function DashboardOverview() {
  const { hotelId } = useHotel();
  const {can} = usePermissions();
  const [data, setData] = useState<DashboardSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function run() {
      if (!hotelId) {
        setData(null);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError("");
        const result = await getDashboardSummary();

        setData(result);
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setIsLoading(false);
      }
    }

    void run();
  }, [hotelId]);


  if(!can('reports.read')){
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-500 shadow-sm">
        You do not have permission to view dashboard data.
      </div>
    );
  }


  if (!hotelId) {
    return (
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-800">
        Select a hotel first to load dashboard data.
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-500 shadow-sm">
        Loading dashboard data...
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
        {error}
      </div>
    );
  }

  if (!data) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-500 shadow-sm">
        No dashboard data available.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Total Bookings"
          value={data.metrics.totalBookings}
          helperText={`${data.metrics.confirmedBookings} confirmed`}
        />
        <MetricCard
          label="Total Guests"
          value={data.metrics.totalGuests}
          helperText={`${data.metrics.checkedInBookings} checked in`}
        />
        <MetricCard
          label="Total Revenue"
          value={formatCurrency(data.metrics.totalRevenue)}
          helperText={`${data.metrics.cancelledBookings} cancelled bookings`}
        />
        <MetricCard
          label="Total Rooms"
          value={data.metrics.totalRooms}
          helperText={`${data.metrics.totalRoomTypes} room types`}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <BookingList
          title="Upcoming Bookings"
          items={data.lists.upcomingBookings}
          dateKey="checkInDate"
        />
        <BookingList
          title="Today Check-ins"
          items={data.lists.todayCheckIns}
          dateKey="checkInDate"
        />
        <BookingList
          title="Today Check-outs"
          items={data.lists.todayCheckOuts}
          dateKey="checkOutDate"
        />
      </div>
    </div>
  );
}