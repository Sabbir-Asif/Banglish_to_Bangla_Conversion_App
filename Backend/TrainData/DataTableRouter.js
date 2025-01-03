const express = require('express');
const router = express.Router();
const dataTableController = require('./DataTableController');

router.get('/', dataTableController.getAllEntries);
router.get('/search', dataTableController.searchEntries);
router.get('/:id', dataTableController.getEntryById);
router.post('/', dataTableController.createEntry);
router.patch('/:id', dataTableController.updateEntry);
router.delete('/:id', dataTableController.deleteEntry);

module.exports = router;