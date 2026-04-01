import { api } from "@/lib/api/client";
import type {
  BulkUpsertInventoryPayload,
  InventoryItem,
  InventoryRangeQuery,
} from "@/types/inventory";

export async function getInventoryRange(query: InventoryRangeQuery) {
  const params = new URLSearchParams({
    roomTypeId: query.roomTypeId,
    startDate: query.startDate,
    endDate: query.endDate,
  });

  return api.get<InventoryItem[]>(`/inventory?${params.toString()}`);
}

export async function bulkUpsertInventory(payload: BulkUpsertInventoryPayload) {
  return api.put<InventoryItem[]>("/inventory/bulk", payload);
}