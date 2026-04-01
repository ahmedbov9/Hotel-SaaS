"use client";

import { useEffect, useState } from "react";
import { createRoom, getRooms } from "@/features/rooms/api";
import { getRoomTypes } from "@/features/room-types/api";
import { RoomForm } from "./room-form";
import { RoomList } from "./room-list";
import type { CreateRoomPayload, Room } from "@/types/room";
import type { RoomType } from "@/types/room-type";
import { getErrorMessage } from "@/lib/utils/get-error-message";
import { useHotel } from "@/hooks/use-hotel";
import { usePermissions } from "@/hooks/use-permissions";

export function RoomsPageContent() {
  const { hotelId } = useHotel();
  const { can } = usePermissions();

  const [rooms, setRooms] = useState<Room[]>([]);
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  async function loadData() {
    if (!hotelId) {
      setRooms([]);
      setRoomTypes([]);
      setIsLoading(false);
      return;
    }

    if (!can("rooms.read")) {
      setRooms([]);
      setRoomTypes([]);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError("");

      const [roomsResult, roomTypesResult] = await Promise.all([
        getRooms(),
        getRoomTypes(),
      ]);

      setRooms(roomsResult);
      setRoomTypes(roomTypesResult);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void loadData();
  }, [hotelId]);

  async function handleCreate(payload: CreateRoomPayload) {
    await createRoom(payload);
    setSuccessMessage("Room created successfully.");
    await loadData();

    window.setTimeout(() => {
      setSuccessMessage("");
    }, 3000);
  }

  if (!hotelId) {
    return (
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-800">
        Select a hotel first before managing rooms.
      </div>
    );
  }

  if (!can("rooms.read")) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
        You do not have permission to view rooms.
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

      {can("rooms.create") ? (
        <RoomForm roomTypes={roomTypes} onSubmit={handleCreate} />
      ) : (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-500 shadow-sm">
          You do not have permission to create rooms.
        </div>
      )}

      {isLoading ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-500 shadow-sm">
          Loading rooms...
        </div>
      ) : error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
          {error}
        </div>
      ) : (
        <RoomList items={rooms} />
      )}
    </div>
  );
}