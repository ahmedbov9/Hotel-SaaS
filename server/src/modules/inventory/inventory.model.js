const { mongoose, baseOptions } = require("../../common/database/base.schema");

const inventorySchema = new mongoose.Schema(
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
    date: {
      type: Date,
      required: true,
      index: true,
    },
    totalInventory: {
      type: Number,
      required: true,
      min: 0,
    },
    reservedCount: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    availableCount: {
      type: Number,
      required: true,
      min: 0,
    },
    stopSell: {
      type: Boolean,
      default: false,
    },
    minStay: {
      type: Number,
      min: 1,
      default: 1,
    },
    priceOverride: {
      type: Number,
      min: 0,
      default: null,
    },
  },
  baseOptions
);

inventorySchema.index({ hotelId: 1, roomTypeId: 1, date: 1 }, { unique: true });
inventorySchema.index({ hotelId: 1, date: 1 });
inventorySchema.index({ hotelId: 1, roomTypeId: 1, stopSell: 1 });

module.exports = mongoose.model("Inventory", inventorySchema);