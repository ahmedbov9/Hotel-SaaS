const User = require("../users/user.model");
const AppError = require("../../common/errors/AppError");
const { signAccessToken } = require("./auth.tokens");



async function register(payload) {
  const existingUser = await User.findOne({ email: payload.email });

  if (existingUser) {
    throw new AppError("Email already exists", 409);
  }

  const user = await User.create({
    fullName: payload.fullName,
    email: payload.email,
    password: payload.password,
    phone: payload.phone || null,
  });

  const accessToken = signAccessToken(user);

  return {
    user: {
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      phone: user.phone,
    },
    accessToken,
  };
}


async function login(payload) {
  const user = await User.findOne({ email: payload.email }).select("+password");

  if (!user) {
    throw new AppError("Invalid email or password", 401);
  }

  const isMatch = await user.comparePassword(payload.password);

  if (!isMatch) {
    throw new AppError("Invalid email or password", 401);
  }

  if (!user.isActive) {
    throw new AppError("User is inactive", 403);
  }

  user.lastLoginAt = new Date();
  await user.save();

  const accessToken = signAccessToken(user);

  return {
    user: {
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      phone: user.phone,
      lastLoginAt: user.lastLoginAt,
    },
    accessToken,
  };
}

module.exports = {
  register,
  login,
};