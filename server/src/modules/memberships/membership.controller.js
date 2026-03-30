const asyncHandler = require("../../common/utils/asyncHandler");
const membershipService = require("./membership.service");



/**
 * @desc    Create a new staff membership
 * @route   POST /api/memberships
 * @headers Authorization: Bearer <token> && x-hotel-id: <hotelId>
 * @access  Private
 */

exports.create = asyncHandler(async (req, res) => {
  const membership = await membershipService.createMembership(
    req.hotel._id,
    req.user.id,
    req.validated.body
  );

  res.status(201).json({
    success: true,
    message: "Staff member created successfully",
    data: membership,
  });
});

/**
 * @desc    List all staff memberships
 * @route   GET /api/memberships
 * @headers Authorization: Bearer <token> && x-hotel-id: <hotelId>
 * @access  Private
 */

exports.list = asyncHandler(async (req, res) => {
  const memberships = await membershipService.listMemberships(req.hotel._id);

  res.status(200).json({
    success: true,
    data: memberships,
  });
});


/**
 * @desc    Update staff membership details by ID
 * @route   PATCH /api/memberships/:id
 * @headers Authorization: Bearer <token> && x-hotel-id: <hotelId>
 * @access  Private
 */
exports.update = asyncHandler(async (req, res) => {
  const membership = await membershipService.updateMembership(
    req.hotel._id,
    req.params.id,
    req.validated.body
  );

  res.status(200).json({
    success: true,
    message: "Membership updated successfully",
    data: membership,
  });
});