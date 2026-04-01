import type { BookingListItem } from "@/types/reports";

type BookingListProps = {
  title: string;
  items: BookingListItem[];
  dateKey: "checkInDate" | "checkOutDate";
};

function formatDate(date?: string) {
  if (!date) return "--";

  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(date));
}

export function BookingList({ title, items, dateKey }: BookingListProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="text-lg font-semibold text-slate-900">{title}</h3>

      {items.length === 0 ? (
        <p className="mt-3 text-sm text-slate-500">No records found.</p>
      ) : (
        <div className="mt-4 space-y-3">
          {items.map((item) => (
            <div
              key={item._id ?? item.bookingNumber}
              className="rounded-xl border border-slate-100 bg-slate-50 p-4"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    {item.bookingNumber}
                  </p>
                  <p className="mt-1 text-sm text-slate-600">
                    {item.guestSnapshot?.fullName ?? "Guest not available"}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    {item.roomSnapshot?.roomTypeName ?? "--"} • Room{" "}
                    {item.roomSnapshot?.roomNumber ?? "--"}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                    {item.status}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    {formatDate(item[dateKey])}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}