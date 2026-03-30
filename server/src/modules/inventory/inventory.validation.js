const { z } = require("zod");

const inventoryEntrySchema = z.object({
  date: z.string().datetime(),
  totalInventory: z.number().int().min(0),
  reservedCount: z.number().int().min(0).optional(),
  stopSell: z.boolean().optional(),
  minStay: z.number().int().min(1).optional(),
  priceOverride: z.number().nonnegative().nullable().optional(),
});

const bulkUpsertInventorySchema = z.object({
  body: z.object({
    roomTypeId: z.string().min(1),
    entries: z.array(inventoryEntrySchema).min(1),
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});

const getInventoryRangeSchema = z.object({
  body: z.object({}).optional(),
  params: z.object({}).optional(),
  query: z.object({
    roomTypeId: z.string().min(1),
    startDate: z.string().datetime(),
    endDate: z.string().datetime(),
  }),
});

module.exports = {
  bulkUpsertInventorySchema,
  getInventoryRangeSchema,
};