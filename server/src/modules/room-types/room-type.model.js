const { mongoose, baseOptions } = require("../../common/database/base.schema");

const roomTypeSchema = new mongoose.Schema(
  {
    hotelId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hotel",
      required: true,
      index: true,
    },
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
      trim: true,
      lowercase: true,
    },
    description: {
      type: String,
      default: null,
      trim: true,
      maxlength: 2000,
    },
    baseCapacity: {
      type: Number,
      required: true,
      min: 1,
    },
    maxCapacity: {
      type: Number,
      required: true,
      min: 1,
    },
    bedType: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50,
    },
    sizeInSqm: {
      type: Number,
      default: null,
      min: 0,
    },
    amenities: {
      type: [String],
      default: [],
    },
    images: [
      {
        url: { type: String, required: true },
        alt: { type: String, default: "" },
      },
    ],
    basePrice: {
      type: Number,
      required: true,
      min: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  baseOptions
);

roomTypeSchema.index({ hotelId: 1, slug: 1 }, { unique: true });
roomTypeSchema.index({ hotelId: 1, name: 1 });

module.exports = mongoose.model("RoomType", roomTypeSchema);