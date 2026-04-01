import { PageContainer } from "@/components/shared/page-container";
import { InventoryPageContent } from "@/features/inventory/components/inventory-page-content";

export default function InventoryPage() {
  return (
    <PageContainer>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            Inventory
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            Manage availability, stop-sell, minimum stay, and price overrides.
          </p>
        </div>

        <InventoryPageContent />
      </div>
    </PageContainer>
  );
}