const asyncHandler = require("../../common/utils/asyncHandler");
const hotelService = require("./hotel.service");


/**
 * @desc    Create a new hotel
 * @route   POST /api/hotels
 * @headers Authorization: Bearer <token>
 * @access  Private
 */
exports.create = asyncHandler(async (req, res) => {
  const hotel = await hotelService.createHotel(req.user.id, req.validated.body);

  res.status(201).json({
    success: true,
    message: "Hotel created successfully",
    data: hotel,
  });
});


/**
 * @desc    Get current hotel details
 * @route   GET /api/hotels/current
 * @headers Authorization: Bearer <token> && x-hotel-id: <hotelId>
 * @access  Private
 */
exports.getCurrent = asyncHandler(async (req, res) => {
  const hotel = await hotelService.getCurrentHotel(req.hotel._id);

  res.status(200).json({
    success: true,
    data: {
      hotel,
      membership: req.membership,
    },
  });
});