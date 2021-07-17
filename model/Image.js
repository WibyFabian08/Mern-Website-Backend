const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const {ObjectId} = mongoose.Schema;

const Image = new Schema({
    imageUrl: {
        type: String,
        required: true
    },
    itemId: {
        type: ObjectId,
        ref: 'Item'
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('Image', Image);