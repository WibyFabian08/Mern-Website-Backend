const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { ObjectId } = mongoose.Schema;

const Item = new Schema({
    title: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    country: {
        type: String,
        default: 'Indonesia'
    },
    price: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    unit: {
        type: String,
        default: 'night'
    },
    isPopular: {
        type: Boolean,
        default: false
    },
    sumBooking: {
        type: Number,
        default: 0
    },
    categoryId: {
        type: ObjectId,
        ref: 'Category'
    },
    activityId: [{
        type: ObjectId,
        ref: 'Activity'
    }],
    facilityId: [{
        type: ObjectId,
        ref: 'Facility'
    }],
    imageId: [{
        type: ObjectId,
        ref: 'Image'
    }]
}, {
    timestapms: true
})

module.exports = mongoose.model('Item', Item);
