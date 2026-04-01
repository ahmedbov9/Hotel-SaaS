import {api} from "@/lib/api/client";
import type { CreateRoomPayload , Room } from "@/types/room";

export async function getRooms(){
    return api.get<Room[]>("/rooms");
}

export async function createRoom(payload: CreateRoomPayload){
    return api.post<Room>("/rooms", payload);
}