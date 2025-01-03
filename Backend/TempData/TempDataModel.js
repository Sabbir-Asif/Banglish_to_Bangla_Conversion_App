const mongoose = require('mongoose');
const { Schema } = mongoose;

const User = require('../User/userModel');

const tempDataSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    data: [{
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
    }],
    status: {
        type: String,
        enum: ['approved', 'pending', 'declined'],
        required: true,
        default: 'pending'
    },
    lastModified: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

const TempData = mongoose.model('TempData', tempDataSchema);

module.exports = TempData;
