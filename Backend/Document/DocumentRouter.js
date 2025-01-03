const express = require('express');
const router = express.Router();
const documentController = require('./DocumentController');

router.get('/', documentController.getAllDocuments);
router.get('/search', documentController.searchDocuments);
router.get('/:id', documentController.getDocumentById);
router.post('/', documentController.createDocument);
router.patch('/:id', documentController.updateDocument);
router.delete('/:id', documentController.deleteDocument);

module.exports = router;