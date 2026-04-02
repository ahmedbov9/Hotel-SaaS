"use client";

import { useEffect, useState } from "react";
import { getBookings } from "@/features/bookings/api";
import { createPayment, getPayments } from "@/features/payments/api";
import { PaymentForm } from "./payment-form";
import { PaymentList } from "./payment-list";
import type { Booking } from "@/types/booking";
import type { CreatePaymentPayload, Payment } from "@/types/payment";
import { getErrorMessage } from "@/lib/utils/get-error-message";
import { useHotel } from "@/hooks/use-hotel";
import { useConfirmDialog } from "@/hooks/use-confirm-dialog";
import { usePermissions } from "@/hooks/use-permissions";

export function PaymentsPageContent() {
  const { hotelId } = useHotel();
  const {confirm} = useConfirmDialog();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const {can} = usePermissions();
  async function loadData() {
    if (!hotelId) {
      setPayments([]);
      setBookings([]);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError("");

      const [paymentsResult, bookingsResult] = await Promise.all([
        getPayments(),
        getBookings(),
      ]);

      setPayments(paymentsResult);
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

  async function handleCreate(payload: CreatePaymentPayload) {
    const approved = await confirm({
      title: "Create payment?",
      description: "Are you sure you want to create this payment?",
      confirmText: "Create payment",
    });

    if (!approved) return;

    await createPayment(payload);
    setSuccessMessage("Payment created successfully.");
    await loadData();

    window.setTimeout(() => {
      setSuccessMessage("");
    }, 3000);
  }

  if (!hotelId) {
    return (
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-800">
        Select a hotel first before managing payments.
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

      {can('payments.create') ? <PaymentForm bookings={bookings} onSubmit={handleCreate} /> : <div className="rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-500 shadow-sm">
        You do not have permission to create payments.
      </div>}

      {isLoading ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-500 shadow-sm">
          Loading payments...
        </div>
      ) : error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
          {error}
        </div>
      ) : (
        <PaymentList items={payments} />
      )}
    </div>
  );
}