import { PageContainer } from "@/components/shared/page-container";
import { RoomsPageContent } from "@/features/rooms/components/rooms-page-content";

export default function RoomsPage() {
  return (
    <PageContainer>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            Rooms
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            Create and manage physical rooms for your hotel.
          </p>
        </div>

        <RoomsPageContent />
      </div>
    </PageContainer>
  );
}