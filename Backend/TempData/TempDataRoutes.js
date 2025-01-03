const express = require('express');
const router = express.Router();
const tempDataController = require('./TempDataController');

router.get('/', tempDataController.getAllTempData);
router.get('/search', tempDataController.searchTempData);
router.get('/:id', tempDataController.getTempDataById);
router.post('/', tempDataController.createTempData);
router.patch('/:id', tempDataController.updateTempData);
router.delete('/:id', tempDataController.deleteTempData);

module.exports = router;
