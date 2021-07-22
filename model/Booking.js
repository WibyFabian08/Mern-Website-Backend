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
    item: {
      _id: {
        type: ObjectId,
        ref: "Item",
        required: true
      },
      title: {
        type: String,
        required: true
      },
      price: {
        type: Number,
        required: true
      },
      duration: {
        type: Number,
        required: true,
      }
    },
    total: {
      type: Number,
      required: true,
    },
    customerId: {
      type: ObjectId,
      ref: "Customer",
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
        default: 'Proccess',
      },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Booking", Booking);
