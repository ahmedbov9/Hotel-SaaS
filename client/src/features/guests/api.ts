import { api } from "@/lib/api/client";
import { CreateGuestPayload, Guest } from "@/types/guest";


export async function getGuests() {
    return api.get<Guest[]>("/guests");
}

export async function createGuest(payload : CreateGuestPayload) {
    return api.post<Guest>("/guests", payload);
}