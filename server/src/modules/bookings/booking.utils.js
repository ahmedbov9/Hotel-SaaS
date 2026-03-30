const AppError  = require("../../common/errors/AppError");
const Booking = require("./booking.model");
const Guest = require("../guests/guest.model");
const RoomType = require("../room-types/room-type.model");
const Room = require("../rooms/room.model");
const { BOOKING_STATUS } = require("../../config/constants");
const Inventory = require('../inventory/inventory.model');
const { getDateRange } = require("../inventory/inventory.utils");
const { normalizeNullableString } = require("../../common/utils/utils");





async function ensureEntitiesBelongToHotel(hotelId, payload) {
  const [guest, roomType, room] = await Promise.all([
    Guest.findOne({ _id: payload.guestId, hotelId }),
    RoomType.findOne({ _id: payload.roomTypeId, hotelId }),
    Room.findOne({ _id: payload.roomId, hotelId }),
  ]);

  if (!guest) throw new AppError("Guest not found for this hotel", 404);
  if (!roomType) throw new AppError("Room type not found for this hotel", 404);
  if (!room) throw new AppError("Room not found for this hotel", 404);

  if (room.roomTypeId.toString() !== roomType._id.toString()) {
    throw new AppError("Room does not belong to the provided room type", 400);
  }

  return { guest, roomType, room };
}

async function ensureNoRoomConflict(hotelId, roomId, checkInDate, checkOutDate, excludeBookingId = null) {
  const query = {
    hotelId,
    roomId,
    status: {
      $in: [
        BOOKING_STATUS.PENDING,
        BOOKING_STATUS.CONFIRMED,
        BOOKING_STATUS.CHECKED_IN,
      ],
    },
    checkInDate: { $lt: checkOutDate },
    checkOutDate: { $gt: checkInDate },
  };

  if (excludeBookingId) {
    query._id = { $ne: excludeBookingId };
  }

  const conflict = await Booking.findOne(query);

  if (conflict) {
    throw new AppError("This room is already booked for the selected dates", 409);
  }
}

function buildGuestSnapshot(guest) {
  return {
    fullName: `${guest.firstName} ${guest.lastName}`.trim(),
    email: guest.email || null,
    phone: guest.phone || null,
    nationality: guest.nationality || null,
    idType: guest.idType || null,
    idNumber: guest.idNumber || null,
  };
}

function buildRoomSnapshot(room, roomType) {
  return {
    roomNumber: room.roomNumber,
    roomTypeName: roomType.name,
    bedType: roomType.bedType || null,
    basePrice: roomType.basePrice || 0,
  };
}

function buildPricingSnapshot(inventoryDocs, roomType) {
  const nightlyRates = inventoryDocs.map((doc) => {
    const hasOverride =
      doc.priceOverride !== null && doc.priceOverride !== undefined;

    return {
      date: doc.date,
      price: hasOverride ? doc.priceOverride : roomType.basePrice,
      source: hasOverride ? "price_override" : "base_price",
    };
  });

  return { nightlyRates };
}

function calculateAmountsFromInventory(
  inventoryDocs,
  roomType,
  taxes = 0,
  discounts = 0,
  paidAmount = 0
) {
  const subtotal = inventoryDocs.reduce((sum, doc) => {
    const nightlyPrice =
      doc.priceOverride !== null && doc.priceOverride !== undefined
        ? doc.priceOverride
        : roomType.basePrice;

    return sum + nightlyPrice;
  }, 0);

  const total = subtotal + taxes - discounts;

  if (total < 0) {
    throw new AppError("Total amount cannot be negative", 400);
  }

  if (paidAmount > total) {
    throw new AppError("paidAmount cannot be greater than total", 400);
  }

  return {
    subtotal,
    total,
    dueAmount: total - paidAmount,
  };
}
function applyStatusTimestamps(booking, nextStatus, cancellationReason) {
  booking.status = nextStatus;

  if (nextStatus === BOOKING_STATUS.CONFIRMED && !booking.confirmedAt) {
    booking.confirmedAt = new Date();
  }

  if (nextStatus === BOOKING_STATUS.CHECKED_IN && !booking.checkedInAt) {
    booking.checkedInAt = new Date();
  }

  if (nextStatus === BOOKING_STATUS.CHECKED_OUT && !booking.checkedOutAt) {
    booking.checkedOutAt = new Date();
  }

  if (nextStatus === BOOKING_STATUS.CANCELLED && !booking.cancelledAt) {
    booking.cancelledAt = new Date();
    booking.cancellationReason = normalizeNullableString(cancellationReason) || null;
  }
}

function isActiveBookingStatus(status) {
  return [
    BOOKING_STATUS.PENDING,
    BOOKING_STATUS.CONFIRMED,
    BOOKING_STATUS.CHECKED_IN,
  ].includes(status);
}

async function getInventoryDocsForStay(hotelId, roomTypeId, checkInDate, checkOutDate) {
  const dates = getDateRange(checkInDate, checkOutDate);

  const inventoryDocs = await Inventory.find({
    hotelId,
    roomTypeId,
    date: { $in: dates },
  }).sort({ date: 1 });

  if (inventoryDocs.length !== dates.length) {
    throw new AppError("Inventory is not configured for the full selected date range", 400);
  }

  return inventoryDocs;
}

module.exports = {
  ensureEntitiesBelongToHotel,
  ensureNoRoomConflict,
  buildGuestSnapshot,
  buildRoomSnapshot,
  calculateAmountsFromInventory,
  isActiveBookingStatus,
  applyStatusTimestamps,
  getInventoryDocsForStay,
  buildPricingSnapshot,
};