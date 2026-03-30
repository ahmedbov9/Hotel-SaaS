const router = require("express").Router();
const auth = require("../../common/middlewares/auth.middleware");
const requireHotelAccess = require("../../common/middlewares/requireHotelAccess.middleware");
const requirePermission = require("../../common/middlewares/requirePermission.middleware");
const validate = require("../../common/middlewares/validate.middleware");
const controller = require("./guest.controller");
const { createGuestSchema, updateGuestSchema } = require("./guest.validation");

router.use(auth, requireHotelAccess);

/**
 * @desc    List all guests
 * @route   GET /api/guests
 * @headers Authorization: Bearer <token> && x-hotel-id: <hotelId>
 * @access  Private
 */


router.get("/", requirePermission("guests.read"), controller.list);


/**
 * @desc    Get guest details by ID
 * @route   GET /api/guests/:id
 * @headers Authorization: Bearer <token> && x-hotel-id: <hotelId>
 * @access  Private
 */


router.get("/:id", requirePermission("guests.read"), controller.getById);


/**
 * @desc    Create a new guest
 * @route   POST /api/guests
 * @headers Authorization: Bearer <token> && x-hotel-id: <hotelId>
 * @access  Private
 */


router.post(
  "/",
  requirePermission("guests.create"),
  validate(createGuestSchema),
  controller.create,
);



/**
 * @desc    Update a guest by ID
 * @route   PATCH /api/guests/:id
 * @headers Authorization: Bearer <token> && x-hotel-id: <hotelId>
 * @access  Private
 */


router.patch(
  "/:id",
  requirePermission("guests.update"),
  validate(updateGuestSchema),
  controller.update,
);



module.exports = router;
