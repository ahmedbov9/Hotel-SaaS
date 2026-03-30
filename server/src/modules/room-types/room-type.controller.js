const asyncHandler = require("../../common/utils/asyncHandler");
const roomTypeService = require("./room-type.service");

/**
 * @desc    Create a new room type
 * @route   POST /api/room-types
 * @headers Authorization: Bearer <token> && x-hotel-id: <hotelId>
 * @access  Private
 */
exports.create = asyncHandler(async (req, res) => {
  const roomType = await roomTypeService.createRoomType(
    req.hotel._id,
    req.validated.body
  );

  res.status(201).json({
    success: true,
    message: "Room type created successfully",
    data: roomType,
  });
});

/**
 * @desc    List all room types
 * @route   GET /api/room-types
 * @headers Authorization: Bearer <token> && x-hotel-id: <hotelId>
 * @access  Private
 */

exports.list = asyncHandler(async (req, res) => {
  const roomTypes = await roomTypeService.listRoomTypes(req.hotel._id);

  res.status(200).json({
    success: true,
    data: roomTypes,
  });
});
/**
 * @desc    Get room type details by ID
 * @route   GET /api/room-types/:id
 * @headers Authorization: Bearer <token> && x-hotel-id: <hotelId>
 * @access  Private
 */
exports.getById = asyncHandler(async (req, res) => {
  const roomType = await roomTypeService.getRoomTypeById(
    req.hotel._id,
    req.params.id
  );

  res.status(200).json({
    success: true,
    data: roomType,
  });
});

/**
 * @desc    Update a room type by ID
 * @route   PATCH /api/room-types/:id
 * @headers Authorization: Bearer <token> && x-hotel-id: <hotelId>
 * @access  Private
 */

exports.update = asyncHandler(async (req, res) => {
  const roomType = await roomTypeService.updateRoomType(
    req.hotel._id,
    req.params.id,
    req.validated.body
  );

  res.status(200).json({
    success: true,
    message: "Room type updated successfully",
    data: roomType,
  });
});