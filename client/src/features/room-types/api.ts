import { api } from "@/lib/api/client";
import type { CreateRoomTypePayload, RoomType } from "@/types/room-type";

export async function getRoomTypes() {
  return api.get<RoomType[]>("/room-types");
}

export async function createRoomType(payload: CreateRoomTypePayload) {
  return api.post<RoomType>("/room-types", payload);
}