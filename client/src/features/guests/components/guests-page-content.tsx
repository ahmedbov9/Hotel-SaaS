"use client";

import { useEffect, useState } from "react";
import { createGuest, getGuests } from "@/features/guests/api";
import { GuestForm } from "./guest-form";
import { GuestList } from "./guest-list";
import type { CreateGuestPayload, Guest } from "@/types/guest";
import { getErrorMessage } from "@/lib/utils/get-error-message";
import { useHotel } from "@/hooks/use-hotel";
import { usePermissions } from "@/hooks/use-permissions";

export function GuestsPageContent() {
  const { hotelId } = useHotel();
  const { can } = usePermissions();

  const [items, setItems] = useState<Guest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  async function loadData() {
    if (!hotelId) {
      setItems([]);
      setIsLoading(false);
      return;
    }

    if (!can("guests.read")) {
      setItems([]);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError("");
      const result = await getGuests();
      setItems(result);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void loadData();
  }, [hotelId]);

  async function handleCreate(payload: CreateGuestPayload) {
    await createGuest(payload);
    setSuccessMessage("Guest created successfully.");
    await loadData();

    window.setTimeout(() => {
      setSuccessMessage("");
    }, 3000);
  }

  if (!hotelId) {
    return (
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-800">
        Select a hotel first before managing guests.
      </div>
    );
  }

  if (!can("guests.read")) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
        You do not have permission to view guests.
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

      {can("guests.create") ? (
        <GuestForm onSubmit={handleCreate} />
      ) : (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-500 shadow-sm">
          You do not have permission to create guests.
        </div>
      )}

      {isLoading ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-500 shadow-sm">
          Loading guests...
        </div>
      ) : error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
          {error}
        </div>
      ) : (
        <GuestList items={items} />
      )}
    </div>
  );
}