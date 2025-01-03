const mongoose = require('mongoose');
const { Schema } = mongoose;

const dataTableSchema = new Schema({
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

const DataTable = mongoose.model('DataTable', dataTableSchema);

module.exports = DataTable;