import { PageContainer } from "@/components/shared/page-container";
import { BookingsPageContent } from "@/features/bookings/components/bookings-page-content";

export default function BookingsPage() {
  return (
    <PageContainer>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            Bookings
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            Create and manage bookings for your hotel.
          </p>
        </div>

        <BookingsPageContent />
      </div>
    </PageContainer>
  );
}