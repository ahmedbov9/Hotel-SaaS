import { PageContainer } from "@/components/shared/page-container";
import { InvoicesPageContent } from "@/features/invoices/components/invoices-page-content";

export default function InvoicesPage() {
  return (
    <PageContainer>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            Invoices
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            Generate and manage invoices for bookings in your hotel.
          </p>
        </div>

        <InvoicesPageContent />
      </div>
    </PageContainer>
  );
}