import type { Payment } from "@/types/payment";

type PaymentListProps = {
  items: Payment[];
};

function formatDate(date?: string | null) {
  if (!date) return "--";

  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(date));
}

export function PaymentList({ items }: PaymentListProps) {
  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-500 shadow-sm">
        No payments found for this hotel.
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
                  {item.bookingId.bookingNumber}
                </h3>

                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
                  {item.status}
                </span>
              </div>

              <div className="mt-2 space-y-1 text-sm text-slate-600">
                <p>
                  Amount: {item.currency} {item.amount}
                </p>
                <p>
                  Method: {item.method} • Provider: {item.provider}
                </p>
                <p>
                  Booking Due: {item.bookingId.dueAmount}
                </p>
                <p>
                  Paid At: {formatDate(item.paidAt)}
                </p>
                <p>
                  Transaction ID: {item.transactionId || "--"}
                </p>
              </div>

              <p className="mt-3 text-sm text-slate-500">
                {item.notes || "No notes"}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}