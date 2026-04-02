const router = require("express").Router();
const auth = require("../../common/middlewares/auth.middleware");
const requireHotelAccess = require("../../common/middlewares/requireHotelAccess.middleware");
const requirePermission = require("../../common/middlewares/requirePermission.middleware");
const validate = require("../../common/middlewares/validate.middleware");
const controller = require("./invoice.controller");
const {
  createInvoiceSchema,
  updateInvoiceStatusSchema,
} = require("./invoice.validation");

router.use(auth.verifyToken, requireHotelAccess);

/**
 * @desc    List all invoices
 * @route   GET /api/invoices
 * @headers Authorization: Bearer <token> && x-hotel-id: <hotelId>
 * @access  Private
 */
router.get("/", requirePermission("payments.read"), controller.list);

/**
 * @desc    Get invoice details by ID
 * @route   GET /api/invoices/:id
 * @headers Authorization: Bearer <token> && x-hotel-id: <hotelId>
 * @access  Private
 */
router.get("/:id", requirePermission("payments.read"), controller.getById);

/**
 * @desc    Create a new invoice
 * @route   POST /api/invoices
 * @headers Authorization: Bearer <token> && x-hotel-id: <hotelId>
 * @access  Private
 */

router.post(
  "/",
  requirePermission("payments.create"),
  validate(createInvoiceSchema),
  controller.create,
);

/**
 * @desc    Update invoice status
 * @route   PATCH /api/invoices/:id/status
 * @headers Authorization: Bearer <token> && x-hotel-id: <hotelId>
 * @access  Private
 */

router.patch(
  "/:id/status",
  requirePermission("payments.create"),
  validate(updateInvoiceStatusSchema),
  controller.updateStatus,
);

module.exports = router;
