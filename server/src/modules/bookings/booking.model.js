const { mongoose, baseOptions } = require("../../common/database/base.schema");
const { BOOKING_STATUS, BOOKING_SOURCE } = require("../../config/constants");

const bookingSchema = new mongoose.Schema(
  {
    hotelId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hotel",
      required: true,
      index: true,
    },
    bookingNumber: {
      type: String,
      required: true,
      trim: true,
    },
    guestId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Guest",
      required: true,
      index: true,
    },
    roomTypeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RoomType",
      required: true,
      index: true,
    },
    roomId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
      required: true,
      index: true,
    },
    source: {
      type: String,
      enum: Object.values(BOOKING_SOURCE),
      default: BOOKING_SOURCE.ADMIN,
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(BOOKING_STATUS),
      default: BOOKING_STATUS.PENDING,
      required: true,
      index: true,
    },
    checkInDate: {
      type: Date,
      required: true,
      index: true,
    },
    checkOutDate: {
      type: Date,
      required: true,
      index: true,
    },
    nights: {
      type: Number,
      required: true,
      min: 1,
    },
    adults: {
      type: Number,
      required: true,
      min: 1,
      default: 1,
    },
    children: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    specialRequests: {
      type: String,
      default: null,
      trim: true,
      maxlength: 2000,
    },
    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },
    taxes: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    discounts: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    total: {
      type: Number,
      required: true,
      min: 0,
    },
    paidAmount: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    dueAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    guestSnapshot: {
      fullName: { type: String, required: true },
      email: { type: String, default: null },
      phone: { type: String, default: null },
      nationality: { type: String, default: null },
      idType: { type: String, default: null },
      idNumber: { type: String, default: null },
    },
    roomSnapshot: {
      roomNumber: { type: String, required: true },
      roomTypeName: { type: String, required: true },
      bedType: { type: String, default: null },
      basePrice: { type: Number, default: 0 },
    },
    pricingSnapshot: {
      nightlyRates: [
        {
          date: { type: Date, required: true },
          price: { type: Number, required: true, min: 0 },
          source: {
            type: String,
            enum: ["base_price", "price_override"],
            required: true,
          },
        },
      ],
    },
    assignedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    confirmedAt: {
      type: Date,
      default: null,
    },
    checkedInAt: {
      type: Date,
      default: null,
    },
    checkedOutAt: {
      type: Date,
      default: null,
    },
    cancelledAt: {
      type: Date,
      default: null,
    },
    cancellationReason: {
      type: String,
      default: null,
      trim: true,
      maxlength: 1000,
    },
  },
  baseOptions,
);

bookingSchema.index({ hotelId: 1, bookingNumber: 1 }, { unique: true });
bookingSchema.index({ hotelId: 1, guestId: 1 });
bookingSchema.index({ hotelId: 1, roomId: 1, checkInDate: 1, checkOutDate: 1 });
bookingSchema.index({ hotelId: 1, status: 1, checkInDate: 1 });

module.exports = mongoose.model("Booking", bookingSchema);
