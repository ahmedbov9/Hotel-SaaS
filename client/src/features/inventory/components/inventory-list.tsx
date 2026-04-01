import type { InventoryItem } from "@/types/inventory";

type InventoryListProps = {
  items: InventoryItem[];
};

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
  }).format(new Date(date));
}

export function InventoryList({ items }: InventoryListProps) {
  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-500 shadow-sm">
        No inventory records found for the selected range.
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
          <div className="grid gap-2 text-sm text-slate-600 md:grid-cols-3 xl:grid-cols-4">
            <p>
              <span className="font-medium text-slate-900">Date:</span>{" "}
              {formatDate(item.date)}
            </p>
            <p>
              <span className="font-medium text-slate-900">Total:</span>{" "}
              {item.totalInventory}
            </p>
            <p>
              <span className="font-medium text-slate-900">Reserved:</span>{" "}
              {item.reservedCount}
            </p>
            <p>
              <span className="font-medium text-slate-900">Available:</span>{" "}
              {item.availableCount}
            </p>
            <p>
              <span className="font-medium text-slate-900">Min Stay:</span>{" "}
              {item.minStay}
            </p>
            <p>
              <span className="font-medium text-slate-900">Stop Sell:</span>{" "}
              {item.stopSell ? "Yes" : "No"}
            </p>
            <p>
              <span className="font-medium text-slate-900">Price Override:</span>{" "}
              {item.priceOverride ?? "--"}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}