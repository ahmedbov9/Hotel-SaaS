const { z } = require("zod");

const createGuestSchema = z.object({
  body: z.object({
    firstName: z.string().min(1).max(100),
    lastName: z.string().min(1).max(100),
    email: z.string().email().optional(),
    phone: z.string().max(30).optional(),
    nationality: z.string().max(100).optional(),
    idType: z.string().max(50).optional(),
    idNumber: z.string().max(100).optional(),
    dateOfBirth: z.string().datetime().optional(),
    notes: z.string().max(2000).optional(),
    tags: z.array(z.string().min(1).max(50)).optional(),
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});

const updateGuestSchema = z.object({
  body: z.object({
    firstName: z.string().min(1).max(100).optional(),
    lastName: z.string().min(1).max(100).optional(),
    email: z.string().email().optional(),
    phone: z.string().max(30).optional(),
    nationality: z.string().max(100).optional(),
    idType: z.string().max(50).optional(),
    idNumber: z.string().max(100).optional(),
    dateOfBirth: z.string().datetime().optional(),
    notes: z.string().max(2000).optional(),
    tags: z.array(z.string().min(1).max(50)).optional(),
  }),
  params: z.object({
    id: z.string().min(1),
  }),
  query: z.object({}).optional(),
});

module.exports = {
  createGuestSchema,
  updateGuestSchema,
};