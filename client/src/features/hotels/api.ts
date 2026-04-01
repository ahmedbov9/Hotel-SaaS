import { api } from "@/lib/api/client";
import type { CurrentHotelResponseData, Hotel } from "@/types/hotel";
import type { AccessibleHotel } from "@/types/hotel-access";

type CreateHotelPayload = {
  name: string;
  legalName?: string;
  email?: string;
  phone?: string;
  country?: string;
  city?: string;
  address?: string;
  timezone?: string;
  currency?: string;
  taxNumber?: string;
  starRating?: number;
  description?: string;
};

export async function createHotel(payload: CreateHotelPayload) {
  return api.post<Hotel>("/hotels", payload);
}

export async function getCurrentHotel() {
  return api.get<CurrentHotelResponseData>("/hotels/current");
}

export async function getMyHotels() {
  return api.get<AccessibleHotel[]>("/hotels/my-hotels");
}