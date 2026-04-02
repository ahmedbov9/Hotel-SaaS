const router = require("express").Router();
const auth = require("../../common/middlewares/auth.middleware");
const requireHotelAccess = require("../../common/middlewares/requireHotelAccess.middleware");
const requirePermission = require("../../common/middlewares/requirePermission.middleware");
const validate = require("../../common/middlewares/validate.middleware");
const controller = require("./room-type.controller");
const {
  createRoomTypeSchema,
  updateRoomTypeSchema,
} = require("./room-type.validation");

router.use(auth.verifyToken, requireHotelAccess);

/**
 * @desc    List all room types
 * @route   GET /api/room-types
 * @headers Authorization: Bearer <token> && x-hotel-id: <hotelId>
 * @access  Private
 */
router.get("/", requirePermission("rooms.read"), controller.list);

/**
 * @desc    Get room type details by ID
 * @route   GET /api/room-types/:id
 * @headers Authorization: Bearer <token> && x-hotel-id: <hotelId>
 * @access  Private
 */
router.get("/:id", requirePermission("rooms.read"), controller.getById);

/**
 * @desc    Create a new room type
 * @route   POST /api/room-types
 * @headers Authorization: Bearer <token> && x-hotel-id: <hotelId>
 * @access  Private
 */

router.post(
  "/",
  requirePermission("rooms.create"),
  validate(createRoomTypeSchema),
  controller.create,
);

/**
 * @desc    Update a room type by ID
 * @route   PATCH /api/room-types/:id
 * @headers Authorization: Bearer <token> && x-hotel-id: <hotelId>
 * @access  Private
 */
router.patch(
  "/:id",
  requirePermission("rooms.update"),
  validate(updateRoomTypeSchema),
  controller.update,
);

module.exports = router;
