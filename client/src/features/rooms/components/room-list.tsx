import type { Room } from "@/types/room";
import type { RoomType } from "@/types/room-type";

type RoomListProps = {
  items: Room[];
};

function getRoomTypeName(roomTypeId: Room["roomTypeId"]) {
  if (typeof roomTypeId === "string") return roomTypeId;
  return roomTypeId?.name ?? "--";
}

export function RoomList({ items }: RoomListProps) {
  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-500 shadow-sm">
        No rooms found for this hotel.
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
                <h3 className="text-lg font-semibold text-slate-900">
                  Room {item.roomNumber}
                </h3>
                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
                  {item.status}
                </span>
              </div>

              <p className="mt-2 text-sm text-slate-600">
                Room Type: {getRoomTypeName(item.roomTypeId)}
              </p>

              <p className="mt-1 text-sm text-slate-600">
                Floor: {item.floor ?? "--"}
              </p>

              <p className="mt-1 text-sm text-slate-600">
                Notes: {item.notes || "No notes"}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}