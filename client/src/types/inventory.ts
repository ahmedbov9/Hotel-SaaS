export type InventoryItem = {
  _id: string;
  hotelId: string;
  roomTypeId: string;
  date: string;
  totalInventory: number;
  reservedCount: number;
  availableCount: number;
  stopSell: boolean;
  minStay: number;
  priceOverride: number | null;
  createdAt: string;
  updatedAt: string;
};

export type InventoryRangeQuery = {
  roomTypeId: string;
  startDate: string;
  endDate: string;
};

export type InventoryBulkEntry = {
  date: string;
  totalInventory: number;
  reservedCount?: number;
  stopSell?: boolean;
  minStay?: number;
  priceOverride?: number | null;
};

export type BulkUpsertInventoryPayload = {
  roomTypeId: string;
  entries: InventoryBulkEntry[];
};