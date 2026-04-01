import type { RoomType } from "@/types/room-type";

type RoomTypeListProps = {
  items: RoomType[];
};

export function RoomTypeList({ items }: RoomTypeListProps) {
  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-500 shadow-sm">
        No room types found for this hotel.
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
              <div className="flex items-center gap-3">
                <h3 className="text-lg font-semibold text-slate-900">{item.name}</h3>
                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                    item.isActive
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {item.isActive ? "Active" : "Inactive"}
                </span>
              </div>

              <p className="mt-2 text-sm text-slate-600">
                {item.description || "No description provided."}
              </p>

              <div className="mt-3 flex flex-wrap gap-2">
                {item.amenities.map((amenity) => (
                  <span
                    key={amenity}
                    className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-700"
                  >
                    {amenity}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid min-w-[220px] gap-2 text-sm text-slate-600">
              <p>
                <span className="font-medium text-slate-900">Bed:</span>{" "}
                {item.bedType}
              </p>
              <p>
                <span className="font-medium text-slate-900">Capacity:</span>{" "}
                {item.baseCapacity} - {item.maxCapacity}
              </p>
              <p>
                <span className="font-medium text-slate-900">Size:</span>{" "}
                {item.sizeInSqm ?? "--"} sqm
              </p>
              <p>
                <span className="font-medium text-slate-900">Base Price:</span>{" "}
                SAR {item.basePrice}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}