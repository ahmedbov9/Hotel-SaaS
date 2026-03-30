const asyncHandler = require("../../common/utils/asyncHandler");
const paymentService = require("./payment.service");


/**
 * @desc    Create a new payment
 * @route   POST /api/payments
 * @headers Authorization: Bearer <token> && x-hotel-id: <hotelId>
 * @access  Private
 */
exports.create = asyncHandler(async (req, res) => {
  const payment = await paymentService.createPayment(
    req.hotel._id,
    req.user.id,
    req.validated.body
  );

  res.status(201).json({
    success: true,
    message: "Payment created successfully",
    data: payment,
  });
});

/**
 * @desc    List all payments
 * @route   GET /api/payments
 * @headers Authorization: Bearer <token> && x-hotel-id: <hotelId>
 * @access  Private
 */

exports.list = asyncHandler(async (req, res) => {
  const payments = await paymentService.listPayments(req.hotel._id);

  res.status(200).json({
    success: true,
    data: payments,
  });
});

/**
 * @desc    Get payment details by ID
 * @route   GET /api/payments/:id
 * @headers Authorization: Bearer <token> && x-hotel-id: <hotelId>
 * @access  Private
 */
exports.getById = asyncHandler(async (req, res) => {
  const payment = await paymentService.getPaymentById(
    req.hotel._id,
    req.params.id
  );

  res.status(200).json({
    success: true,
    data: payment,
  });
});