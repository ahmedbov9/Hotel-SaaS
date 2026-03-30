const { z } = require("zod");

const createHotelSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(100),
    legalName: z.string().max(150).optional(),
    email: z.string().email().optional(),
    phone: z.string().max(20).optional(),
    country: z.string().max(100).optional(),
    city: z.string().max(100).optional(),
    address: z.string().max(300).optional(),
    timezone: z.string().max(100).optional(),
    currency: z.string().max(10).optional(),
    taxNumber: z.string().max(50).optional(),
    starRating: z.number().int().min(1).max(5).optional(),
    logo: z.string().url().optional(),
    coverImage: z.string().url().optional(),
    description: z.string().max(2000).optional(),
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});

module.exports = {
  createHotelSchema,
};