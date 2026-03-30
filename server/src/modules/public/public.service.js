const Hotel = require("../hotels/hotel.model");
const RoomType = require("../room-types/room-type.model");
const Room = require("../rooms/room.model");
const Guest = require("../guests/guest.model");
const Booking = require("../bookings/booking.model");
const AppError = require("../../common/errors/AppError");
const { BOOKING_STATUS, BOOKING_SOURCE, ROOM_STATUS } = require("../../config/constants");

const generateBookingNumber = require("../../common/utils/generateBookingNumber");
const {
  calculateNights,
  parseDate,
  normalizeDate,
  normalizeNullableString,
} = require("../../common/utils/utils");
const { assertInventoryAvailability, reserveInventory } = require("../inventory/inventory.utils");

async function getHotelBySlugOrFail(slug) {
  const hotel = await Hotel.findOne({
    slug,
    status: "active",
  });

  if (!hotel) {
    throw new AppError("Hotel not found", 404);
  }

  return hotel;
}

async function getPublicHotel(slug) {
  const hotel = await getHotelBySlugOrFail(slug);

  return {
    id: hotel._id,
    name: hotel.name,
    slug: hotel.slug,
    city: hotel.city,
    country: hotel.country,
    address: hotel.address,
    timezone: hotel.timezone,
    currency: hotel.currency,
    starRating: hotel.starRating,
    logo: hotel.logo,
    coverImage: hotel.coverImage,
    description: hotel.description,
  };
}

async function getPublicAvailability(slug, query) {
  const hotel = await getHotelBySlugOrFail(slug);

  const checkInDate = parseDate(query.checkInDate, "checkInDate");
  const checkOutDate = parseDate(query.checkOutDate, "checkOutDate");
  const nights = calculateNights(checkInDate, checkOutDate);

  const roomTypes = await RoomType.find({
    hotelId: hotel._id,
    isActive: true,
  }).sort({ createdAt: -1 });

  const results = [];

  for (const roomType of roomTypes) {
    try {
      const inventoryDocs = await assertInventoryAvailability(
        hotel._id,
        roomType._id,
        checkInDate,
        checkOutDate,
      );

      const nightlyRates = inventoryDocs.map((doc) => ({
        date: doc.date,
        price:
          doc.priceOverride !== null && doc.priceOverride !== undefined
            ? doc.priceOverride
            : roomType.basePrice,
      }));

      const subtotal = nightlyRates.reduce((sum, item) => sum + item.price, 0);

      results.push({
        roomType: {
          id: roomType._id,
          name: roomType.name,
          slug: roomType.slug,
          description: roomType.description,
          baseCapacity: roomType.baseCapacity,
          maxCapacity: roomType.maxCapacity,
          bedType: roomType.bedType,
          sizeInSqm: roomType.sizeInSqm,
          amenities: roomType.amenities,
          images: roomType.images,
        },
        pricing: {
          nights,
          nightlyRates,
          subtotal,
          currency: hotel.currency || "SAR",
        },
        availability: {
          available: true,
        },
      });
    } catch (error) {
      console.log("Public availability error:", {
        roomTypeId: roomType._id.toString(),
        roomTypeName: roomType.name,
        message: error.message,
      });

      results.push({
        roomType: {
          id: roomType._id,
          name: roomType.name,
          slug: roomType.slug,
        },
        availability: {
          available: false,
          reason: error.message,
        },
      });
    }
  }

  return {
    hotel: {
      id: hotel._id,
      name: hotel.name,
      slug: hotel.slug,
      currency: hotel.currency,
      timezone: hotel.timezone,
    },
    search: {
      checkInDate,
      checkOutDate,
      nights,
      adults: query.adults,
      children: query.children ?? 0,
    },
    roomTypes: results,
  };
}

async function findAvailableRoom(
  hotelId,
  roomTypeId,
  checkInDate,
  checkOutDate,
) {
  const rooms = await Room.find({
    hotelId,
    roomTypeId,
    status: "available",
  }).sort({ roomNumber: 1 });

  for (const room of rooms) {
    const conflict = await Booking.findOne({
      hotelId,
      roomId: room._id,
      status: { $in: ["pending", "confirmed", "checked_in"] },
      checkInDate: { $lt: checkOutDate },
      checkOutDate: { $gt: checkInDate },
    });

    if (!conflict) {
      return room;
    }
  }

  throw new AppError(
    "No room available for the selected room type and dates",
    409,
  );
}

async function findOrCreateGuest(hotelId, guestPayload) {
  const email =
    normalizeNullableString(guestPayload.email)?.toLowerCase() || null;
  const phone = normalizeNullableString(guestPayload.phone) || null;

  let guest = null;

  if (email) {
    guest = await Guest.findOne({ hotelId, email });
  }

  if (!guest && phone) {
    guest = await Guest.findOne({ hotelId, phone });
  }

  if (guest) {
    if (guestPayload.firstName) guest.firstName = guestPayload.firstName.trim();
    if (guestPayload.lastName) guest.lastName = guestPayload.lastName.trim();
    if (guestPayload.email !== undefined) guest.email = email;
    if (guestPayload.phone !== undefined) guest.phone = phone;
    if (guestPayload.nationality !== undefined) {
      guest.nationality = normalizeNullableString(guestPayload.nationality);
    }
    if (guestPayload.idType !== undefined) {
      guest.idType = normalizeNullableString(guestPayload.idType);
    }
    if (guestPayload.idNumber !== undefined) {
      guest.idNumber = normalizeNullableString(guestPayload.idNumber);
    }
    if (guestPayload.dateOfBirth !== undefined) {
      guest.dateOfBirth = normalizeDate(guestPayload.dateOfBirth);
    }
    if (guestPayload.notes !== undefined) {
      guest.notes = normalizeNullableString(guestPayload.notes);
    }

    await guest.save();
    return guest;
  }

  guest = await Guest.create({
    hotelId,
    firstName: guestPayload.firstName.trim(),
    lastName: guestPayload.lastName.trim(),
    email,
    phone,
    nationality: normalizeNullableString(guestPayload.nationality),
    idType: normalizeNullableString(guestPayload.idType),
    idNumber: normalizeNullableString(guestPayload.idNumber),
    dateOfBirth: normalizeDate(guestPayload.dateOfBirth),
    notes: normalizeNullableString(guestPayload.notes),
    tags: ["public_booking"],
  });

  return guest;
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
  paidAmount = 0,
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

async function createPublicBooking(slug, payload) {
  const hotel = await getHotelBySlugOrFail(slug);

  const roomType = await RoomType.findOne({
    _id: payload.roomTypeId,
    hotelId: hotel._id,
    isActive: true,
  });

  if (!roomType) {
    throw new AppError("Room type not found for this hotel", 404);
  }

  const checkInDate = parseDate(payload.checkInDate, "checkInDate");
  const checkOutDate = parseDate(payload.checkOutDate, "checkOutDate");
  const nights = calculateNights(checkInDate, checkOutDate);

  const inventoryDocs = await assertInventoryAvailability(
    hotel._id,
    roomType._id,
    checkInDate,
    checkOutDate,
  );

  const room = await findAvailableRoom(
    hotel._id,
    roomType._id,
    checkInDate,
    checkOutDate,
  );

  const guest = await findOrCreateGuest(hotel._id, payload.guest);

  const taxes = 0;
  const discounts = 0;
  const paidAmount = 0;

  const amounts = calculateAmountsFromInventory(
    inventoryDocs,
    roomType,
    taxes,
    discounts,
    paidAmount,
  );

  const pricingSnapshot = buildPricingSnapshot(inventoryDocs, roomType);

  await reserveInventory(hotel._id, roomType._id, checkInDate, checkOutDate);

  let bookingNumber = generateBookingNumber();
  while (await Booking.findOne({ hotelId: hotel._id, bookingNumber })) {
    bookingNumber = generateBookingNumber();
  }


  room.status = `${ROOM_STATUS.OCCUPIED}`;
  await room.save();

  const booking = await Booking.create({
    hotelId: hotel._id,
    bookingNumber,
    guestId: guest._id,
    roomTypeId: roomType._id,
    roomId: room._id,
    source: BOOKING_SOURCE.DIRECT,
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
    assignedBy: null,
  });

  return {
    bookingId: booking._id,
    bookingNumber: booking.bookingNumber,
    status: booking.status,
    hotel: {
      id: hotel._id,
      name: hotel.name,
      slug: hotel.slug,
      currency: hotel.currency,
    },
    guest: booking.guestSnapshot,
    stay: {
      checkInDate: booking.checkInDate,
      checkOutDate: booking.checkOutDate,
      nights: booking.nights,
    },
    pricing: {
      subtotal: booking.subtotal,
      taxes: booking.taxes,
      discounts: booking.discounts,
      total: booking.total,
      dueAmount: booking.dueAmount,
      currency: hotel.currency || "SAR",
    },
  };
}

module.exports = {
  getPublicHotel,
  getPublicAvailability,
  createPublicBooking,
};
