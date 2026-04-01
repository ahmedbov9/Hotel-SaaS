import type { Guest } from "@/types/guest";

type GuestListProps = {
  items: Guest[];
};

export function GuestList({ items }: GuestListProps) {
  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-500 shadow-sm">
        No guests found for this hotel.
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
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">
                {item.firstName} {item.lastName}
              </h3>

              <div className="mt-2 space-y-1 text-sm text-slate-600">
                <p>Email: {item.email || "--"}</p>
                <p>Phone: {item.phone || "--"}</p>
                <p>Nationality: {item.nationality || "--"}</p>
                <p>
                  ID: {item.idType || "--"} {item.idNumber ? `• ${item.idNumber}` : ""}
                </p>
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                {item.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-700"
                  >
                    {tag}
                  </span>
                ))}
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