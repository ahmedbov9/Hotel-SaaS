const asyncHandler = require("../../common/utils/asyncHandler");
const bookingService = require("./booking.service");


/**
 * @desc    Create a new booking
 * @route   POST /api/bookings
 * @headers Authorization: Bearer <token> && x-hotel-id: <hotelId>
 * @access  Private
 */

exports.create = asyncHandler(async (req, res) => {
  const booking = await bookingService.createBooking(
    req.hotel._id,
    req.user.id,
    req.validated.body
  );

  res.status(201).json({
    success: true,
    message: "Booking created successfully",
    data: booking,
  });
});

/**
 * @desc    List all bookings for a hotel
 * @route   GET /api/bookings
 * @headers Authorization: Bearer <token> && x-hotel-id: <hotelId>
 * @access  Private
 */

exports.list = asyncHandler(async (req, res) => {
  const bookings = await bookingService.listBookings(req.hotel._id);

  res.status(200).json({
    success: true,
    data: bookings,
  });
});

/**
 * @desc    Get booking details by ID
 * @route   GET /api/bookings/:id
 * @headers Authorization: Bearer <token> && x-hotel-id: <hotelId>
 * @access  Private
 */

exports.getById = asyncHandler(async (req, res) => {
  const booking = await bookingService.getBookingById(req.hotel._id, req.params.id);

  res.status(200).json({
    success: true,
    data: booking,
  });
});

/**
 * @desc    Update a booking by ID
 * @route   PATCH /api/bookings/:id
 * @headers Authorization: Bearer <token> && x-hotel-id: <hotelId>
 * @access  Private
 */

exports.update = asyncHandler(async (req, res) => {
  const booking = await bookingService.updateBooking(
    req.hotel._id,
    req.params.id,
    req.validated.body
  );

  res.status(200).json({
    success: true,
    message: "Booking updated successfully",
    data: booking,
  });
});

/**
 * @desc    Confirm a booking by ID
 * @route   POST /api/bookings/:id/confirm
 * @headers Authorization: Bearer <token> && x-hotel-id: <hotelId>
 * @access  Private
 */

exports.confirm = asyncHandler(async (req, res) => {
  const booking = await bookingService.confirmBooking(req.hotel._id, req.params.id);

  res.status(200).json({
    success: true,
    message: "Booking confirmed successfully",
    data: booking,
  });
});

/**
 * @desc    Check in a guest by booking ID
 * @route   POST /api/bookings/:id/check-in
 * @headers Authorization: Bearer <token> && x-hotel-id: <hotelId>
 * @access  Private
 */
exports.checkIn = asyncHandler(async (req, res) => {
  const booking = await bookingService.checkInBooking(req.hotel._id, req.params.id);

  res.status(200).json({
    success: true,
    message: "Guest checked in successfully",
    data: booking,
  });
});

/**
 * @desc    Check out a guest by booking ID
 * @route   POST /api/bookings/:id/check-out
 * @headers Authorization: Bearer <token> && x-hotel-id: <hotelId>
 * @access  Private
 */
exports.checkOut = asyncHandler(async (req, res) => {
  const booking = await bookingService.checkOutBooking(req.hotel._id, req.params.id);

  res.status(200).json({
    success: true,
    message: "Guest checked out successfully",
    data: booking,
  });
});


/**
 * @desc    Cancel a booking by ID
 * @route   POST /api/bookings/:id/cancel
 * @headers Authorization: Bearer <token> && x-hotel-id: <hotelId>
 * @access  Private
 */

exports.cancel = asyncHandler(async (req, res) => {
  const booking = await bookingService.cancelBooking(
    req.hotel._id,
    req.params.id,
    req.body?.cancellationReason
  );

  res.status(200).json({
    success: true,
    message: "Booking cancelled successfully",
    data: booking,
  });
});