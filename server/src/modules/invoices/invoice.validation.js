const { z } = require("zod");

const createInvoiceSchema = z.object({
  body: z.object({
    bookingId: z.string().min(1),
    currency: z.string().min(3).max(10).optional(),
    dueAt: z.string().datetime().optional(),
    notes: z.string().max(2000).optional(),
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});

const updateInvoiceStatusSchema = z.object({
  body: z.object({
    status: z.enum(["draft", "issued", "paid", "void"]),
    notes: z.string().max(2000).optional(),
  }),
  params: z.object({
    id: z.string().min(1),
  }),
  query: z.object({}).optional(),
});

module.exports = {
  createInvoiceSchema,
  updateInvoiceStatusSchema,
};