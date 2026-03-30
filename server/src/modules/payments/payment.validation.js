const { z } = require("zod");

const createPaymentSchema = z.object({
  body: z.object({
    bookingId: z.string().min(1),
    amount: z.number().positive(),
    currency: z.string().min(3).max(10).optional(),
    method: z.enum(["cash", "card", "bank_transfer", "online"]).optional(),
    provider: z.enum(["manual", "stripe", "paypal", "moyasar"]).optional(),
    status: z.enum(["pending", "paid", "failed", "refunded"]).optional(),
    transactionId: z.string().max(255).optional(),
    paymentIntentId: z.string().max(255).optional(),
    notes: z.string().max(2000).optional(),
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});

module.exports = {
  createPaymentSchema,
};