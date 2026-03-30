const Inventory = require("./inventory.model");
const AppError = require("../../common/errors/AppError");
const { calculateAvailableCount, normalizeDay , getRoomTypePhysicalInventory , ensureRoomTypeBelongsToHotel} = require("./inventory.utils");

async function bulkUpsertInventory(hotelId, payload) {
  await ensureRoomTypeBelongsToHotel(hotelId, payload.roomTypeId);

  const physicalInventory = await getRoomTypePhysicalInventory(hotelId, payload.roomTypeId);

  const operations = payload.entries.map((entry) => {
    const date = normalizeDay(entry.date);
    const totalInventory = entry.totalInventory;
    const reservedCount = entry.reservedCount ?? 0;

    if (totalInventory > physicalInventory) {
      throw new AppError(
        `totalInventory cannot exceed physical room count (${physicalInventory})`,
        400
      );
    }

    const availableCount = calculateAvailableCount(totalInventory, reservedCount);

    return {
      updateOne: {
        filter: {
          hotelId,
          roomTypeId: payload.roomTypeId,
          date,
        },
        update: {
          $set: {
            totalInventory,
            reservedCount,
            availableCount,
            stopSell: entry.stopSell ?? false,
            minStay: entry.minStay ?? 1,
            priceOverride:
              entry.priceOverride !== undefined ? entry.priceOverride : null,
          },
        },
        upsert: true,
      },
    };
  });

  if (operations.length > 0) {
    await Inventory.bulkWrite(operations);
  }

  return Inventory.find({
    hotelId,
    roomTypeId: payload.roomTypeId,
    date: {
      $in: payload.entries.map((entry) => normalizeDay(entry.date)),
    },
  }).sort({ date: 1 });
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
  bulkUpsertInventory,
  getInventoryRange,

};