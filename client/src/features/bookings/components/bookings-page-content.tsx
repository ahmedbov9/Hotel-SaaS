"use client";

import { useCallback, useEffect, useState } from "react";
import {
  cancelBooking,
  checkInBooking,
  checkOutBooking,
  confirmBooking,
  createBooking,
  getBookings,
} from "@/features/bookings/api";
import { getGuests } from "@/features/guests/api";
import { getRoomTypes } from "@/features/room-types/api";
import { getRooms } from "@/features/rooms/api";
import { BookingForm } from "./booking-form";
import { BookingList } from "./booking-list";
import type { Booking, CreateBookingPayload } from "@/types/booking";
import type { Guest } from "@/types/guest";
import type { RoomType } from "@/types/room-type";
import type { Room } from "@/types/room";
import { getErrorMessage } from "@/lib/utils/get-error-message";
import { useHotel } from "@/hooks/use-hotel";
import { useConfirmDialog } from "@/hooks/use-confirm-dialog";
import { usePermissions } from "@/hooks/use-permissions";


export function BookingsPageContent() {
  const { hotelId } = useHotel();
  const { confirm } = useConfirmDialog();
  const { can } = usePermissions();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [guests, setGuests] = useState<Guest[]>([]);
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [bookingFormError, setBookingFormError] = useState("");

  const canReadBookings = can("bookings.read");
  const canCreateBookings = can("bookings.create");
  const canReadGuests = can("guests.read");
  const canReadRooms = can("rooms.read");
  const canLoadBookingFormData =
    canCreateBookings && canReadGuests && canReadRooms;

  const loadData = useCallback(async () => {
    if (!hotelId) {
      setBookings([]);
      setGuests([]);
      setRoomTypes([]);
      setRooms([]);
      setBookingFormError("");
      setIsLoading(false);
      return;
    }

    if (!canReadBookings) {
      setBookings([]);
      setGuests([]);
      setRoomTypes([]);
      setRooms([]);
      setBookingFormError("");
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError("");
      setBookingFormError("");

      const bookingsResult = await getBookings();
      setBookings(bookingsResult);

      if (!canLoadBookingFormData) {
        setGuests([]);
        setRoomTypes([]);
        setRooms([]);
        return;
      }

      const [guestsResult, roomTypesResult, roomsResult] = await Promise.allSettled([
        getGuests(),
        getRoomTypes(),
        getRooms(),
      ]);

      setGuests(guestsResult.status === "fulfilled" ? guestsResult.value : []);
      setRoomTypes(
        roomTypesResult.status === "fulfilled" ? roomTypesResult.value : [],
      );
      setRooms(roomsResult.status === "fulfilled" ? roomsResult.value : []);

      if (
        guestsResult.status === "rejected" ||
        roomTypesResult.status === "rejected" ||
        roomsResult.status === "rejected"
      ) {
        setBookingFormError(
          "Bookings loaded, but guest and room data could not be loaded for the create form.",
        );
      }
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }, [hotelId, canReadBookings, canLoadBookingFormData]);


  useEffect(() => {
    void loadData();

  }, [loadData]);

  function showSuccess(message: string) {
    setSuccessMessage(message);
    window.setTimeout(() => setSuccessMessage(""), 3000);
  }

  async function handleCreate(payload: CreateBookingPayload) {
    await createBooking(payload);
    showSuccess("Booking created successfully.");
    await loadData();
  }

  async function handleConfirm(id: string) {
    const approved = await confirm({
      title: "Confirm booking?",
      description: "This will move the booking to confirmed status.",
      confirmText: "Confirm booking",
    });

    if (!approved) return;
    await confirmBooking(id);
    showSuccess("Booking confirmed successfully.");
    await loadData();
  }

  async function handleCheckIn(id: string) {
    const approved = await confirm({
      title: "Check in guest?",
      description: "This will mark the guest as checked in.",
      confirmText: "Check in",
    });

    if (!approved) return;

    await checkInBooking(id);
    showSuccess("Guest checked in successfully.");
    await loadData();
  }

  async function handleCheckOut(id: string) {
    const approved = await confirm({
      title: "Check out guest?",
      description: "This will mark the guest as checked out.",
      confirmText: "Check out",
    });

    if (!approved) return;

    await checkOutBooking(id);
    showSuccess("Guest checked out successfully.");
    await loadData();
  }

  async function handleCancel(id: string) {
    const approved = await confirm({
      title: "Cancel booking?",
      description: "This will cancel the booking.",
      confirmText: "Cancel booking",
      variant: "danger",
    });

    if (!approved) return;

    await cancelBooking(id, "Cancelled from dashboard");
    showSuccess("Booking cancelled successfully.");
    await loadData();
  }

  if (!hotelId) {
    return (
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-800">
        Select a hotel first before managing bookings.
      </div>
    );
  }

  if (!canReadBookings) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
        You do not have permission to view bookings.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {successMessage ? (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
          {successMessage}
        </div>
      ) : null}
      {canLoadBookingFormData && !bookingFormError ? (
        <BookingForm
          guests={guests}
          roomTypes={roomTypes}
          rooms={rooms}
          onSubmit={handleCreate}
        />
      ) : (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-500 shadow-sm">
          {!canCreateBookings
            ? "You do not have permission to create bookings."
            : !canReadGuests || !canReadRooms
              ? "You need guest and room read permissions to create bookings."
              : bookingFormError}
        </div>
      )}

      {isLoading ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-500 shadow-sm">
          Loading bookings...
        </div>
      ) : error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
          {error}
        </div>
      ) : (
        <BookingList
          items={bookings}
          canConfirm={can("bookings.update")}
          canCheckIn={can("bookings.checkin")}
          canCheckOut={can("bookings.checkout")}
          canCancel={can("bookings.cancel")}
          onConfirm={handleConfirm}
          onCheckIn={handleCheckIn}
          onCheckOut={handleCheckOut}
          onCancel={handleCancel}
        />
      )}
    </div>
  );
}
