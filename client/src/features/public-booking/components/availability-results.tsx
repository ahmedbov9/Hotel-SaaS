import type {
  CreatePublicBookingPayload,
  PublicAvailabilityRoomType,
} from "@/types/public-booking";
import { PublicBookingForm } from "./public-booking-form";

type AvailabilityResultsProps = {
  items: PublicAvailabilityRoomType[];
  checkInDate: string;
  checkOutDate: string;
  adults: number;
  childrenCount: number;
  onBook: (payload: CreatePublicBookingPayload) => Promise<void>;
};

export function AvailabilityResults({
  items,
  checkInDate,
  checkOutDate,
  adults,
  childrenCount,
  onBook,
}: AvailabilityResultsProps) {



  if (items.length === 0) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-6 text-sm text-slate-500 shadow-sm">
        No available room types were found for the selected dates.
      </div>
    );
  }




  return (
    <div className="space-y-4">
      {items.map((item) => (



        <div
          key={item.roomType.id}
          className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <h3 className="text-xl font-semibold text-slate-900">
                {item.roomType.name}
              </h3>

              <p className="mt-2 text-sm text-slate-600">
                {item.roomType.description || "No description provided."}
              </p>

              <div className="mt-3 flex flex-wrap gap-2">
                {(item.roomType.amenities ?? []).map((amenity) => (
                  <span
                    key={amenity}
                    className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-700"
                  >
                    {amenity}
                  </span>
                ))}
              </div>

              <div className="mt-4 space-y-1 text-sm text-slate-600">
                <p>Bed Type: {item.roomType.bedType}</p>
                <p>
                  Capacity: {item.roomType.baseCapacity} -{" "}
                  {item.roomType.maxCapacity}
                </p>
                <p>Size: {item.roomType.sizeInSqm ?? "--"} sqm</p>
              </div>
            </div>

            <div className="min-w-[240px] rounded-2xl border border-slate-100 bg-slate-50 p-4">
              {item.pricing ? (
                <>
                  <p className="text-sm text-slate-500">
                    {item.pricing.nights} nights
                  </p>
                  <p className="mt-2 text-2xl font-bold text-slate-900">
                    {item.pricing.currency} {item.pricing.subtotal}
                  </p>

                  <div className="mt-4">
                    <PublicBookingForm
                      roomType={item}
                      checkInDate={checkInDate}
                      checkOutDate={checkOutDate}
                      adults={adults}
                      childrenCount={childrenCount}
                      onSubmit={onBook}
                    />
                  </div>
                </>
              ) : (
                <div className="text-sm text-amber-700">
                  Pricing information is unavailable for this room type.
                </div>
              )}
            </div>
          </div>
        </div>

        ))}

    </div>
  );
}
