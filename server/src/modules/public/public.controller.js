const asyncHandler = require("../../common/utils/asyncHandler");
const publicService = require("./public.service");


/**
 * @desc    Get public hotel details by slug
 * @route   GET /api/public/hotels/:slug
 * @access  Public
 */
exports.getHotel = asyncHandler(async (req, res) => {
  const data = await publicService.getPublicHotel(req.params.slug);

  res.status(200).json({
    success: true,
    data,
  });
});

/**
 * @desc    Get room availability for a hotel by slug
 * @route   GET /api/public/hotels/:slug/availability
 * @query   (checkInDate), (checkOutDate), (adults), (children)
 * @access  Public
 */

exports.getAvailability = asyncHandler(async (req, res) => {
  const data = await publicService.getPublicAvailability(
    req.params.slug,
    req.validated.query
  );

  res.status(200).json({
    success: true,
    data,
  });
});

exports.createBooking = asyncHandler(async (req, res) => {
  const data = await publicService.createPublicBooking(
    req.params.slug,
    req.validated.body
  );

  res.status(201).json({
    success: true,
    message: "Booking created successfully",
    data,
  });
});