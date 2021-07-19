const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { ObjectId } = mongoose.Schema;

const Booking = new Schema(
  {
    bookingStartDate: {
      type: Date,
      required: true,
    },
    bookingEndDate: {
      type: Date,
      reqired: true,
    },
    invoice: {
      type: String,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
    },
    total: {
      type: Number,
      required: true,
    },
    itemId: {
      type: ObjectId,
      ref: "Item",
    },
    customerId: {
      type: ObjectId,
      ref: "Customer",
    },
    bankId: {
      type: ObjectId,
      ref: "Bank",
    },
    payments: {
      transferProof: {
        type: String,
        required: true,
      },
      transferFrom: {
        type: String,
        required: true,
      },
      transferFromBank: {
        type: String,
        required: true,
      },
      status: {
        type: String,
        required: true,
      },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Booking", Booking);
