const Booking = require("./booking.model");
const AppError = require("../../common/errors/AppError");
const generateBookingNumber = require("../../common/utils/generateBookingNumber");
const { BOOKING_STATUS, ROOM_STATUS } = require("../../config/constants");
const Room = require("../rooms/room.model");
const {
  ensureEntitiesBelongToHotel,
  ensureNoRoomConflict,
  calculateAmountsFromInventory,
  buildGuestSnapshot,
  buildRoomSnapshot,
  buildPricingSnapshot,
  isActiveBookingStatus,
  applyStatusTimestamps,
  getInventoryDocsForStay,
} = require("./booking.utils");
const {
  normalizeNullableString,
  parseDate,
  calculateNights,
} = require("../../common/utils/utils");
const {
  reserveInventory,
  releaseInventory,
} = require("../inventory/inventory.utils");

async function getBookingOrFail(hotelId, id) {
  const booking = await Booking.findOne({ _id: id, hotelId });

  if (!booking) {
    throw new AppError("Booking not found", 404);
  }

  return booking;
}

async function confirmBooking(hotelId, id) {
  const booking = await getBookingOrFail(hotelId, id);

  if (booking.status === BOOKING_STATUS.CANCELLED) {
    throw new AppError("Cancelled booking cannot be confirmed", 400);
  }

  if (booking.status === BOOKING_STATUS.CHECKED_OUT) {
    throw new AppError("Checked-out booking cannot be confirmed", 400);
  }

  if (booking.status === BOOKING_STATUS.CONFIRMED) {
    return booking;
  }

  if (booking.status === BOOKING_STATUS.CHECKED_IN) {
    throw new AppError(
      "Checked-in booking is already beyond confirmation stage",
      400,
    );
  }

  booking.status = BOOKING_STATUS.CONFIRMED;
  booking.confirmedAt = booking.confirmedAt || new Date();

  await booking.save();
  return booking;
}

async function checkInBooking(hotelId, id) {
  const booking = await getBookingOrFail(hotelId, id);

  if (booking.status === BOOKING_STATUS.CANCELLED) {
    throw new AppError("Cancelled booking cannot be checked in", 400);
  }

  if (booking.status === BOOKING_STATUS.CHECKED_OUT) {
    throw new AppError("Checked-out booking cannot be checked in again", 400);
  }

  if (booking.status === BOOKING_STATUS.CHECKED_IN) {
    return booking;
  }

  if (
    booking.status !== BOOKING_STATUS.CONFIRMED &&
    booking.status !== BOOKING_STATUS.PENDING
  ) {
    throw new AppError(
      "Only pending or confirmed bookings can be checked in",
      400,
    );
  }

  booking.status = BOOKING_STATUS.CHECKED_IN;
  booking.confirmedAt = booking.confirmedAt || new Date();
  booking.checkedInAt = booking.checkedInAt || new Date();

  await booking.save();
  return booking;
}

async function checkOutBooking(hotelId, id) {
  const booking = await getBookingOrFail(hotelId, id);

  if (booking.status === BOOKING_STATUS.CANCELLED) {
    throw new AppError("Cancelled booking cannot be checked out", 400);
  }

  if (booking.status === BOOKING_STATUS.CHECKED_OUT) {
    return booking;
  }

  if (booking.status !== BOOKING_STATUS.CHECKED_IN) {
    throw new AppError("Only checked-in bookings can be checked out", 400);
  }

  booking.status = BOOKING_STATUS.CHECKED_OUT;
  booking.checkedOutAt = booking.checkedOutAt || new Date();

  const room = await Room.findById(booking.roomId);

  room.status = `${ROOM_STATUS.AVAILABLE}`;
  await room.save();

  await booking.save();
  return booking;
}

async function cancelBooking(hotelId, id, cancellationReason) {
  const booking = await getBookingOrFail(hotelId, id);

  if (booking.status === BOOKING_STATUS.CHECKED_OUT) {
    throw new AppError("Checked-out booking cannot be cancelled", 400);
  }

  if (booking.status === BOOKING_STATUS.CANCELLED) {
    return booking;
  }

  const wasActive = isActiveBookingStatus(booking.status);

  if (wasActive) {
    await releaseInventory(
      hotelId,
      booking.roomTypeId.toString(),
      booking.checkInDate,
      booking.checkOutDate,
    );
  }

  booking.status = BOOKING_STATUS.CANCELLED;
  booking.cancelledAt = booking.cancelledAt || new Date();
  booking.cancellationReason =
    normalizeNullableString(cancellationReason) || null;

  const room = await Room.findById(booking.roomId);
  room.status = `${ROOM_STATUS.AVAILABLE}`;
  await room.save();
  console.log('Status is changed');
  await booking.save();
  return booking;
}

async function createBooking(hotelId, userId, payload) {
  const checkInDate = parseDate(payload.checkInDate, "checkInDate");
  const checkOutDate = parseDate(payload.checkOutDate, "checkOutDate");
  const nights = calculateNights(checkInDate, checkOutDate);

  const { guest, roomType, room } = await ensureEntitiesBelongToHotel(
    hotelId,
    payload,
  );

  await ensureNoRoomConflict(hotelId, room._id, checkInDate, checkOutDate);

  const inventoryDocs = await getInventoryDocsForStay(
    hotelId,
    roomType._id,
    checkInDate,
    checkOutDate,
  );

  const taxes = payload.taxes ?? 0;
  const discounts = payload.discounts ?? 0;
  const paidAmount = payload.paidAmount ?? 0;

  const amounts = calculateAmountsFromInventory(
    inventoryDocs,
    roomType,
    taxes,
    discounts,
    paidAmount,
  );

  const pricingSnapshot = buildPricingSnapshot(inventoryDocs, roomType);

  await reserveInventory(hotelId, roomType._id, checkInDate, checkOutDate);

  let bookingNumber = generateBookingNumber();
  while (await Booking.findOne({ hotelId, bookingNumber })) {
    bookingNumber = generateBookingNumber();
  }

  const booking = await Booking.create({
    hotelId,
    bookingNumber,
    guestId: guest._id,
    roomTypeId: roomType._id,
    roomId: room._id,
    source: payload.source || "admin",
    status: BOOKING_STATUS.PENDING,
    checkInDate,
    checkOutDate,
    nights,
    adults: payload.adults,
    children: payload.children ?? 0,
    specialRequests: normalizeNullableString(payload.specialRequests),
    subtotal: amounts.subtotal,
    taxes,
    discounts,
    total: amounts.total,
    paidAmount,
    dueAmount: amounts.dueAmount,
    guestSnapshot: buildGuestSnapshot(guest),
    roomSnapshot: buildRoomSnapshot(room, roomType),
    pricingSnapshot,
    assignedBy: userId,
  });

  room.status = `${ROOM_STATUS.OCCUPIED}`;
  await room.save();

  return booking;
}

async function listBookings(hotelId) {
  return Booking.find({ hotelId })
    .populate("guestId", "firstName lastName email phone")
    .populate("roomId", "roomNumber status")
    .populate("roomTypeId", "name basePrice")
    .sort({ createdAt: -1 });
}

async function getBookingById(hotelId, id) {
  const booking = await Booking.findOne({ _id: id, hotelId })
    .populate("guestId", "firstName lastName email phone nationality")
    .populate("roomId", "roomNumber status floor")
    .populate("roomTypeId", "name bedType basePrice");

  if (!booking) {
    throw new AppError("Booking not found", 404);
  }

  return booking;
}

async function updateBooking(hotelId, id, payload) {
  const booking = await Booking.findOne({ _id: id, hotelId });

  if (!booking) {
    throw new AppError("Booking not found", 404);
  }

  const previousState = {
    roomTypeId: booking.roomTypeId.toString(),
    checkInDate: booking.checkInDate,
    checkOutDate: booking.checkOutDate,
    status: booking.status,
  };

  const candidate = {
    guestId: payload.guestId || booking.guestId.toString(),
    roomTypeId: payload.roomTypeId || booking.roomTypeId.toString(),
    roomId: payload.roomId || booking.roomId.toString(),
  };

  const checkInDate =
    payload.checkInDate !== undefined
      ? parseDate(payload.checkInDate, "checkInDate")
      : booking.checkInDate;

  const checkOutDate =
    payload.checkOutDate !== undefined
      ? parseDate(payload.checkOutDate, "checkOutDate")
      : booking.checkOutDate;

  const nights = calculateNights(checkInDate, checkOutDate);

  const { guest, roomType, room } = await ensureEntitiesBelongToHotel(
    hotelId,
    candidate,
  );

  await ensureNoRoomConflict(
    hotelId,
    room._id,
    checkInDate,
    checkOutDate,
    booking._id,
  );

  const taxes = payload.taxes ?? booking.taxes;
  const discounts = payload.discounts ?? booking.discounts;
  const paidAmount = payload.paidAmount ?? booking.paidAmount;

  const inventoryDocs = await getInventoryDocsForStay(
    hotelId,
    roomType._id,
    checkInDate,
    checkOutDate,
  );

  const amounts = calculateAmountsFromInventory(
    inventoryDocs,
    roomType,
    taxes,
    discounts,
    paidAmount,
  );

  const pricingSnapshot = buildPricingSnapshot(inventoryDocs, roomType);

  const nextStatus = payload.status || booking.status;
  const wasActive = isActiveBookingStatus(previousState.status);
  const willBeActive = isActiveBookingStatus(nextStatus);

  const inventoryChanged =
    previousState.roomTypeId !== roomType._id.toString() ||
    previousState.checkInDate.getTime() !== checkInDate.getTime() ||
    previousState.checkOutDate.getTime() !== checkOutDate.getTime();

  if (wasActive && (!willBeActive || inventoryChanged)) {
    await releaseInventory(
      hotelId,
      previousState.roomTypeId,
      previousState.checkInDate,
      previousState.checkOutDate,
    );
  }

  if (willBeActive && (!wasActive || inventoryChanged)) {
    await reserveInventory(hotelId, roomType._id, checkInDate, checkOutDate);
  }

  booking.guestId = guest._id;
  booking.roomTypeId = roomType._id;
  booking.roomId = room._id;
  booking.source = payload.source ?? booking.source;
  booking.checkInDate = checkInDate;
  booking.checkOutDate = checkOutDate;
  booking.nights = nights;
  booking.adults = payload.adults ?? booking.adults;
  booking.children = payload.children ?? booking.children;
  booking.specialRequests =
    payload.specialRequests !== undefined
      ? normalizeNullableString(payload.specialRequests)
      : booking.specialRequests;

  booking.taxes = taxes;
  booking.discounts = discounts;
  booking.paidAmount = paidAmount;
  booking.subtotal = amounts.subtotal;
  booking.total = amounts.total;
  booking.dueAmount = amounts.dueAmount;

  booking.guestSnapshot = buildGuestSnapshot(guest);
  booking.roomSnapshot = buildRoomSnapshot(room, roomType);
  booking.pricingSnapshot = pricingSnapshot;

  if (payload.status) {
    applyStatusTimestamps(booking, payload.status, payload.cancellationReason);
  }

  await booking.save();

  return booking;
}

module.exports = {
  createBooking,
  listBookings,
  getBookingById,
  updateBooking,
  confirmBooking,
  checkInBooking,
  checkOutBooking,
  cancelBooking,
};
