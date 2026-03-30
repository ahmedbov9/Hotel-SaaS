const router = require("express").Router();
const validate = require("../../common/middlewares/validate.middleware");
const auth = require("../../common/middlewares/auth.middleware");
const controller = require("./auth.controller");
const { registerSchema, loginSchema } = require("./auth.validation");


/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
router.post("/register", validate(registerSchema), controller.register);

/**
 * @desc    Login user
 * @route   POST /api/auth/login
 * @access  Public
 */
router.post("/login", validate(loginSchema), controller.login);

/**
 * @desc    Get current logged in user
 * @route   GET /api/auth/me
 * @access  Private
 */
router.get("/me", auth, controller.getMe);

module.exports = router;