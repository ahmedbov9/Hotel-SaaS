import { api } from "@/lib/api/client";
import type { Booking, CreateBookingPayload } from "@/types/booking";

export async function getBookings() {
  return await api.get<Booking[]>("/bookings");
}

export async function createBooking(payload: CreateBookingPayload) {
  return api.post<Booking>("/bookings", payload);
}

export async function confirmBooking(id: string) {
  return api.post<Booking>(`/bookings/${id}/confirm`);
}

export async function checkInBooking(id: string) {
  return api.post<Booking>(`/bookings/${id}/check-in`);
}

export async function checkOutBooking(id: string) {
  return api.post<Booking>(`/bookings/${id}/check-out`);
}

export async function cancelBooking(id: string, cancellationReason?: string) {
  return api.post<Booking>(`/bookings/${id}/cancel`, {
    cancellationReason,
  });
}
