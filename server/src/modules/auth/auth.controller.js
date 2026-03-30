const asyncHandler = require("../../common/utils/asyncHandler");
const authService = require("./auth.service");
const User = require("../users/user.model");



/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */

exports.register = asyncHandler(async (req, res) => {
  const result = await authService.register(req.validated.body);

  res.status(201).json({
    success: true,
    message: "User registered successfully",
    data: result,
  });
});

/**
 * @desc    Login user
 * @route   POST /api/auth/login
 * @access  Public
 */

exports.login = asyncHandler(async (req, res) => {
  const result = await authService.login(req.validated.body);

  res.status(200).json({
    success: true,
    message: "Logged in successfully",
    data: result,
  });
});

/**
 * @desc    Get current logged in user
 * @route   GET /api/auth/me
 * @access  Private
 */
exports.getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");

  res.status(200).json({
    success: true,
    data: user,
  });
});