const Guest = require("./guest.model");
const AppError = require("../../common/errors/AppError");





async function ensureUniqueIdentity(hotelId, idType, idNumber, excludeId = null) {
  if (!idType || !idNumber) return;

  const query = {
    hotelId,
    idType,
    idNumber,
  };

  if (excludeId) {
    query._id = { $ne: excludeId };
  }

  const existingGuest = await Guest.findOne(query);

  if (existingGuest) {
    throw new AppError("A guest with the same identity already exists in this hotel", 409);
  }
}

module.exports = {
    ensureUniqueIdentity,
}