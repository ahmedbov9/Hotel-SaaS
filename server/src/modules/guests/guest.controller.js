const asyncHandler = require("../../common/utils/asyncHandler");
const guestService = require("./guest.service");


/**
 * @desc    Create a new guest
 * @route   POST /api/guests
 * @headers Authorization: Bearer <token> && x-hotel-id: <hotelId>
 * @access  Private
 */
exports.create = asyncHandler(async (req, res) => {
  const guest = await guestService.createGuest(req.hotel._id, req.validated.body);

  res.status(201).json({
    success: true,
    message: "Guest created successfully",
    data: guest,
  });
});
/**
 * @desc    List all guests
 * @route   GET /api/guests
 * @headers Authorization: Bearer <token> && x-hotel-id: <hotelId>
 * @access  Private
 */
exports.list = asyncHandler(async (req, res) => {
  const guests = await guestService.listGuests(req.hotel._id);

  res.status(200).json({
    success: true,
    data: guests,
  });
});

/**
 * @desc    Get guest details by ID
 * @route   GET /api/guests/:id
 * @headers Authorization: Bearer <token> && x-hotel-id: <hotelId>
 * @access  Private
 */

exports.getById = asyncHandler(async (req, res) => {
  const guest = await guestService.getGuestById(req.hotel._id, req.params.id);

  res.status(200).json({
    success: true,
    data: guest,
  });
});

/**
 * @desc    Update a guest by ID
 * @route   PATCH /api/guests/:id
 * @headers Authorization: Bearer <token> && x-hotel-id: <hotelId>
 * @access  Private
 */

exports.update = asyncHandler(async (req, res) => {
  const guest = await guestService.updateGuest(
    req.hotel._id,
    req.params.id,
    req.validated.body
  );

  res.status(200).json({
    success: true,
    message: "Guest updated successfully",
    data: guest,
  });
});