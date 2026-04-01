import { PageContainer } from "@/components/shared/page-container";
import { RoomTypesPageContent } from "@/features/room-types/components/rooms-types-page-content";

export default function RoomTypesPage() {
  return (
    <PageContainer>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            Room Types
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            Create and manage room categories for your hotel.
          </p>
        </div>

        <RoomTypesPageContent />
      </div>
    </PageContainer>
  );
}