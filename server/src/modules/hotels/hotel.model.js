const { mongoose, baseOptions } = require("../../common/database/base.schema");
const { HOTEL_STATUS } = require("../../config/constants");

const hotelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    legalName: {
      type: String,
      trim: true,
      default: null,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      default: null,
    },
    phone: {
      type: String,
      trim: true,
      default: null,
    },
    country: {
      type: String,
      trim: true,
      default: "Saudi Arabia",
    },
    city: {
      type: String,
      trim: true,
      default: null,
    },
    address: {
      type: String,
      trim: true,
      default: null,
    },
    timezone: {
      type: String,
      default: "Asia/Riyadh",
    },
    currency: {
      type: String,
      default: "SAR",
    },
    taxNumber: {
      type: String,
      default: null,
    },
    starRating: {
      type: Number,
      min: 1,
      max: 5,
      default: null,
    },
    logo: {
      type: String,
      default: null,
    },
    coverImage: {
      type: String,
      default: null,
    },
    description: {
      type: String,
      default: null,
    },
    status: {
      type: String,
      enum: Object.values(HOTEL_STATUS),
      default: HOTEL_STATUS.ACTIVE,
    },
    ownerUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
  },
  baseOptions
);

module.exports = mongoose.model("Hotel", hotelSchema);