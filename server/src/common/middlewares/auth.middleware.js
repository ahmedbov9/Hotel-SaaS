const jwt = require("jsonwebtoken");
const { env } = require("../../config/env");
const AppError = require("../errors/AppError");
const User = require("../../modules/users/user.model");

module.exports = async function verifyToken(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return next(new AppError("Unauthorized", 401));
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, env.JWT_ACCESS_SECRET);

    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return next(new AppError("User not found", 401));
    }

    if (!user.isActive) {
      return next(new AppError("User is inactive", 403));
    }

    req.user = {
      id: user._id,
      role: user.role,
      email: user.email,
    };

    next();
  } catch (error) {

    next(new AppError("Invalid or expired token", 401));
  }
};