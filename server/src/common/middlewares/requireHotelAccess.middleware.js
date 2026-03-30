const AppError = require("../errors/AppError");
const Membership = require("../../modules/memberships/membership.model");

module.exports = async function requireHotelAccess(req, res, next) {
  try {
    const hotelId = req.headers["x-hotel-id"];

    if (!hotelId) {
      return next(new AppError("Missing x-hotel-id header", 400));
    }


    const membership = await Membership.findOne({
      hotelId,
      userId: req.user.id,
      isActive: true,
    }).populate("hotelId");


    if (!membership) {
      return next(new AppError("You do not have access to this hotel", 403));
    }

    req.hotel = membership.hotelId;
    req.membership = {
      id: membership._id,
      role: membership.role,
      permissions: membership.permissions,
      isActive: membership.isActive,
    };

    next();
  } catch (error) {
    next(error);
  }
};