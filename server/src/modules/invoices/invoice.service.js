const Invoice = require("./invoice.model");
const Booking = require("../bookings/booking.model");
const AppError = require("../../common/errors/AppError");
const generateInvoiceNumber = require("../../common/utils/generateInvoiceNumber");
const { INVOICE_STATUS } = require("../../config/constants");
const  {normalizeNullableString}  = require("../../common/utils/utils");
const { parseOptionalDate } = require("./invoice.utils");



async function createInvoice(hotelId, userId, payload) {
  const booking = await Booking.findOne({
    _id: payload.bookingId,
    hotelId,
  });

  if (!booking) {
    throw new AppError("Booking not found for this hotel", 404);
  }

  const existingOpenInvoice = await Invoice.findOne({
    hotelId,
    bookingId: booking._id,
    status: { $in: [INVOICE_STATUS.DRAFT, INVOICE_STATUS.ISSUED] },
  });

  if (existingOpenInvoice) {
    throw new AppError("An active invoice already exists for this booking", 409);
  }

  let invoiceNumber = generateInvoiceNumber();
  while (await Invoice.findOne({ hotelId, invoiceNumber })) {
    invoiceNumber = generateInvoiceNumber();
  }

  const status =
    booking.dueAmount === 0 ? INVOICE_STATUS.PAID : INVOICE_STATUS.ISSUED;

  const invoice = await Invoice.create({
    hotelId,
    bookingId: booking._id,
    invoiceNumber,
    subtotal: booking.subtotal,
    taxAmount: booking.taxes,
    discountAmount: booking.discounts,
    totalAmount: booking.total,
    paidAmount: booking.paidAmount,
    dueAmount: booking.dueAmount,
    currency: payload.currency || "SAR",
    status,
    issuedAt: status === INVOICE_STATUS.ISSUED || status === INVOICE_STATUS.PAID ? new Date() : null,
    dueAt: parseOptionalDate(payload.dueAt, "dueAt") ?? null,
    notes: normalizeNullableString(payload.notes),
    createdBy: userId,
  });

  return invoice;
}

async function listInvoices(hotelId) {
  return Invoice.find({ hotelId })
    .populate("bookingId", "bookingNumber total paidAmount dueAmount status")
    .sort({ createdAt: -1 });
}

async function getInvoiceById(hotelId, id) {
  const invoice = await Invoice.findOne({ _id: id, hotelId }).populate(
    "bookingId",
    "bookingNumber total paidAmount dueAmount status guestSnapshot roomSnapshot"
  );

  if (!invoice) {
    throw new AppError("Invoice not found", 404);
  }

  return invoice;
}

async function updateInvoiceStatus(hotelId, id, payload) {
  const invoice = await Invoice.findOne({ _id: id, hotelId });

  if (!invoice) {
    throw new AppError("Invoice not found", 404);
  }

  if (invoice.status === INVOICE_STATUS.VOID && payload.status !== INVOICE_STATUS.VOID) {
    throw new AppError("Void invoice cannot be changed to another status", 400);
  }

  invoice.status = payload.status;

  if (
    (payload.status === INVOICE_STATUS.ISSUED || payload.status === INVOICE_STATUS.PAID) &&
    !invoice.issuedAt
  ) {
    invoice.issuedAt = new Date();
  }

  if (payload.notes !== undefined) {
    invoice.notes = normalizeNullableString(payload.notes);
  }

  await invoice.save();

  return invoice;
}

module.exports = {
  createInvoice,
  listInvoices,
  getInvoiceById,
  updateInvoiceStatus,
};