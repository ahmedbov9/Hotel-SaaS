const AppError = require("../../common/errors/AppError");

function parseOptionalDate(value, fieldName) {
  if (value === undefined) return undefined;
  if (!value) return null;

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    throw new AppError(`Invalid ${fieldName}`, 400);
  }

  return date;
}

module.exports = {
  parseOptionalDate,
};