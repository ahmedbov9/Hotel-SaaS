import { api } from "@/lib/api/client";
import type {
  CreateInvoicePayload,
  Invoice,
  UpdateInvoiceStatusPayload,
} from "@/types/invoice";

export async function getInvoices() {
  return api.get<Invoice[]>("/invoices");
}

export async function createInvoice(payload: CreateInvoicePayload) {
  return api.post<Invoice>("/invoices", payload);
}

export async function updateInvoiceStatus(
  id: string,
  payload: UpdateInvoiceStatusPayload,
) {
  return api.patch<Invoice>(`/invoices/${id}/status`, payload);
}