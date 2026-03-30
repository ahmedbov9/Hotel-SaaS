const { z } = require("zod");

const createRoomSchema = z.object({
  body: z.object({
    roomTypeId: z.string().min(1),
    roomNumber: z.string().min(1).max(20),
    floor: z.number().int().optional(),
    status: z
      .enum(["available", "occupied", "maintenance", "inactive"])
      .optional(),
    notes: z.string().max(1000).optional(),
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});

const updateRoomSchema = z.object({
  body: z.object({
    roomTypeId: z.string().min(1).optional(),
    roomNumber: z.string().min(1).max(20).optional(),
    floor: z.number().int().optional(),
    status: z
      .enum(["available", "occupied", "maintenance", "inactive"])
      .optional(),
    notes: z.string().max(1000).optional(),
  }),
  params: z.object({
    id: z.string().min(1),
  }),
  query: z.object({}).optional(),
});

module.exports = {
  createRoomSchema,
  updateRoomSchema,
};