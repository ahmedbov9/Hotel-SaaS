import { api } from "@/lib/api/client";
import type {
  CreatePublicBookingPayload,
  PublicAvailabilityResponse,
  PublicBookingResult,
  PublicHotel,
} from "@/types/public-booking";

export async function getPublicHotel(slug: string) {
  return api.get<PublicHotel>(`/public/${slug}`, {
    token: null,
    hotelId: null,
  });
}

export async function getPublicAvailability(
  slug: string,
  params: {
    checkInDate: string;
    checkOutDate: string;
    adults: number;
    children: number;
  },
) {
  const query = new URLSearchParams({
    checkInDate: params.checkInDate,
    checkOutDate: params.checkOutDate,
    adults: String(params.adults),
    children: String(params.children),
  });

  return api.get<PublicAvailabilityResponse>(
    `/public/${slug}/availability?${query.toString()}`,
    {
      token: null,
      hotelId: null,
    },
  );
}

export async function createPublicBooking(
  slug: string,
  payload: CreatePublicBookingPayload,
) {
  return api.post<PublicBookingResult>(`/public/${slug}/bookings`, payload, {
    token: null,
    hotelId: null,
  });
}