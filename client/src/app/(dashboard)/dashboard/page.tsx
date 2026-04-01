import { PageContainer } from "@/components/shared/page-container";
import { HotelSwitcher } from "@/components/layout/hotel-switcher";
import { DashboardOverview } from "@/features/dashboard/components/dashboard-overview";

export default function DashboardPage() {
  return (
    <PageContainer>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            Overview
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            Monitor your hotel operations, revenue, and booking activity.
          </p>
        </div>

        <HotelSwitcher />
        <DashboardOverview />
      </div>
    </PageContainer>
  );
}