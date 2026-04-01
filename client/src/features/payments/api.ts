import { api } from "@/lib/api/client";
import type { CreatePaymentPayload, Payment } from "@/types/payment";

export async function getPayments() {
  return api.get<Payment[]>("/payments");
}

export async function createPayment(payload: CreatePaymentPayload) {
  return api.post<Payment>("/payments", payload);
}