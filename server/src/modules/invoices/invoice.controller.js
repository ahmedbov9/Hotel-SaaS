const asyncHandler = require("../../common/utils/asyncHandler");
const invoiceService = require("./invoice.service");



/**
 * @desc    Create a new invoice
 * @route   POST /api/invoices
 * @headers Authorization: Bearer <token> && x-hotel-id: <hotelId>
 * @access  Private
 */

exports.create = asyncHandler(async (req, res) => {
  const invoice = await invoiceService.createInvoice(
    req.hotel._id,
    req.user.id,
    req.validated.body
  );

  res.status(201).json({
    success: true,
    message: "Invoice created successfully",
    data: invoice,
  });
});

/**
 * @desc    List all invoices
 * @route   GET /api/invoices
 * @headers Authorization: Bearer <token> && x-hotel-id: <hotelId>
 * @access  Private
 */

exports.list = asyncHandler(async (req, res) => {
  const invoices = await invoiceService.listInvoices(req.hotel._id);

  res.status(200).json({
    success: true,
    data: invoices,
  });
});

/**
 * @desc    Get invoice details by ID
 * @route   GET /api/invoices/:id
 * @headers Authorization: Bearer <token> && x-hotel-id: <hotelId>
 * @access  Private
 */

exports.getById = asyncHandler(async (req, res) => {
  const invoice = await invoiceService.getInvoiceById(req.hotel._id, req.params.id);

  res.status(200).json({
    success: true,
    data: invoice,
  });
});

/**
 * @desc    Update invoice status
 * @route   PATCH /api/invoices/:id/status
 * @headers Authorization: Bearer <token> && x-hotel-id: <hotelId>
 * @access  Private
 */

exports.updateStatus = asyncHandler(async (req, res) => {
  const invoice = await invoiceService.updateInvoiceStatus(
    req.hotel._id,
    req.params.id,
    req.validated.body
  );

  res.status(200).json({
    success: true,
    message: "Invoice status updated successfully",
    data: invoice,
  });
});