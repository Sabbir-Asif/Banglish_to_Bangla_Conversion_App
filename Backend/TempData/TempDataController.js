const TempData = require('./TempDataModel');

// Get all temp data entries
exports.getAllTempData = async (req, res) => {
    try {
        const entries = await TempData.find().populate('user');
        res.status(200).json(entries);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Search temp data entries
exports.searchTempData = async (req, res) => {
    try {
        const { keyword, status } = req.query; // Extract keyword and status from query params
        const query = {};

        // Add status filter if provided
        if (status) {
            query.status = status;
        }

        // Add keyword filter if provided
        if (keyword) {
            query.$or = [
                { 'data.banglish': { $regex: keyword, $options: 'i' } },
                { 'data.english': { $regex: keyword, $options: 'i' } },
                { 'data.bangla': { $regex: keyword, $options: 'i' } }
            ];
        }

        const entries = await TempData.find(query).populate('user'); // Execute the query

        if (entries.length === 0) {
            return res.status(404).json({ message: 'No entries found matching the criteria' });
        }

        res.status(200).json(entries); // Return the filtered entries
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to search entries' });
    }
};

// Get temp data entry by ID
exports.getTempDataById = async (req, res) => {
    try {
        const entry = await TempData.findById(req.params.id).populate('user');
        if (!entry) {
            return res.status(404).json({ message: 'Entry not found' });
        }
        res.status(200).json(entry);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Create new temp data entry
exports.createTempData = async (req, res) => {
    try {
        const { user, data, status } = req.body;
        const newEntry = new TempData({
            user,
            data,
            status,
            lastModified: new Date()
        });
        const savedEntry = await newEntry.save();
        res.status(201).json(savedEntry);
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: 'Failed to create entry' });
    }
};

// Update temp data entry
exports.updateTempData = async (req, res) => {
    try {
        const updatedEntry = await TempData.findByIdAndUpdate(
            req.params.id,
            { ...req.body, lastModified: new Date() },
            { new: true }
        ).populate('user');
        if (!updatedEntry) {
            return res.status(404).json({ message: 'Entry not found' });
        }
        res.status(200).json(updatedEntry);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to update entry' });
    }
};

// Delete temp data entry
exports.deleteTempData = async (req, res) => {
    try {
        const entry = await TempData.findByIdAndDelete(req.params.id);
        if (!entry) {
            return res.status(404).json({ message: 'Entry not found' });
        }
        res.status(200).json({ message: 'Entry deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to delete entry' });
    }
};
