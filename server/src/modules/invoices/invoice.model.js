const { mongoose, baseOptions } = require("../../common/database/base.schema");
const { INVOICE_STATUS } = require("../../config/constants");

const invoiceSchema = new mongoose.Schema(
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
    invoiceNumber: {
      type: String,
      required: true,
      trim: true,
    },
    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },
    taxAmount: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    discountAmount: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    totalAmount: {
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
    currency: {
      type: String,
      required: true,
      default: "SAR",
      trim: true,
      uppercase: true,
    },
    status: {
      type: String,
      enum: Object.values(INVOICE_STATUS),
      default: INVOICE_STATUS.DRAFT,
      required: true,
      index: true,
    },
    issuedAt: {
      type: Date,
      default: null,
    },
    dueAt: {
      type: Date,
      default: null,
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

invoiceSchema.index({ hotelId: 1, invoiceNumber: 1 }, { unique: true });
invoiceSchema.index({ hotelId: 1, bookingId: 1, status: 1 });

module.exports = mongoose.model("Invoice", invoiceSchema);