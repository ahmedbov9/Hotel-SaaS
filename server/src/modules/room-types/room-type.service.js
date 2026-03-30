const RoomType = require("./room-type.model");
const AppError = require("../../common/errors/AppError");
const slugify = require("../../common/utils/slugify");

async function createRoomType(hotelId, payload) {
  if (payload.maxCapacity < payload.baseCapacity) {
    throw new AppError(
      "maxCapacity must be greater than or equal to baseCapacity",
      400
    );
  }

  const baseSlug = slugify(payload.name);
  let slug = baseSlug;
  let counter = 1;

  while (await RoomType.findOne({ hotelId, slug })) {
    slug = `${baseSlug}-${counter++}`;
  }

  const roomType = await RoomType.create({
    hotelId,
    name: payload.name,
    slug,
    description: payload.description || null,
    baseCapacity: payload.baseCapacity,
    maxCapacity: payload.maxCapacity,
    bedType: payload.bedType,
    sizeInSqm: payload.sizeInSqm ?? null,
    amenities: payload.amenities || [],
    images: payload.images || [],
    basePrice: payload.basePrice,
    isActive: payload.isActive ?? true,
  });

  return roomType;
}

async function listRoomTypes(hotelId) {
  return RoomType.find({ hotelId }).sort({ createdAt: -1 });
}

async function getRoomTypeById(hotelId, id) {
  const roomType = await RoomType.findOne({ _id: id, hotelId });

  if (!roomType) {
    throw new AppError("Room type not found", 404);
  }

  return roomType;
}

async function updateRoomType(hotelId, id, payload) {
  const roomType = await RoomType.findOne({ _id: id, hotelId });

  if (!roomType) {
    throw new AppError("Room type not found", 404);
  }

  const nextBaseCapacity = payload.baseCapacity ?? roomType.baseCapacity;
  const nextMaxCapacity = payload.maxCapacity ?? roomType.maxCapacity;

  if (nextMaxCapacity < nextBaseCapacity) {
    throw new AppError(
      "maxCapacity must be greater than or equal to baseCapacity",
      400
    );
  }

  if (payload.name && payload.name !== roomType.name) {
    const baseSlug = slugify(payload.name);
    let slug = baseSlug;
    let counter = 1;

    while (
      await RoomType.findOne({
        hotelId,
        slug,
        _id: { $ne: roomType._id },
      })
    ) {
      slug = `${baseSlug}-${counter++}`;
    }

    roomType.name = payload.name;
    roomType.slug = slug;
  }

  if (payload.description !== undefined) roomType.description = payload.description;
  if (payload.baseCapacity !== undefined) roomType.baseCapacity = payload.baseCapacity;
  if (payload.maxCapacity !== undefined) roomType.maxCapacity = payload.maxCapacity;
  if (payload.bedType !== undefined) roomType.bedType = payload.bedType;
  if (payload.sizeInSqm !== undefined) roomType.sizeInSqm = payload.sizeInSqm;
  if (payload.amenities !== undefined) roomType.amenities = payload.amenities;
  if (payload.images !== undefined) roomType.images = payload.images;
  if (payload.basePrice !== undefined) roomType.basePrice = payload.basePrice;
  if (payload.isActive !== undefined) roomType.isActive = payload.isActive;

  await roomType.save();

  return roomType;
}

module.exports = {
  createRoomType,
  listRoomTypes,
  getRoomTypeById,
  updateRoomType,
};