"use client";

import { useEffect, useState } from "react";
import { getRoomTypes } from "@/features/room-types/api";
import {
  bulkUpsertInventory,
  getInventoryRange,
} from "@/features/inventory/api";
import { InventorySearchForm } from "./inventory-search-form";
import { InventoryBulkForm } from "./inventory-bulk-form";
import { InventoryList } from "./inventory-list";
import type { RoomType } from "@/types/room-type";
import type {
  BulkUpsertInventoryPayload,
  InventoryItem,
} from "@/types/inventory";
import { getErrorMessage } from "@/lib/utils/get-error-message";
import { useHotel } from "@/hooks/use-hotel";
import { usePermissions } from "@/hooks/use-permissions";

export function InventoryPageContent() {
  const { hotelId } = useHotel();
  const { can } = usePermissions();

  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  async function loadRoomTypes() {
    if (!hotelId) {
      setRoomTypes([]);
      setIsLoading(false);
      return;
    }

    if (!can("inventory.read")) {
      setRoomTypes([]);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const result = await getRoomTypes();
      setRoomTypes(result);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void loadRoomTypes();
  }, [hotelId]);

  async function handleSearch(payload: {
    roomTypeId: string;
    startDate: string;
    endDate: string;
  }) {
    try {
      setError("");
      const result = await getInventoryRange(payload);
      setItems(result);
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }

  async function handleBulkSubmit(payload: BulkUpsertInventoryPayload) {
    try {
      setError("");
      await bulkUpsertInventory(payload);
      setSuccessMessage("Inventory updated successfully.");

      window.setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }

  if (!hotelId) {
    return (
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-800">
        Select a hotel first before managing inventory.
      </div>
    );
  }

  if (!can("inventory.read")) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
        You do not have permission to view inventory.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {successMessage ? (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
          {successMessage}
        </div>
      ) : null}

      {error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      <InventorySearchForm
        roomTypeOptions={roomTypes.map((item) => ({
          _id: item._id,
          name: item.name,
        }))}
        onSubmit={handleSearch}
      />

      {can("inventory.update") ? (
        <InventoryBulkForm
          roomTypeOptions={roomTypes.map((item) => ({
            _id: item._id,
            name: item.name,
          }))}
          onSubmit={handleBulkSubmit}
        />
      ) : (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-500 shadow-sm">
          You do not have permission to update inventory.
        </div>
      )}

      {isLoading ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-500 shadow-sm">
          Loading inventory module...
        </div>
      ) : (
        <InventoryList items={items} />
      )}
    </div>
  );
}