const { z } = require("zod");

const membershipRoleEnum = z.enum([
  "owner",
  "manager",
  "receptionist",
  "accountant",
]);

const createMembershipSchema = z.object({
  body: z.object({
    fullName: z.string().min(3).max(60),
    email: z.string().email(),
    password: z.string().min(6).max(100),
    phone: z.string().max(30).optional(),
    role: membershipRoleEnum,
    permissions: z.array(z.string().min(1).max(100)).optional(),
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});

const updateMembershipSchema = z.object({
  body: z.object({
    role: membershipRoleEnum.optional(),
    permissions: z.array(z.string().min(1).max(100)).optional(),
    isActive: z.boolean().optional(),
  }),
  params: z.object({
    id: z.string().min(1),
  }),
  query: z.object({}).optional(),
});

module.exports = {
  createMembershipSchema,
  updateMembershipSchema,
};