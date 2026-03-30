const { z } = require("zod");

const imageSchema = z.object({
  url: z.string().url(),
  alt: z.string().max(200).optional(),
});

const createRoomTypeSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(100),
    description: z.string().max(2000).optional(),
    baseCapacity: z.number().int().min(1),
    maxCapacity: z.number().int().min(1),
    bedType: z.string().min(2).max(50),
    sizeInSqm: z.number().nonnegative().optional(),
    amenities: z.array(z.string().min(1).max(100)).optional(),
    images: z.array(imageSchema).optional(),
    basePrice: z.number().nonnegative(),
    isActive: z.boolean().optional(),
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});

const updateRoomTypeSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(100).optional(),
    description: z.string().max(2000).optional(),
    baseCapacity: z.number().int().min(1).optional(),
    maxCapacity: z.number().int().min(1).optional(),
    bedType: z.string().min(2).max(50).optional(),
    sizeInSqm: z.number().nonnegative().optional(),
    amenities: z.array(z.string().min(1).max(100)).optional(),
    images: z.array(imageSchema).optional(),
    basePrice: z.number().nonnegative().optional(),
    isActive: z.boolean().optional(),
  }),
  params: z.object({
    id: z.string().min(1),
  }),
  query: z.object({}).optional(),
});

module.exports = {
  createRoomTypeSchema,
  updateRoomTypeSchema,
};