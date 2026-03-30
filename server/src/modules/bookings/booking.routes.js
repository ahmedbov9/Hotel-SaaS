const router = require("express").Router();
const auth = require("../../common/middlewares/auth.middleware");
const requireHotelAccess = require("../../common/middlewares/requireHotelAccess.middleware");
const requirePermission = require("../../common/middlewares/requirePermission.middleware");
const validate = require("../../common/middlewares/validate.middleware");
const controller = require("./booking.controller");
const {
  createBookingSchema,
  updateBookingSchema,
  cancelBookingSchema,
} = require("./booking.validation");

router.use(auth, requireHotelAccess);

/**
 * @desc    Create a new booking
 * @route   POST /api/bookings
 * @headers Authorization: Bearer <token> && x-hotel-id: <hotelId>
 * @access  Private
 */
router.get("/", requirePermission("bookings.read"), controller.list);

/**
 * @desc    Get booking details by ID
 * @route   GET /api/bookings/:id
 * @headers Authorization: Bearer <token> && x-hotel-id: <hotelId>
 * @access  Private
 */

router.get("/:id", requirePermission("bookings.read"), controller.getById);

/**
 * @desc    Create new  booking
 * @route   POST /api/bookings
 * @headers Authorization: Bearer <token> && x-hotel-id: <hotelId>
 * @access  Private
 */
router.post(
  "/",
  requirePermission("bookings.create"),
  validate(createBookingSchema),
  controller.create,
);

/**
 * @desc    Update a booking by ID
 * @route   PATCH /api/bookings/:id
 * @headers Authorization: Bearer <token> && x-hotel-id: <hotelId>
 * @access  Private
 */
router.patch(
  "/:id",
  requirePermission("bookings.update"),
  validate(updateBookingSchema),
  controller.update,
);

/**
 * @desc    Confirm a booking by ID
 * @route   POST /api/bookings/:id/confirm
 * @headers Authorization: Bearer <token> && x-hotel-id: <hotelId>
 * @access  Private
 */

router.post(
  "/:id/confirm",
  requirePermission("bookings.update"),
  controller.confirm,
);

/**
 * @desc    Check in a guest by booking ID
 * @route   POST /api/bookings/:id/check-in
 * @headers Authorization: Bearer <token> && x-hotel-id: <hotelId>
 * @access  Private
 */

router.post(
  "/:id/check-in",
  requirePermission("bookings.checkin"),
  controller.checkIn,
);

/**
 * @desc    Check out a guest by booking ID
 * @route   POST /api/bookings/:id/check-out
 * @headers Authorization: Bearer <token> && x-hotel-id: <hotelId>
 * @access  Private
 */
router.post(
  "/:id/check-out",
  requirePermission("bookings.checkout"),
  controller.checkOut,
);

/**
 * @desc    Cancel a booking by ID
 * @route   POST /api/bookings/:id/cancel
 * @headers Authorization: Bearer <token> && x-hotel-id: <hotelId>
 * @access  Private
 */

router.post(
  "/:id/cancel",
  requirePermission("bookings.cancel"),
  validate(cancelBookingSchema),
  controller.cancel,
);

module.exports = router;
