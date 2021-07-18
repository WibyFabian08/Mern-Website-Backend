const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { ObjectId } = mongoose.Schema;

const Activity = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    isPopular: {
      type: Boolean,
      required: true,
    },
    imageId: {
      type: String,
      required: true,
    },
    itemId: {
      type: ObjectId,
      ref: 'Item'
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Activity", Activity);
