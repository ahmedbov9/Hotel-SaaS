import { PageContainer } from "@/components/shared/page-container";
import { MembershipsPageContent } from "@/features/memberships/components/memberships-page-content";

export default function MembershipsPage() {
  return (
    <PageContainer>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            Staff
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            Create and manage staff memberships for your hotel.
          </p>
        </div>

        <MembershipsPageContent />
      </div>
    </PageContainer>
  );
}