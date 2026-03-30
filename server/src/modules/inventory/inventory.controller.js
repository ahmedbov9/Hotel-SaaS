const asyncHandler = require("../../common/utils/asyncHandler");
const inventoryService = require("./inventory.service");


/**
 * @desc    Bulk upsert inventory items
 * @route   PUT /api/inventory/Bulk
 * @headers Authorization: Bearer <token> && x-hotel-id: <hotelId>
 * @access  Private
 */
exports.bulkUpsert = asyncHandler(async (req, res) => {
  const data = await inventoryService.bulkUpsertInventory(
    req.hotel._id,
    req.validated.body
  );

  res.status(200).json({
    success: true,
    message: "Inventory updated successfully",
    data,
  });
});

/**
 * @desc    Get inventory items within a date range
 * @route   GET /api/inventory/inventory
 * @headers Authorization : Bearer <token> && x-hotel-id: <hotelId>
 * @params (roomTypeId), (startDate), (endDate)
 * @access  Private
 */

exports.getRange = asyncHandler(async (req, res) => {
  const data = await inventoryService.getInventoryRange(
    req.hotel._id,
    req.validated.query
  );

  res.status(200).json({
    success: true,
    data,
  });
});