const { z } = require("zod");

const getPublicAvailabilitySchema = z.object({
  body: z.object({}).optional(),
  params: z.object({
    slug: z.string().min(1),
  }),
  query: z.object({
    checkInDate: z.string().datetime(),
    checkOutDate: z.string().datetime(),
    adults: z.coerce.number().int().min(1),
    children: z.coerce.number().int().min(0).optional(),
  }),
});

const createPublicBookingSchema = z.object({
  body: z.object({
    roomTypeId: z.string().min(1),
    checkInDate: z.string().datetime(),
    checkOutDate: z.string().datetime(),
    adults: z.coerce.number().int().min(1),
    children: z.number().int().min(0).optional(),
    specialRequests: z.string().max(2000).optional(),

    guest: z.object({
      firstName: z.string().min(1).max(100),
      lastName: z.string().min(1).max(100),
      email: z.string().email().optional(),
      phone: z.string().max(30).optional(),
      nationality: z.string().max(100).optional(),
      idType: z.string().max(50).optional(),
      idNumber: z.string().max(100).optional(),
      dateOfBirth: z.string().datetime().optional(),
      notes: z.string().max(2000).optional(),
    }),
  }),
  params: z.object({
    slug: z.string().min(1),
  }),
  query: z.object({}).optional(),
});

module.exports = {
  getPublicAvailabilitySchema,
  createPublicBookingSchema,
};