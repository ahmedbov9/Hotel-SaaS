const Hotel = require("./hotel.model");
const Membership = require("../memberships/membership.model");
const AppError = require("../../common/errors/AppError");
const slugify = require("../../common/utils/slugify");
const { HOTEL_MEMBERSHIP_ROLES } = require("../../config/constants");

async function createHotel(ownerUserId, payload) {
  const baseSlug = slugify(payload.name);
  let slug = baseSlug;
  let counter = 1;

  while (await Hotel.findOne({ slug })) {
    slug = `${baseSlug}-${counter++}`;
  }

  const hotel = await Hotel.create({
    name: payload.name,
    slug,
    legalName: payload.legalName || null,
    email: payload.email || null,
    phone: payload.phone || null,
    country: payload.country || "Saudi Arabia",
    city: payload.city || null,
    address: payload.address || null,
    timezone: payload.timezone || "Asia/Riyadh",
    currency: payload.currency || "SAR",
    taxNumber: payload.taxNumber || null,
    starRating: payload.starRating || null,
    logo: payload.logo || null,
    coverImage: payload.coverImage || null,
    description: payload.description || null,
    ownerUserId,
  });



  await Membership.create({
    hotelId: hotel._id,
    userId: ownerUserId,
    role: HOTEL_MEMBERSHIP_ROLES.OWNER,
    permissions: ["*"],
  });


  return hotel;
}

async function getCurrentHotel(hotelId) {
  const hotel = await Hotel.findById(hotelId);

  if (!hotel) {
    throw new AppError("Hotel not found", 404);
  }

  return hotel;
}

async function getMyHotels(userId) {
  const hotels = await Hotel.find({
    ownerUserId: userId,
  }).sort("createdAt");

  if (hotels.length === 0) {
    // check if user is a member of any hotels
    const memberships = await Membership.find({ userId });

    if (memberships.length === 0) {
      return [];
    }

    const hotelIds = memberships.map((m) => m.hotelId);
    const memberHotels = await Hotel.find({ _id: { $in: hotelIds } }).sort(
      "createdAt",
    );

    return memberHotels.map((hotel) => {
      const membership = memberships.find(
        (m) => String(m.hotelId) === String(hotel._id),
      );

      return {
        hotel,
        membership: membership || null,
      };
    });
  }

  const memberships = await Membership.find({
    userId,
    hotelId: { $in: hotels.map((hotel) => hotel._id) },
  });

  const items = hotels.map((hotel) => {
    const membership = memberships.find(
      (item) => String(item.hotelId) === String(hotel._id),
    );

    return {
      hotel,
      membership: membership || null,
    };
  });

  return items;
}

module.exports = {
  createHotel,
  getCurrentHotel,
  getMyHotels,
};