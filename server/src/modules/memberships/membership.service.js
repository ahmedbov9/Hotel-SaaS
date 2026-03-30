const User = require("../users/user.model");
const Membership = require("./membership.model");
const AppError = require("../../common/errors/AppError");
const { PLATFORM_ROLES } = require("../../config/constants");
const { getDefaultPermissionsByRole } = require("../../common/utils/getDefaultPermissionsByRole");


async function createMembership(hotelId, invitedByUserId, payload) {
  const existingUser = await User.findOne({ email: payload.email });

  if (existingUser) {
    throw new AppError("A user with this email already exists", 409);
  }

  const user = await User.create({
    fullName: payload.fullName,
    email: payload.email,
    password: payload.password,
    phone: payload.phone || null,
    role: PLATFORM_ROLES.HOTEL_STAFF,
  });

  const membership = await Membership.create({
    hotelId,
    userId: user._id,
    role: payload.role,
    permissions:
      payload.permissions && payload.permissions.length > 0
        ? payload.permissions
        : getDefaultPermissionsByRole(payload.role),
    isActive: true,
    invitedBy: invitedByUserId,
  });

  const populatedMembership = await Membership.findById(membership._id)
    .populate("userId", "fullName email phone role isActive")
    .populate("invitedBy", "fullName email");

  return populatedMembership;
}

async function listMemberships(hotelId) {
  return Membership.find({ hotelId })
    .populate("userId", "fullName email phone role isActive")
    .populate("invitedBy", "fullName email")
    .sort({ createdAt: -1 });
}

async function updateMembership(hotelId, membershipId, payload) {
  const membership = await Membership.findOne({
    _id: membershipId,
    hotelId,
  });

  if (!membership) {
    throw new AppError("Membership not found", 404);
  }

  if (payload.role !== undefined) {
    membership.role = payload.role;
  }

  if (payload.permissions !== undefined) {
    membership.permissions = payload.permissions;
  }

  if (payload.isActive !== undefined) {
    membership.isActive = payload.isActive;
  }

  await membership.save();

  return Membership.findById(membership._id)
    .populate("userId", "fullName email phone role isActive")
    .populate("invitedBy", "fullName email");
}

module.exports = {
  createMembership,
  listMemberships,
  updateMembership,
};