export type RoomTypeImage = {
  url: string;
  alt?: string;
  _id?: string;
};

export type RoomType = {
  _id: string;
  hotelId: string;
  name: string;
  slug: string;
  description: string | null;
  baseCapacity: number;
  maxCapacity: number;
  bedType: string;
  sizeInSqm: number | null;
  amenities: string[];
  images: RoomTypeImage[];
  basePrice: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type CreateRoomTypePayload = {
  name: string;
  description?: string;
  baseCapacity: number;
  maxCapacity: number;
  bedType: string;
  sizeInSqm?: number;
  amenities?: string[];
  images?: RoomTypeImage[];
  basePrice: number;
  isActive?: boolean;
};