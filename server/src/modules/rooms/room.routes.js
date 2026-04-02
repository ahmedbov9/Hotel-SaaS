const router = require("express").Router();
const auth = require("../../common/middlewares/auth.middleware");
const requireHotelAccess = require("../../common/middlewares/requireHotelAccess.middleware");
const requirePermission = require("../../common/middlewares/requirePermission.middleware");
const validate = require("../../common/middlewares/validate.middleware");
const controller = require("./room.controller");
const {
  createRoomSchema,
  updateRoomSchema,
} = require("./room.validation");

router.use(auth.verifyToken, requireHotelAccess);





/**
 * @desc    List all rooms
 * @route   GET /api/rooms
 * @headers Authorization: Bearer <token> && x-hotel-id: <hotelId>
 * @access  Private
 */
router.get("/", requirePermission("rooms.read"), controller.list);

/**
 * @desc    Get room details by ID
 * @route   GET /api/rooms/:id
 * @headers Authorization: Bearer <token> && x-hotel-id: <hotelId>
 * @access  Private
 */
router.get("/:id", requirePermission("rooms.read"), controller.getById);

/**
 * @desc    Create a new room
 * @route   POST /api/rooms
 * @headers Authorization: Bearer <token> && x-hotel-id: <hotelId>
 * @access  Private
 */

router.post(
  "/",
  requirePermission("rooms.create"),
  validate(createRoomSchema),
  controller.create
);

/**
 * @desc    Update a room by ID
 * @route   PATCH /api/rooms/:id
 * @headers Authorization: Bearer <token> && x-hotel-id: <hotelId>
 * @access  Private
 */
router.patch(
  "/:id",
  requirePermission("rooms.update"),
  validate(updateRoomSchema),
  controller.update
);

module.exports = router;