const { z } = require("zod");

const bookingStatusEnum = z.enum([
  "pending",
  "confirmed",
  "checked_in",
  "checked_out",
  "cancelled",
  "no_show",
]);

const bookingSourceEnum = z.enum(["direct", "admin", "ota", "walk_in"]);

const createBookingSchema = z.object({
  body: z.object({
    guestId: z.string().min(1),
    roomTypeId: z.string().min(1),
    roomId: z.string().min(1),
    source: bookingSourceEnum.optional(),
    checkInDate: z.string().datetime(),
    checkOutDate: z.string().datetime(),
    adults: z.number().int().min(1),
    children: z.number().int().min(0).optional(),
    specialRequests: z.string().max(2000).optional(),
    taxes: z.number().nonnegative().optional(),
    discounts: z.number().nonnegative().optional(),
    paidAmount: z.number().nonnegative().optional(),
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});

const updateBookingSchema = z.object({
  body: z.object({
    guestId: z.string().min(1).optional(),
    roomTypeId: z.string().min(1).optional(),
    roomId: z.string().min(1).optional(),
    source: bookingSourceEnum.optional(),
    status: bookingStatusEnum.optional(),
    checkInDate: z.string().datetime().optional(),
    checkOutDate: z.string().datetime().optional(),
    adults: z.number().int().min(1).optional(),
    children: z.number().int().min(0).optional(),
    specialRequests: z.string().max(2000).optional(),
    taxes: z.number().nonnegative().optional(),
    discounts: z.number().nonnegative().optional(),
    paidAmount: z.number().nonnegative().optional(),
    cancellationReason: z.string().max(1000).optional(),
  }),
  params: z.object({
    id: z.string().min(1),
  }),
  query: z.object({}).optional(),
});

const cancelBookingSchema = z.object({
  body: z.object({
    cancellationReason: z.string().max(1000).optional(),
  }),
  params: z.object({
    id: z.string().min(1),
  }),
  query: z.object({}).optional(),
});

module.exports = {
  createBookingSchema,
  updateBookingSchema,
  cancelBookingSchema,
};