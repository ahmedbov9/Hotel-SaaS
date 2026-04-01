const Guest = require("./guest.model");
const AppError = require("../../common/errors/AppError");
const {
  ensureUniqueIdentity,
} = require("./guest.utils");
const  {normalizeNullableString, normalizeDate}  = require("../../common/utils/utils");
async function createGuest(hotelId, payload) {
  const idType = normalizeNullableString(payload.idType);
  const idNumber = normalizeNullableString(payload.idNumber);

  await ensureUniqueIdentity(hotelId, idType, idNumber);

  const guest = await Guest.create({
    hotelId,
    firstName: payload.firstName.trim(),
    lastName: payload.lastName.trim(),
    email: normalizeNullableString(payload.email)?.toLowerCase() || null,
    phone: normalizeNullableString(payload.phone),
    nationality: normalizeNullableString(payload.nationality),
    idType,
    idNumber,
    dateOfBirth: normalizeDate(payload.dateOfBirth),
    notes: normalizeNullableString(payload.notes),
    tags: payload.tags || [],
  });

  return guest;
}

async function listGuests(hotelId) {
  return Guest.find({ hotelId }).sort({ createdAt: -1 });
}

async function getGuestById(hotelId, id) {
  const guest = await Guest.findOne({ _id: id, hotelId });

  if (!guest) {
    throw new AppError("Guest not found", 404);
  }

  return guest;
}

async function updateGuest(hotelId, id, payload) {
  const guest = await Guest.findOne({ _id: id, hotelId });

  if (!guest) {
    throw new AppError("Guest not found", 404);
  }

  const nextIdType =
    payload.idType !== undefined
      ? normalizeNullableString(payload.idType)
      : guest.idType;

  const nextIdNumber =
    payload.idNumber !== undefined
      ? normalizeNullableString(payload.idNumber)
      : guest.idNumber;

  await ensureUniqueIdentity(hotelId, nextIdType, nextIdNumber, guest._id);

  if (payload.firstName !== undefined) guest.firstName = payload.firstName.trim();
  if (payload.lastName !== undefined) guest.lastName = payload.lastName.trim();
  if (payload.email !== undefined) {
    guest.email = normalizeNullableString(payload.email)?.toLowerCase() || null;
  }
  if (payload.phone !== undefined) guest.phone = normalizeNullableString(payload.phone);
  if (payload.nationality !== undefined) {
    guest.nationality = normalizeNullableString(payload.nationality);
  }
  if (payload.idType !== undefined) guest.idType = nextIdType;
  if (payload.idNumber !== undefined) guest.idNumber = nextIdNumber;
  if (payload.dateOfBirth !== undefined) {
    guest.dateOfBirth = normalizeDate(payload.dateOfBirth);
  }
  if (payload.notes !== undefined) guest.notes = normalizeNullableString(payload.notes);
  if (payload.tags !== undefined) guest.tags = payload.tags;

  await guest.save();

  return guest;
}

module.exports = {
  createGuest,
  listGuests,
  getGuestById,
  updateGuest,
};