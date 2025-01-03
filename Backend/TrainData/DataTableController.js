const DataTable = require('./DataTableModel');

exports.getAllEntries = async (req, res) => {
    try {
        const entries = await DataTable.find();
        res.status(200).json(entries);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.searchEntries = async (req, res) => {
    try {
        const query = req.query;
        const entries = await DataTable.find({
            $or: [
                { banglish: { $regex: query.keyword, $options: 'i' } },
                { english: { $regex: query.keyword, $options: 'i' } },
                { bangla: { $regex: query.keyword, $options: 'i' } }
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

exports.getEntryById = async (req, res) => {
    try {
        const entryId = req.params.id;
        const entry = await DataTable.findById(entryId);
        if (!entry) {
            return res.status(404).json({ message: `Entry with id ${entryId} not found` });
        }
        res.status(200).json(entry);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.createEntry = async (req, res) => {
    try {
        const { banglish, english, bangla } = req.body;

        // Validate the request body
        if (!banglish || !english || !bangla) {
            return res.status(400).json({ message: 'All fields (banglish, english, bangla) are required.' });
        }

        // Create and save the new entry
        const newEntry = new DataTable({ banglish, english, bangla });
        const savedEntry = await newEntry.save();

        res.status(201).json(savedEntry);
    } catch (error) {
        console.error('Error creating entry:', error);
        res.status(500).json({ message: 'Failed to create entry' });
    }
};


exports.updateEntry = async (req, res) => {
    try {
        const entryId = req.params.id;
        const updates = req.body;

        const updatedEntry = await DataTable.findByIdAndUpdate(entryId, updates, { new: true });
        if (!updatedEntry) {
            return res.status(404).json({ message: 'Entry not found' });
        }
        res.status(200).json(updatedEntry);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to update entry' });
    }
};

exports.deleteEntry = async (req, res) => {
    try {
        const entryId = req.params.id;
        const entry = await DataTable.findByIdAndDelete(entryId);
        if (!entry) {
            return res.status(404).json({ message: 'Entry not found' });
        }
        res.status(200).json({ message: 'Entry deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to delete entry' });
    }
};
