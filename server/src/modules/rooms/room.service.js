const Room = require("./room.model");
const RoomType = require("../room-types/room-type.model");
const AppError = require("../../common/errors/AppError");

async function createRoom(hotelId, payload) {
  const roomType = await RoomType.findOne({
    _id: payload.roomTypeId,
    hotelId,
  });

  if (!roomType) {
    throw new AppError("Room type not found for this hotel", 404);
  }

  const existingRoom = await Room.findOne({
    hotelId,
    roomNumber: payload.roomNumber,
  });

  if (existingRoom) {
    throw new AppError("Room number already exists in this hotel", 409);
  }

  const room = await Room.create({
    hotelId,
    roomTypeId: payload.roomTypeId,
    roomNumber: payload.roomNumber,
    floor: payload.floor ?? null,
    status: payload.status || "available",
    notes: payload.notes || null,
  });

  return room;
}

async function listRooms(hotelId) {
  return Room.find({ hotelId })
    .populate("roomTypeId", "name slug baseCapacity maxCapacity bedType basePrice")
    .sort({ createdAt: -1 });
}

async function getRoomById(hotelId, id) {
  const room = await Room.findOne({ _id: id, hotelId }).populate(
    "roomTypeId",
    "name slug baseCapacity maxCapacity bedType basePrice"
  );

  if (!room) {
    throw new AppError("Room not found", 404);
  }

  return room;
}

async function updateRoom(hotelId, id, payload) {
  const room = await Room.findOne({ _id: id, hotelId });

  if (!room) {
    throw new AppError("Room not found", 404);
  }

  if (payload.roomTypeId) {
    const roomType = await RoomType.findOne({
      _id: payload.roomTypeId,
      hotelId,
    });

    if (!roomType) {
      throw new AppError("Room type not found for this hotel", 404);
    }

    room.roomTypeId = payload.roomTypeId;
  }

  if (
    payload.roomNumber &&
    payload.roomNumber !== room.roomNumber
  ) {
    const existingRoom = await Room.findOne({
      hotelId,
      roomNumber: payload.roomNumber,
      _id: { $ne: room._id },
    });

    if (existingRoom) {
      throw new AppError("Room number already exists in this hotel", 409);
    }

    room.roomNumber = payload.roomNumber;
  }

  if (payload.floor !== undefined) room.floor = payload.floor;
  if (payload.status !== undefined) room.status = payload.status;
  if (payload.notes !== undefined) room.notes = payload.notes;

  await room.save();

  return room;
}

module.exports = {
  createRoom,
  listRooms,
  getRoomById,
  updateRoom,
};