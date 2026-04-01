import { api } from "@/lib/api/client";
import type {
  CreateMembershipPayload,
  Membership,
  UpdateMembershipPayload,
} from "@/types/membership";

export async function getMemberships() {
  return api.get<Membership[]>("/memberships");
}

export async function createMembership(payload: CreateMembershipPayload) {
  return api.post<Membership>("/memberships", payload);
}

export async function updateMembership(id: string, payload: UpdateMembershipPayload) {
  return api.patch<Membership>(`/memberships/${id}`, payload);
}