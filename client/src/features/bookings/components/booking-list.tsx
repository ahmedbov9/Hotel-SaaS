import type { Booking } from "@/types/booking";

type BookingListProps = {
  items: Booking[];
  canConfirm: boolean;
  canCheckIn: boolean;
  canCheckOut: boolean;
  canCancel: boolean;
  onConfirm: (id: string) => Promise<void>;
  onCheckIn: (id: string) => Promise<void>;
  onCheckOut: (id: string) => Promise<void>;
  onCancel: (id: string) => Promise<void>;
};

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(date));
}

export function BookingList({
  items,
  onConfirm,
  onCheckIn,
  onCheckOut,
  onCancel,
  canConfirm,
  canCheckIn,
  canCheckOut,
  canCancel,
}: BookingListProps) {
  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-500 shadow-sm">
        No bookings found for this hotel.
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
                  {item.bookingNumber}
                </h3>
                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
                  {item.status}
                </span>
              </div>

              <div className="mt-2 space-y-1 text-sm text-slate-600">
                <p>Guest: {item.guestSnapshot?.fullName ?? "--"}</p>
                <p>
                  Room: {item.roomSnapshot?.roomTypeName ?? "--"} •{" "}
                  {item.roomSnapshot?.roomNumber ?? "--"}
                </p>
                <p>
                  Stay: {formatDate(item.checkInDate)} →{" "}
                  {formatDate(item.checkOutDate)}
                </p>
                <p>
                  Total: SAR {item.total} • Due: SAR {item.dueAmount}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {item.status === "pending" && canConfirm ? (
                <button
                  onClick={() => onConfirm(item._id)}
                  className="rounded-xl bg-slate-900 px-3 py-2 text-xs font-medium text-white"
                >
                  Confirm
                </button>
              ) : null}

              {(item.status === "pending" || item.status === "confirmed") &&
              canCheckIn ? (
                <button
                  onClick={() => onCheckIn(item._id)}
                  className="rounded-xl border border-slate-300 px-3 py-2 text-xs font-medium text-slate-700"
                >
                  Check-in
                </button>
              ) : null}

              {item.status === "checked_in" && canCheckOut ? (
                <button
                  onClick={() => onCheckOut(item._id)}
                  className="rounded-xl border border-slate-300 px-3 py-2 text-xs font-medium text-slate-700"
                >
                  Check-out
                </button>
              ) : null}

              {item.status !== "cancelled" &&
              item.status !== "checked_out" &&
              canCancel ? (
                <button
                  onClick={() => onCancel(item._id)}
                  className="rounded-xl border border-red-200 px-3 py-2 text-xs font-medium text-red-700"
                >
                  Cancel
                </button>
              ) : null}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
