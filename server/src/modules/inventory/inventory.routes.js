const router = require("express").Router();
const auth = require("../../common/middlewares/auth.middleware");
const requireHotelAccess = require("../../common/middlewares/requireHotelAccess.middleware");
const requirePermission = require("../../common/middlewares/requirePermission.middleware");
const validate = require("../../common/middlewares/validate.middleware");
const controller = require("./inventory.controller");
const {
  bulkUpsertInventorySchema,
  getInventoryRangeSchema,
} = require("./inventory.validation");

router.use(auth, requireHotelAccess);



/**
 * @desc    Get inventory items within a date range
 * @route   GET /api/inventory/inventory
 * @headers Authorization : Bearer <token> && x-hotel-id: <hotelId>
 * @params (roomTypeId), (startDate), (endDate)
 * @access  Private
 */
router.get(
  "/",
  requirePermission("rooms.read"),
  validate(getInventoryRangeSchema),
  controller.getRange
);


/**
 * @desc    Bulk upsert inventory items
 * @route   PUT /api/inventory/Bulk
 * @headers Authorization: Bearer <token> && x-hotel-id: <hotelId>
 * @access  Private
 */

router.put(
  "/bulk",
  requirePermission("rooms.update"),
  validate(bulkUpsertInventorySchema),
  controller.bulkUpsert
);

module.exports = router;