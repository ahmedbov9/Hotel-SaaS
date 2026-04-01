import { PublicBookingPageContent } from "@/features/public-booking/components/public-booking-page-content";

type PublicHotelPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function PublicHotelPage({
  params,
}: PublicHotelPageProps) {
  const { slug } = await params;

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 text-slate-900">
      <div className="mx-auto max-w-6xl">
        <PublicBookingPageContent slug={slug} />
      </div>
    </main>
  );
}