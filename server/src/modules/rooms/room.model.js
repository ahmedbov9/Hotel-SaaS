const { mongoose, baseOptions } = require("../../common/database/base.schema");
const { ROOM_STATUS } = require("../../config/constants");

const roomSchema = new mongoose.Schema(
  {
    hotelId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hotel",
      required: true,
      index: true,
    },
    roomTypeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RoomType",
      required: true,
      index: true,
    },
    roomNumber: {
      type: String,
      required: true,
      trim: true,
      maxlength: 20,
    },
    floor: {
      type: Number,
      default: null,
    },
    status: {
      type: String,
      enum: Object.values(ROOM_STATUS),
      default: ROOM_STATUS.AVAILABLE,
      required: true,
    },
    notes: {
      type: String,
      default: null,
      trim: true,
      maxlength: 1000,
    },
  },
  baseOptions
);

roomSchema.index({ hotelId: 1, roomNumber: 1 }, { unique: true });
roomSchema.index({ hotelId: 1, roomTypeId: 1 });
roomSchema.index({ hotelId: 1, status: 1 });

module.exports = mongoose.model("Room", roomSchema);