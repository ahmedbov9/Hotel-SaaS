import { PageContainer } from "@/components/shared/page-container";
import { PaymentsPageContent } from "@/features/payments/components/payments-page-content";

export default function PaymentsPage() {
  return (
    <PageContainer>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            Payments
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            Record and review booking payments for your hotel.
          </p>
        </div>

        <PaymentsPageContent />
      </div>
    </PageContainer>
  );
}