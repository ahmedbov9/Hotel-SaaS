export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";

export type PaymentMethod = "cash" | "card" | "bank_transfer" | "online";

export type PaymentProvider = "manual" | "stripe" | "paypal" | "moyasar";

export type PaymentBooking = {
  _id: string;
  bookingNumber: string;
  total: number;
  paidAmount: number;
  dueAmount: number;
  status: string;
};

export type Payment = {
  _id: string;
  hotelId: string;
  bookingId: PaymentBooking;
  amount: number;
  currency: string;
  method: PaymentMethod;
  provider: PaymentProvider;
  status: PaymentStatus;
  transactionId: string | null;
  paymentIntentId: string | null;
  notes: string | null;
  paidAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type CreatePaymentPayload = {
  bookingId: string;
  amount: number;
  currency?: string;
  method?: PaymentMethod;
  provider?: PaymentProvider;
  status?: PaymentStatus;
  transactionId?: string;
  paymentIntentId?: string;
  notes?: string;
};