const mongoose = required('mongoose');
const Schema = mongoose.Schema;
const {ObjectId} = mongoose.Schema;

const Facility = new Schema({
    name: {
        type: String,
        required: true
    },
    qty: {
        type: Number,
        required: true
    },
    imageId: [{
        type: ObjectId,
        ref: 'Image'
    }],
    itemId: [{
        type: ObjectId,
        ref: 'Item'
    }]
}, {
    timestamps: true
})

module.exports = mongoose.model('Facility', Facility);