import { PageContainer } from "@/components/shared/page-container";
import { GuestsPageContent } from "@/features/guests/components/guests-page-content";

export default function GuestsPage() {
  return (
    <PageContainer>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            Guests
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            Create and manage guest profiles for your hotel.
          </p>
        </div>

        <GuestsPageContent />
      </div>
    </PageContainer>
  );
}