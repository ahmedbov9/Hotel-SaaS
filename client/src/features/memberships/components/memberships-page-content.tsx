"use client";

import { useEffect, useState } from "react";
import {
  createMembership,
  getMemberships,
  updateMembership,
} from "@/features/memberships/api";
import { MembershipForm } from "./membership-form";
import { MembershipList } from "./membership-list";
import type {
  CreateMembershipPayload,
  Membership,
} from "@/types/membership";
import { getErrorMessage } from "@/lib/utils/get-error-message";
import { useHotel } from "@/hooks/use-hotel";
import { useConfirmDialog } from "@/hooks/use-confirm-dialog";
import { usePermissions } from "@/hooks/use-permissions";

export function MembershipsPageContent() {
  const { hotelId } = useHotel();
  const {can} = usePermissions();
  const {confirm} = useConfirmDialog();
  const [items, setItems] = useState<Membership[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  async function loadData() {
    if (!hotelId) {
      setItems([]);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError("");
      const result = await getMemberships();
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

  function showSuccess(message: string) {
    setSuccessMessage(message);
    window.setTimeout(() => setSuccessMessage(""), 3000);
  }

  async function handleCreate(payload: CreateMembershipPayload) {
    await createMembership(payload);
    showSuccess("Staff member created successfully.");
    await loadData();
  }

async function handleToggleActive(membership: Membership) {
  const approved = await confirm({
    title: membership.isActive ? "Deactivate staff member?" : "Activate staff member?",
    description: membership.isActive
      ? "This user will lose access to the selected hotel dashboard until reactivated."
      : "This user will regain access to the selected hotel dashboard.",
    confirmText: membership.isActive ? "Deactivate" : "Activate",
    variant: membership.isActive ? "danger" : "default",
  });

  if (!approved) return;

  await updateMembership(membership._id, {
    isActive: !membership.isActive,
  });

  showSuccess(
    membership.isActive
      ? "Staff member deactivated successfully."
      : "Staff member activated successfully."
  );

  await loadData();
}
  if (!hotelId) {
    return (
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-800">
        Select a hotel first before managing staff.
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
{can('staff.invite') ? (
      <MembershipForm onSubmit={handleCreate} />
) : (
  <div className="rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-500 shadow-sm">
    You do not have permission to invite staff members.
  </div>
)}
      {isLoading ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-500 shadow-sm">
          Loading staff members...
        </div>
      ) : error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
          {error}
        </div>
      ) : (

        <MembershipList items={items} onToggleActive={handleToggleActive} canManage={can('staff.update')} />
      )}
    </div>
  );
}