export type InvoiceStatus = "draft" | "issued" | "paid" | "void";

export type InvoiceBooking = {
  _id: string;
  bookingNumber: string;
  total: number;
  paidAmount: number;
  dueAmount: number;
  status: string;
};

export type Invoice = {
  _id: string;
  hotelId: string;
  bookingId: InvoiceBooking;
  invoiceNumber: string;
  subtotal: number;
  taxAmount: number;
  discountAmount: number;
  totalAmount: number;
  paidAmount: number;
  dueAmount: number;
  currency: string;
  status: InvoiceStatus;
  issuedAt: string | null;
  dueAt: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
};

export type CreateInvoicePayload = {
  bookingId: string;
  currency?: string;
  dueAt?: string;
  notes?: string;
};

export type UpdateInvoiceStatusPayload = {
  status: InvoiceStatus;
  notes?: string;
};