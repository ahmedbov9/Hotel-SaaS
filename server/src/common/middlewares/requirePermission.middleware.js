const AppError = require("../errors/AppError");

module.exports = function requirePermission(permission) {
  return (req, res, next) => {

    const permissions = req.membership?.permissions || [];

    if (permissions.includes("*") || permissions.includes(permission)) {
      return next();
    }
    return next(new AppError("Forbidden", 403));
  };
};