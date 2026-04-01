import type { RoomType } from "@/types/room-type";

export type RoomStatus =
  | "available"
  | "occupied"
  | "maintenance"
  | "inactive";

export type Room = {
  _id: string;
  hotelId: string;
  roomTypeId: RoomType | string;
  roomNumber: string;
  floor: number | null;
  status: RoomStatus;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
};

export type CreateRoomPayload = {
  roomTypeId: string;
  roomNumber: string;
  floor?: number;
  status?: RoomStatus;
  notes?: string;
};