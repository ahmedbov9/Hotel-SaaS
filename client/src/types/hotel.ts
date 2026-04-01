export type Hotel = {
  _id?: string;
  id?: string;
  name: string;
  slug: string;
  legalName?: string | null;
  email?: string | null;
  phone?: string | null;
  country?: string | null;
  city?: string | null;
  address?: string | null;
  timezone?: string | null;
  currency?: string | null;
  taxNumber?: string | null;
  starRating?: number | null;
  logo?: string | null;
  coverImage?: string | null;
  description?: string | null;
  status?: string;
  ownerUserId?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type Membership = {
  id: string;
  role: string;
  permissions: string[];
  isActive: boolean;
};

export type CurrentHotelResponseData = {
  hotel: Hotel;
  membership: Membership;
};