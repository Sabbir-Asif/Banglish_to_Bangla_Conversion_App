const mongoose = require('mongoose');
const { Schema } = mongoose;

const tempDataSchema = new Schema({
    banglish: {
        type: String,
        required: true
    },
    english: {
        type: String,
        required: true
    },
    bangla: {
        type: String,
        required: true
    }
}, { timestamps: true });

const TempData = mongoose.model('TempData', tempDataSchema);

module.exports = TempData;