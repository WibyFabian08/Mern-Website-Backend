const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const {ObjectId} = mongoose.Schema;

const Category = new Schema({
    name: {
        type:String,
        required: true
    },
    itemId: [{
        type: ObjectId,
        ref: 'Item'
    }]
}, {
    timestamps: true
})

module.exports = mongoose.model('Category', Category);