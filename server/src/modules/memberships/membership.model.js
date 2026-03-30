const { mongoose, baseOptions } = require("../../common/database/base.schema");
const { HOTEL_MEMBERSHIP_ROLES } = require("../../config/constants");

const membershipSchema = new mongoose.Schema(
  {
    hotelId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hotel",
      required: true,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    role: {
      type: String,
      enum: Object.values(HOTEL_MEMBERSHIP_ROLES),
      default: HOTEL_MEMBERSHIP_ROLES.OWNER,
      required: true,
    },
    permissions: {
      type: [String],
      default: ["*"],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    invitedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  baseOptions
);

membershipSchema.index({ hotelId: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model("HotelMembership", membershipSchema);