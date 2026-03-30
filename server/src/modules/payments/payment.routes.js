const router = require("express").Router();
const auth = require("../../common/middlewares/auth.middleware");
const requireHotelAccess = require("../../common/middlewares/requireHotelAccess.middleware");
const requirePermission = require("../../common/middlewares/requirePermission.middleware");
const validate = require("../../common/middlewares/validate.middleware");
const controller = require("./payment.controller");
const { createPaymentSchema } = require("./payment.validation");

router.use(auth, requireHotelAccess);

/**
 * @desc    List all payments
 * @route   GET /api/payments
 * @headers Authorization: Bearer <token> && x-hotel-id: <hotelId>
 * @access  Private
 */



router.get("/", requirePermission("payments.read"), controller.list);


/**
 * @desc    Get payment details by ID
 * @route   GET /api/payments/:id
 * @headers Authorization: Bearer <token> && x-hotel-id: <hotelId>
 * @access  Private
 */


router.get("/:id", requirePermission("payments.read"), controller.getById);


/**
 * @desc    Create a new payment
 * @route   POST /api/payments
 * @headers Authorization: Bearer <token> && x-hotel-id: <hotelId>
 * @access  Private
 */


router.post(
  "/",
  requirePermission("payments.create"),
  validate(createPaymentSchema),
  controller.create,
);

module.exports = router;
