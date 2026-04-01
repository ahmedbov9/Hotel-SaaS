export type PublicHotel = {
  id: string;
  name: string;
  slug: string;
  city?: string | null;
  country?: string | null;
  address?: string | null;
  timezone?: string | null;
  currency?: string | null;
  starRating?: number | null;
  logo?: string | null;
  coverImage?: string | null;
  description?: string | null;
};

export type PublicAvailabilityRoomType = {
  roomType: {
    id: string;
    name: string;
    slug: string;
    description?: string | null;
    baseCapacity: number;
    maxCapacity: number;
    bedType: string;
    sizeInSqm?: number | null;
    amenities: string[];
    images: { url: string; alt?: string }[];
  };
  pricing: {
    nights: number;
    nightlyRates: {
      date: string;
      price: number;
    }[];
    subtotal: number;
    currency: string;
  };
  availability: {
    available: boolean;
    reason?: string;
  };
};

export type PublicAvailabilityResponse = {
  hotel: {
    id: string;
    name: string;
    slug: string;
    currency: string;
    timezone: string;
  };
  search: {
    checkInDate: string;
    checkOutDate: string;
    nights: number;
    adults: number;
    children: number;
  };
  roomTypes: PublicAvailabilityRoomType[];
};

export type CreatePublicBookingPayload = {
  roomTypeId: string;
  checkInDate: string;
  checkOutDate: string;
  adults: number;
  childrenCount?: number;
  specialRequests?: string;
  guest: {
    firstName: string;
    lastName: string;
    email?: string;
    phone?: string;
    nationality?: string;
    idType?: string;
    idNumber?: string;
    dateOfBirth?: string;
    notes?: string;
  };
};

export type PublicBookingResult = {
  bookingId: string;
  bookingNumber: string;
  status: string;
  hotel: {
    id: string;
    name: string;
    slug: string;
    currency: string;
  };
  guest: {
    fullName?: string;
    email?: string | null;
    phone?: string | null;
  };
  stay: {
    checkInDate: string;
    checkOutDate: string;
    nights: number;
  };
  pricing: {
    subtotal: number;
    taxes: number;
    discounts: number;
    total: number;
    dueAmount: number;
    currency: string;
  };
};