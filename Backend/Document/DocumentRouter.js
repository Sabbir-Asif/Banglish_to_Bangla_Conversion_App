const express = require('express');
const router = express.Router();
const documentController = require('./DocumentController');

/**
 * @swagger
 * components:
 *   schemas:
 *     Document:
 *       type: object
 *       required:
 *         - owner
 *         - caption
 *         - title
 *       properties:
 *         owner:
 *           type: string
 *           description: User ID of the document owner
 *         collaborators:
 *           type: array
 *           items:
 *             type: string
 *           description: Array of user IDs who can collaborate on the document
 *         status:
 *           type: string
 *           enum: [Draft, Published]
 *           default: Draft
 *           description: Status of the document
 *         caption:
 *           type: string
 *           description: Caption of the document
 *         title:
 *           type: string
 *           description: Title of the document
 *         banglishContent:
 *           type: string
 *           description: Content in Banglish
 *         banglaContent:
 *           type: string
 *           description: Content in Bangla
 *         isPublic:
 *           type: boolean
 *           default: true
 *           description: Visibility of the document
 *         pdfUrl:
 *           type: string
 *           description: URL of the PDF version of the document
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *           description: Tags associated with the document
 *       example:
 *         owner: "63c12345678abcd123456789"
 *         collaborators: ["63c987654321abcd123456789"]
 *         status: "Draft"
 *         caption: "Sample caption"
 *         title: "Document title"
 *         banglishContent: "Banglish text here"
 *         banglaContent: "Bangla text here"
 *         isPublic: true
 *         pdfUrl: "https://example.com/sample.pdf"
 *         tags: ["tag1", "tag2"]

/**
 * @swagger
 * tags:
 *   name: Documents
 *   description: API endpoints for managing documents
 */

/**
 * @swagger
 * /documents:
 *   get:
 *     summary: Retrieve all documents
 *     tags: [Documents]
 *     responses:
 *       200:
 *         description: List of all documents
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Document'
 *       500:
 *         description: Server error
 */
router.get('/', documentController.getAllDocuments);

/**
 * @swagger
 * /documents/search:
 *   get:
 *     summary: Search documents
 *     tags: [Documents]
 *     parameters:
 *       - in: query
 *         name: query
 *         schema:
 *           type: string
 *         description: Search query (e.g., by title or tags)
 *     responses:
 *       200:
 *         description: List of documents matching the query
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Document'
 *       400:
 *         description: Bad request
 *       500:
 *         description: Server error
 */
router.get('/search', documentController.searchDocuments);

/**
 * @swagger
 * /documents/{id}:
 *   get:
 *     summary: Retrieve a document by ID
 *     tags: [Documents]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The document ID
 *     responses:
 *       200:
 *         description: Document details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Document'
 *       404:
 *         description: Document not found
 *       500:
 *         description: Server error
 */
router.get('/:id', documentController.getDocumentById);

/**
 * @swagger
 * /documents:
 *   post:
 *     summary: Create a new document
 *     tags: [Documents]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Document'
 *     responses:
 *       201:
 *         description: Document created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Document'
 *       400:
 *         description: Bad request
 *       500:
 *         description: Server error
 */
router.post('/', documentController.createDocument);

/**
 * @swagger
 * /documents/{id}:
 *   patch:
 *     summary: Update a document
 *     tags: [Documents]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The document ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Document'
 *     responses:
 *       200:
 *         description: Document updated successfully
 *       404:
 *         description: Document not found
 *       500:
 *         description: Server error
 */
router.patch('/:id', documentController.updateDocument);

/**
 * @swagger
 * /documents/{id}:
 *   delete:
 *     summary: Delete a document
 *     tags: [Documents]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The document ID
 *     responses:
 *       204:
 *         description: Document deleted successfully
 *       404:
 *         description: Document not found
 *       500:
 *         description: Server error
 */
router.delete('/:id', documentController.deleteDocument);

module.exports = router;
