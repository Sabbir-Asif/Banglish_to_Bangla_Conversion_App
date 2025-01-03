const TempData = require('./TempDataModel');

// Get all temp data entries
exports.getAllTempData = async (req, res) => {
    try {
        const entries = await TempData.find();
        res.status(200).json(entries);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Search temp data entries
exports.searchTempData = async (req, res) => {
    try {
        const { keyword } = req.query;
        const entries = await TempData.find({
            $or: [
                { banglish: { $regex: keyword, $options: 'i' } },
                { english: { $regex: keyword, $options: 'i' } },
                { bangla: { $regex: keyword, $options: 'i' } }
            ]
        });

        if (entries.length === 0) {
            return res.status(404).json({ message: 'No entries found matching the criteria' });
        }

        res.status(200).json(entries);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to search entries' });
    }
};

// Get temp data entry by ID
exports.getTempDataById = async (req, res) => {
    try {
        const entry = await TempData.findById(req.params.id);
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
        const { banglish, english, bangla } = req.body;
        const newEntry = new TempData({ banglish, english, bangla });
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
            req.body,
            { new: true }
        );
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