const AppError = require("../../common/errors/AppError");
const RoomType = require("../room-types/room-type.model");
const Room = require("../rooms/room.model");
const Inventory = require("./inventory.model");

function normalizeDay(value, fieldName = "date") {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    throw new AppError(`Invalid ${fieldName}`, 400);
  }

  date.setUTCHours(0, 0, 0, 0);
  return date;
}

function getDateRange(checkInDate, checkOutDate) {
  const start = normalizeDay(checkInDate, "checkInDate");

  const end = normalizeDay(checkOutDate, "checkOutDate");

  if (end <= start) {
    throw new AppError("checkOutDate must be after checkInDate", 400);
  }

  const dates = [];
  const cursor = new Date(start);

  while (cursor < end) {
    dates.push(new Date(cursor));
    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }

  return dates;
}

async function ensureRoomTypeBelongsToHotel(hotelId, roomTypeId) {
  const roomType = await RoomType.findOne({ _id: roomTypeId, hotelId });

  if (!roomType) {
    throw new AppError("Room type not found for this hotel", 404);
  }

  return roomType;
}

async function getRoomTypePhysicalInventory(hotelId, roomTypeId) {
  return Room.countDocuments({
    hotelId,
    roomTypeId,
    status: { $in: ["available", "occupied"] },
  });
}

function calculateAvailableCount(totalInventory, reservedCount) {
  if (reservedCount > totalInventory) {
    throw new AppError(
      "reservedCount cannot be greater than totalInventory",
      400,
    );
  }

  return totalInventory - reservedCount;
}
async function reserveInventory(
  hotelId,
  roomTypeId,
  checkInDate,
  checkOutDate,
) {
  const docs = await assertInventoryAvailability(
    hotelId,
    roomTypeId,
    checkInDate,
    checkOutDate,
  );

  for (const doc of docs) {
    doc.reservedCount += 1;
    doc.availableCount = calculateAvailableCount(
      doc.totalInventory,
      doc.reservedCount,
    );
    await doc.save();
  }
}

/**
 * @description
 * @param {*} hotelId
 * @param {*} roomTypeId
 * @param {*} checkInDate
 * @param {*} checkOutDate
 */
async function releaseInventory(
  hotelId,
  roomTypeId,
  checkInDate,
  checkOutDate,
) {
  const dates = getDateRange(checkInDate, checkOutDate);

  const docs = await Inventory.find({
    hotelId,
    roomTypeId,
    date: { $in: dates },
  });

  for (const doc of docs) {
    doc.reservedCount = Math.max(0, doc.reservedCount - 1);
    doc.availableCount = calculateAvailableCount(
      doc.totalInventory,
      doc.reservedCount,
    );
    await doc.save();
  }
}

async function assertInventoryAvailability(hotelId, roomTypeId, checkInDate, checkOutDate) {
  const dates = getDateRange(checkInDate, checkOutDate);
  const nights = dates.length;

  const inventoryDocs = await Inventory.find({
    hotelId,
    roomTypeId,
    date: { $in: dates },
  }).sort({ date: 1 });

  if (inventoryDocs.length !== dates.length) {
    throw new AppError("Inventory is not configured for the full selected date range", 400);
  }

  for (const doc of inventoryDocs) {
    if (doc.stopSell) {
      throw new AppError(`Stop sell is enabled for ${doc.date.toISOString()}`, 409);
    }

    if (nights < doc.minStay) {
      throw new AppError(
        `Minimum stay for ${doc.date.toISOString()} is ${doc.minStay} nights`,
        409
      );
    }

    if (doc.availableCount < 1) {
      throw new AppError(`No availability for ${doc.date.toISOString()}`, 409);
    }
  }

  return inventoryDocs;
}

async function getInventoryRange(hotelId, query) {
  await ensureRoomTypeBelongsToHotel(hotelId, query.roomTypeId);

  const startDate = normalizeDay(query.startDate, "startDate");
  const endDate = normalizeDay(query.endDate, "endDate");

  if (endDate < startDate) {
    throw new AppError("endDate must be greater than or equal to startDate", 400);
  }

  return Inventory.find({
    hotelId,
    roomTypeId: query.roomTypeId,
    date: {
      $gte: startDate,
      $lte: endDate,
    },
  }).sort({ date: 1 });
}

module.exports = {
  normalizeDay,
  getDateRange,
  reserveInventory,
  releaseInventory,
  assertInventoryAvailability,
  ensureRoomTypeBelongsToHotel,
  getRoomTypePhysicalInventory,
  calculateAvailableCount,
  getInventoryRange,

};
