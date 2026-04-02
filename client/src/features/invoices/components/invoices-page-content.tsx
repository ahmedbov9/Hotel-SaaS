"use client";

import { useEffect, useState } from "react";
import { getBookings } from "@/features/bookings/api";
import {
  createInvoice,
  getInvoices,
  updateInvoiceStatus,
} from "@/features/invoices/api";
import { InvoiceForm } from "./invoice-form";
import { InvoiceList } from "./invoice-list";
import type { Booking } from "@/types/booking";
import type {
  CreateInvoicePayload,
  Invoice,
  InvoiceStatus,
} from "@/types/invoice";
import { getErrorMessage } from "@/lib/utils/get-error-message";
import { useHotel } from "@/hooks/use-hotel";
import { useConfirmDialog } from "@/hooks/use-confirm-dialog";
import { usePermissions } from "@/hooks/use-permissions";

export function InvoicesPageContent() {
  const { hotelId } = useHotel();
  const { confirm } = useConfirmDialog();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const { can } = usePermissions();
  async function loadData() {
    if (!hotelId) {
      setInvoices([]);
      setBookings([]);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError("");

      const [invoicesResult, bookingsResult] = await Promise.all([
        getInvoices(),
        getBookings(),
      ]);

      setInvoices(invoicesResult);
      setBookings(bookingsResult);
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

  async function handleCreate(payload: CreateInvoicePayload) {
    await createInvoice(payload);
    showSuccess("Invoice created successfully.");
    await loadData();
  }

  async function handleUpdateStatus(id: string, status: InvoiceStatus) {
    const approved = await confirm({
      title: `Change invoice status to ${status}?`,
      description: `Are you sure you want to change the invoice status to ${status}?`,
      confirmText: "Update status",
    });

    if (!approved) return;

    await updateInvoiceStatus(id, { status });
    showSuccess("Invoice status updated successfully.");
    await loadData();
  }

  if (!hotelId) {
    return (
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-800">
        Select a hotel first before managing invoices.
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

      {can("payments.create") ? (
        <InvoiceForm bookings={bookings} onSubmit={handleCreate} />
      ) : (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-500 shadow-sm">
          You do not have permission to create invoices.
        </div>
      )}

      {isLoading ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-500 shadow-sm">
          Loading invoices...
        </div>
      ) : error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
          {error}
        </div>
      ) : (
        <InvoiceList items={invoices} onUpdateStatus={handleUpdateStatus} canManage={can("payments.create")} />
      )}
    </div>
  );
}
