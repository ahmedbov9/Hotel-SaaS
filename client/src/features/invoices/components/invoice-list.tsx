"use client";

import type { Invoice, InvoiceStatus } from "@/types/invoice";

type InvoiceListProps = {
  items: Invoice[];
  canManage: boolean;
  onUpdateStatus: (id: string, status: InvoiceStatus) => Promise<void>;
};

function formatDate(date?: string | null) {
  if (!date) return "--";

  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(date));
}

export function InvoiceList({
  items,
  canManage,
  onUpdateStatus,
}: InvoiceListProps) {
  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-500 shadow-sm">
        No invoices found for this hotel.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <div
          key={item._id}
          className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
        >
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <h3 className="text-lg font-semibold text-slate-900">
                  {item.invoiceNumber}
                </h3>

                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
                  {item.status}
                </span>
              </div>

              <div className="mt-2 space-y-1 text-sm text-slate-600">
                <p>Booking: {item.bookingId.bookingNumber}</p>
                <p>
                  Total: {item.currency} {item.totalAmount}
                </p>
                <p>
                  Paid: {item.currency} {item.paidAmount} • Due: {item.currency}{" "}
                  {item.dueAmount}
                </p>
                <p>Issued At: {formatDate(item.issuedAt)}</p>
                <p>Due At: {formatDate(item.dueAt)}</p>
              </div>

              <p className="mt-3 text-sm text-slate-500">
                {item.notes || "No notes"}
              </p>
            </div>

            {canManage ? (
              <div className="flex flex-wrap gap-2">
                {item.status !== "issued" && item.status !== "void" ? (
                  <button
                    onClick={() => onUpdateStatus(item._id, "issued")}
                    className="rounded-xl border border-slate-300 px-3 py-2 text-xs font-medium text-slate-700"
                  >
                    Mark Issued
                  </button>
                ) : null}

                {item.status !== "paid" && item.status !== "void" ? (
                  <button
                    onClick={() => onUpdateStatus(item._id, "paid")}
                    className="rounded-xl border border-slate-300 px-3 py-2 text-xs font-medium text-slate-700"
                  >
                    Mark Paid
                  </button>
                ) : null}

                {item.status !== "void" ? (
                  <button
                    onClick={() => onUpdateStatus(item._id, "void")}
                    className="rounded-xl border border-red-200 px-3 py-2 text-xs font-medium text-red-700"
                  >
                    Void
                  </button>
                ) : null}
              </div>
            ) : null}
          </div>
        </div>
      ))}
    </div>
  );
}
