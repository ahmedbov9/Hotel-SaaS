const { mongoose, baseOptions } = require("../../common/database/base.schema");
const {
  PAYMENT_STATUS,
  PAYMENT_METHOD,
  PAYMENT_PROVIDER,
} = require("../../config/constants");

const paymentSchema = new mongoose.Schema(
  {
    hotelId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hotel",
      required: true,
      index: true,
    },
    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
      index: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0.01,
    },
    currency: {
      type: String,
      required: true,
      default: "SAR",
      trim: true,
      uppercase: true,
    },
    method: {
      type: String,
      enum: Object.values(PAYMENT_METHOD),
      required: true,
      default: PAYMENT_METHOD.MANUAL,
    },
    provider: {
      type: String,
      enum: Object.values(PAYMENT_PROVIDER),
      required: true,
      default: PAYMENT_PROVIDER.MANUAL,
    },
    status: {
      type: String,
      enum: Object.values(PAYMENT_STATUS),
      required: true,
      default: PAYMENT_STATUS.PAID,
    },
    transactionId: {
      type: String,
      default: null,
      trim: true,
      index: true,
    },
    paymentIntentId: {
      type: String,
      default: null,
      trim: true,
    },
    rawPayload: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
    paidAt: {
      type: Date,
      default: Date.now,
    },
    notes: {
      type: String,
      default: null,
      trim: true,
      maxlength: 2000,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  baseOptions
);

paymentSchema.index({ hotelId: 1, bookingId: 1, createdAt: -1 });
paymentSchema.index(
  { hotelId: 1, provider: 1, transactionId: 1 },
  { unique: true, partialFilterExpression: { transactionId: { $type: "string" } } }
);

module.exports = mongoose.model("Payment", paymentSchema);