const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Bank = new Schema({
    nameBank: {
        type: String,
        required: true
    },
    noRekening: {
        type: String,
        requird: true
    },
    name: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    }
}, {
    timestamps: true
})

module.exports = mongoose.model("Bank", Bank);