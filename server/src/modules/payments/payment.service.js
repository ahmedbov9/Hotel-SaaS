const Payment = require("./payment.model");
const Booking = require("../bookings/booking.model");
const AppError = require("../../common/errors/AppError");
const { PAYMENT_STATUS, BOOKING_STATUS } = require("../../config/constants");

function normalizeNullableString(value) {
  if (value === undefined) return undefined;
  if (value === null) return null;

  const trimmed = String(value).trim();
  return trimmed === "" ? null : trimmed;
}

async function createPayment(hotelId, userId, payload) {
  const booking = await Booking.findOne({
    _id: payload.bookingId,
    hotelId,
  });

  if (!booking) {
    throw new AppError("Booking not found for this hotel", 404);
  }

  if (booking.status === BOOKING_STATUS.CANCELLED) {
    throw new AppError("Cannot add payment to a cancelled booking", 400);
  }

  const amount = payload.amount;
  const status = payload.status || PAYMENT_STATUS.PAID;

  if (status === PAYMENT_STATUS.PAID && amount > booking.dueAmount) {
    throw new AppError("Payment amount cannot exceed booking dueAmount", 400);
  }

  const payment = await Payment.create({
    hotelId,
    bookingId: booking._id,
    amount,
    currency: payload.currency || "SAR",
    method: payload.method || "cash",
    provider: payload.provider || "manual",
    status,
    transactionId: normalizeNullableString(payload.transactionId),
    paymentIntentId: normalizeNullableString(payload.paymentIntentId),
    rawPayload: null,
    paidAt: status === PAYMENT_STATUS.PAID ? new Date() : null,
    notes: normalizeNullableString(payload.notes),
    createdBy: userId,
  });

  if (status === PAYMENT_STATUS.PAID) {
    booking.paidAmount += amount;
    booking.dueAmount = Math.max(0, booking.total - booking.paidAmount);

    if (booking.paidAmount > booking.total) {
      throw new AppError("Booking paidAmount cannot exceed total", 400);
    }

    if (
      booking.status === BOOKING_STATUS.PENDING &&
      booking.paidAmount > 0
    ) {
      booking.status = BOOKING_STATUS.CONFIRMED;
      booking.confirmedAt = booking.confirmedAt || new Date();
    }

    await booking.save();
  }

  return payment;
}

async function listPayments(hotelId) {
  return Payment.find({ hotelId })
    .populate("bookingId", "bookingNumber total paidAmount dueAmount status")
    .sort({ createdAt: -1 });
}

async function getPaymentById(hotelId, id) {
  const payment = await Payment.findOne({ _id: id, hotelId }).populate(
    "bookingId",
    "bookingNumber total paidAmount dueAmount status"
  );

  if (!payment) {
    throw new AppError("Payment not found", 404);
  }

  return payment;
}

module.exports = {
  createPayment,
  listPayments,
  getPaymentById,
};