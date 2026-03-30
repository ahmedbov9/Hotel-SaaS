const router = require("express").Router();
const auth = require("../../common/middlewares/auth.middleware");
const requireHotelAccess = require("../../common/middlewares/requireHotelAccess.middleware");
const requirePermission = require("../../common/middlewares/requirePermission.middleware");
const validate = require("../../common/middlewares/validate.middleware");
const controller = require("./membership.controller");
const {
  createMembershipSchema,
  updateMembershipSchema,
} = require("./membership.validation");

router.use(auth, requireHotelAccess);





/**
 * @desc    List all staff memberships
 * @route   GET /api/memberships
 * @headers Authorization: Bearer <token> && x-hotel-id: <hotelId>
 * @access  Private
 */
router.get("/", requirePermission("staff.read"), controller.list);
/**
 * @desc    Create a new staff membership
 * @route   POST /api/memberships
 * @headers Authorization: Bearer <token> && x-hotel-id: <hotelId>
 * @access  Private
 */
router.post(
  "/",
  requirePermission("staff.invite"),
  validate(createMembershipSchema),
  controller.create
);
/**
 * @desc    Update staff membership details by ID
 * @route   PATCH /api/memberships/:id
 * @headers Authorization: Bearer <token> && x-hotel-id: <hotelId>
 * @access  Private
 */
router.patch(
  "/:id",
  requirePermission("staff.update"),
  validate(updateMembershipSchema),
  controller.update
);

module.exports = router;