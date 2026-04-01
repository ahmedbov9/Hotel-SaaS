import type { PublicHotel } from "@/types/public-booking";

type HotelHeroProps = {
  hotel: PublicHotel;
};

export function HotelHero({ hotel }: HotelHeroProps) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <p className="text-sm font-medium text-slate-500">Hotel</p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
        {hotel.name}
      </h1>

      <div className="mt-3 flex flex-wrap gap-3 text-sm text-slate-600">
        <span>{hotel.city || "--"}</span>
        <span>•</span>
        <span>{hotel.country || "--"}</span>
        <span>•</span>
        <span>{hotel.currency || "SAR"}</span>
      </div>

      <p className="mt-4 max-w-3xl text-sm leading-6 text-slate-600">
        {hotel.description || "No description provided."}
      </p>
    </section>
  );
}