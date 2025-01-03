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
        required: true
    },
    banglaContent: {
        type: String,
        required: true
    },
    isPublic: {
        type: Boolean,
        default: false
    },
    pdfUrl: {
        type: String
    },
    tags: [{
        type: String
    }]
}, {
    timestamps: true // This automatically adds createdAt and updatedAt fields
});

// Add text indexes for search functionality
documentSchema.index({
    title: 'text',
    caption: 'text',
    banglishContent: 'text',
    banglaContent: 'text',
    tags: 'text'
});

const Document = mongoose.model('Document', documentSchema);

module.exports = Document;