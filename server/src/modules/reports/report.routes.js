const router = require("express").Router();
const auth = require("../../common/middlewares/auth.middleware");
const requireHotelAccess = require("../../common/middlewares/requireHotelAccess.middleware");
const requirePermission = require("../../common/middlewares/requirePermission.middleware");
const controller = require("./report.controller");

router.use(auth, requireHotelAccess);
/**
 * @desc    Get dashboard summary
 * @route   GET /api/reports/dashboard
 * @headers Authorization: Bearer <token> && x-hotel-id: <hotelId>
 * @access  Private
 */
router.get(
  "/dashboard",
  requirePermission("reports.read"),
  controller.getDashboardSummary,
);

module.exports = router;
