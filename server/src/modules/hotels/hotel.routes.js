const router = require("express").Router();
const auth = require("../../common/middlewares/auth.middleware");
const validate = require("../../common/middlewares/validate.middleware");
const requireHotelAccess = require("../../common/middlewares/requireHotelAccess.middleware");
const controller = require("./hotel.controller");
const { createHotelSchema } = require("./hotel.validation");

/**
 * @desc    Create a new hotel
 * @route   POST /api/hotels
 * @headers Authorization: Bearer <token>
 * @access  Private
 */

router.post("/", auth, validate(createHotelSchema), controller.create);

/**
 * @desc    Get current hotel details
 * @route   GET /api/hotels/current
 * @headers Authorization: Bearer <token> && x-hotel-id: <hotelId>
 * @access  Private
 */

router.get("/current", auth, requireHotelAccess, controller.getCurrent);

/**
 * @desc    Get my hotels
 * @route   GET /api/hotels/my-hotels
 * @headers Authorization: Bearer <token>
 * @access  Private
 */
router.get("/my-hotels", auth, controller.getMyHotels);


module.exports = router;
