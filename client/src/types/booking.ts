export type BookingStatus =
  | "pending"
  | "confirmed"
  | "checked_in"
  | "checked_out"
  | "cancelled"
  | "no_show";

export type Booking = {
  _id: string;
  bookingNumber: string;
  hotelId: string;
  guestId: string;
  roomTypeId: string;
  roomId: string;
  source: string;
  status: BookingStatus;
  checkInDate: string;
  checkOutDate: string;
  nights: number;
  adults: number;
  children: number;
  specialRequests: string | null;
  subtotal: number;
  taxes: number;
  discounts: number;
  total: number;
  paidAmount: number;
  dueAmount: number;
  guestSnapshot?: {
    fullName?: string;
    email?: string | null;
    phone?: string | null;
  };
  roomSnapshot?: {
    roomNumber?: string;
    roomTypeName?: string;
  };
  createdAt: string;
  updatedAt: string;
};

export type CreateBookingPayload = {
  guestId: string;
  roomTypeId: string;
  roomId: string;
  source?: "direct" | "admin" | "ota" | "walk_in";
  checkInDate: string;
  checkOutDate: string;
  adults: number;
  children?: number;
  specialRequests?: string;
  taxes?: number;
  discounts?: number;
  paidAmount?: number;
};