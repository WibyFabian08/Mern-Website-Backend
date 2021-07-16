const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { ObjectId } = mongoose.Schema;

const Activity = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
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
    imageId: [{
      type: Objectid,
      ref: "Image",
    }],
    itemId: [{
      type: ObjectId,
      ref: 'Item'
    }]
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Activity", Activity);
