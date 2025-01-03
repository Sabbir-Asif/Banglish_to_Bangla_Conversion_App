const Document = require('./DocumentModel');

exports.getAllDocuments = async (req, res) => {
    try {
        const documents = await Document.find()
            .populate('owner', 'displayName email')
            .populate('collaborators', 'displayName email');
        res.status(200).json(documents);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.getDocumentById = async (req, res) => {
    try {
        const documentId = req.params.id;
        const document = await Document.findById(documentId)
            .populate('owner', 'displayName email')
            .populate('collaborators', 'displayName email');
        
        if (!document) {
            return res.status(404).json({ message: 'Document not found' });
        }
        res.status(200).json(document);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.createDocument = async (req, res) => {
    try {
        const {
            owner,
            collaborators,
            status,
            caption,
            title,
            banglishContent,
            banglaContent,
            isPublic,
            pdfUrl,
            tags
        } = req.body;

        const newDocument = new Document({
            owner,
            collaborators,
            status,
            caption,
            title,
            banglishContent,
            banglaContent,
            isPublic,
            pdfUrl,
            tags
        });

        const savedDocument = await newDocument.save();
        const populatedDocument = await Document.findById(savedDocument._id)
            .populate('owner', 'displayName email')
            .populate('collaborators', 'displayName email');

        res.status(201).json(populatedDocument);
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: 'Failed to create document' });
    }
};

exports.updateDocument = async (req, res) => {
    try {
        const documentId = req.params.id;
        const updates = req.body;

        const updatedDocument = await Document.findByIdAndUpdate(
            documentId,
            updates,
            { new: true }
        ).populate('owner', 'displayName email')
         .populate('collaborators', 'displayName email');

        if (!updatedDocument) {
            return res.status(404).json({ message: 'Document not found' });
        }
        res.status(200).json(updatedDocument);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to update document' });
    }
};

exports.deleteDocument = async (req, res) => {
    try {
        const documentId = req.params.id;
        const document = await Document.findByIdAndDelete(documentId);
        
        if (!document) {
            return res.status(404).json({ message: 'Document not found' });
        }
        res.status(200).json({ message: 'Document deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to delete document' });
    }
};

exports.searchDocuments = async (req, res) => {
    try {
        const {
            searchTerm,
            status,
            isPublic,
            owner,
            tags,
            startDate,
            endDate
        } = req.query;

        let query = {};

        // Text search across multiple fields
        if (searchTerm) {
            query.$or = [
                { $text: { $search: searchTerm } },
                { title: { $regex: searchTerm, $options: 'i' } },
                { caption: { $regex: searchTerm, $options: 'i' } },
                { banglishContent: { $regex: searchTerm, $options: 'i' } },
                { banglaContent: { $regex: searchTerm, $options: 'i' } },
                { tags: { $in: [new RegExp(searchTerm, 'i')] } }
            ];
        }

        // Additional filters
        if (status) query.status = status;
        if (isPublic !== undefined) query.isPublic = isPublic;
        if (owner) query.owner = owner;
        if (tags) {
            const tagArray = tags.split(',');
            query.tags = { $in: tagArray };
        }

        // Date range filter
        if (startDate || endDate) {
            query.createdAt = {};
            if (startDate) query.createdAt.$gte = new Date(startDate);
            if (endDate) query.createdAt.$lte = new Date(endDate);
        }

        const documents = await Document.find(query)
            .populate('owner', 'displayName email')
            .populate('collaborators', 'displayName email')
            .sort({ createdAt: -1 });

        if (documents.length === 0) {
            return res.status(404).json({ message: 'No documents found matching the criteria' });
        }

        res.status(200).json(documents);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to search documents' });
    }
};
