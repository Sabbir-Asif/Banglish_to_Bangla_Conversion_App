const mongoose = require('mongoose');
const { Schema } = mongoose;

const documentSchema = new Schema({
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    collaborators: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    status: {
        type: String,
        enum: ['Draft', 'Published'],
        default: 'Draft'
    },
    caption: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    banglishContent: {
        type: String,
        default: ''
    },
    banglaContent: {
        type: String,
        default: ''
    },
    isPublic: {
        type: Boolean,
        default: true
    },
    pdfUrl: {
        type: String,
        default: 'xyz'
    },
    tags: [{
        type: String
    }]
}, {
    timestamps: true
});

documentSchema.index({
    title: 'text',
    caption: 'text',
    banglishContent: 'text',
    banglaContent: 'text',
    tags: 'text'
});

const Document = mongoose.model('Document', documentSchema);

module.exports = Document;