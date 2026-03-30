const asyncHandler = require("../../common/utils/asyncHandler");
const reportService = require("./report.service");


/**
 * @desc    Get dashboard summary
 * @route   GET /api/reports/dashboard
 * @headers Authorization: Bearer <token> && x-hotel-id: <hotelId>
 * @access  Private
 */
exports.getDashboardSummary = asyncHandler(async (req, res) => {
  const data = await reportService.getDashboardSummary(req.hotel._id);

  res.status(200).json({
    success: true,
    data,
  });
});