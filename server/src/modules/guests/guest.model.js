const { mongoose, baseOptions } = require("../../common/database/base.schema");

const guestSchema = new mongoose.Schema(
  {
    hotelId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hotel",
      required: true,
      index: true,
    },
    firstName: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: 100,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: 100,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      default: null,
    },
    phone: {
      type: String,
      trim: true,
      default: null,
    },
    nationality: {
      type: String,
      trim: true,
      default: null,
      maxlength: 100,
    },
    idType: {
      type: String,
      trim: true,
      default: null,
      maxlength: 50,
    },
    idNumber: {
      type: String,
      trim: true,
      default: null,
      maxlength: 100,
    },
    dateOfBirth: {
      type: Date,
      default: null,
    },
    notes: {
      type: String,
      trim: true,
      default: null,
      maxlength: 2000,
    },
    tags: {
      type: [String],
      default: [],
    },
  },
  baseOptions
);

guestSchema.index({ hotelId: 1, email: 1 });
guestSchema.index({ hotelId: 1, phone: 1 });
guestSchema.index(
  { hotelId: 1, idType: 1, idNumber: 1 },
  {
    unique: true,
    partialFilterExpression: {
      idType: { $type: "string" },
      idNumber: { $type: "string" },
    },
  }
);

module.exports = mongoose.model("Guest", guestSchema);