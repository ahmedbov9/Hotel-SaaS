const asyncHandler = require("../../common/utils/asyncHandler");
const roomService = require("./room.service");


/**
 * @desc    Create a new room
 * @route   POST /api/rooms
 * @headers Authorization: Bearer <token> && x-hotel-id: <hotelId>
 * @access  Private
 */
exports.create = asyncHandler(async (req, res) => {
  const room = await roomService.createRoom(req.hotel._id, req.validated.body);

  res.status(201).json({
    success: true,
    message: "Room created successfully",
    data: room,
  });
});

/**
 * @desc    List all rooms
 * @route   GET /api/rooms
 * @headers Authorization: Bearer <token> && x-hotel-id: <hotelId>
 * @access  Private
 */

exports.list = asyncHandler(async (req, res) => {
  const rooms = await roomService.listRooms(req.hotel._id);

  res.status(200).json({
    success: true,
    data: rooms,
  });
});
/**
 * @desc    Get room details by ID
 * @route   GET /api/rooms/:id
 * @headers Authorization: Bearer <token> && x-hotel-id: <hotelId>
 * @access  Private
 */
exports.getById = asyncHandler(async (req, res) => {
  const room = await roomService.getRoomById(req.hotel._id, req.params.id);

  res.status(200).json({
    success: true,
    data: room,
  });
});

/**
 * @desc    Update a room by ID
 * @route   PATCH /api/rooms/:id
 * @headers Authorization: Bearer <token> && x-hotel-id: <hotelId>
 * @access  Private
 */

exports.update = asyncHandler(async (req, res) => {
  const room = await roomService.updateRoom(
    req.hotel._id,
    req.params.id,
    req.validated.body
  );

  res.status(200).json({
    success: true,
    message: "Room updated successfully",
    data: room,
  });
});