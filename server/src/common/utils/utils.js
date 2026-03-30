const AppError = require("../errors/AppError");

function normalizeNullableString(value) {
  if (value === undefined) return undefined;
  if (value === null) return null;

  const trimmed = String(value).trim();
  return trimmed === "" ? null : trimmed;
}
function calculateNights(checkInDate, checkOutDate) {
  const diffMs = checkOutDate.getTime() - checkInDate.getTime();
  const nights = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  if (nights < 1) {
    throw new AppError("checkOutDate must be after checkInDate", 400);
  }

  return nights;
}
function parseDate(value, fieldName) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    throw new AppError(`Invalid ${fieldName}`, 400);
  }
  return date;
}

function normalizeDate(value) {
  if (value === undefined) return undefined;
  if (!value) return null;

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    throw new AppError("Invalid dateOfBirth", 400);
  }

  return date;
}
module.exports = {
  normalizeNullableString,
  calculateNights,
  parseDate,
  normalizeDate,
};
