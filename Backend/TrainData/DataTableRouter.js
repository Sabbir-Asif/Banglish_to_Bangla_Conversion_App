const express = require('express');
const router = express.Router();
const dataTableController = require('./DataTableController');

/**
 * @swagger
 * components:
 *   schemas:
 *     DataTable:
 *       type: object
 *       required:
 *         - banglish
 *         - english
 *         - bangla
 *       properties:
 *         banglish:
 *           type: string
 *           description: Text in Banglish
 *         english:
 *           type: string
 *           description: Text in English
 *         bangla:
 *           type: string
 *           description: Text in Bangla
 *       example:
 *         banglish: "Amar nam"
 *         english: "My name is"
 *         bangla: "আমার নাম"

/**
 * @swagger
 * tags:
 *   name: Training Data
 *   description: API endpoints for managing training data
 */

/**
 * @swagger
 * /api/trainData:
 *   get:
 *     summary: Get all training data entries
 *     tags: [Training Data]
 *     responses:
 *       200:
 *         description: List of all entries
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/DataTable'
 *       500:
 *         description: Server error
 */
router.get('/', dataTableController.getAllEntries);

/**
 * @swagger
 * /api/trainData/search:
 *   get:
 *     summary: Search for training data
 *     tags: [Training Data]
 *     parameters:
 *       - in: query
 *         name: query
 *         schema:
 *           type: string
 *         description: Search query
 *     responses:
 *       200:
 *         description: Matching training data entries
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/DataTable'
 *       400:
 *         description: Bad request
 *       500:
 *         description: Server error
 */
router.get('/search', dataTableController.searchEntries);

/**
 * @swagger
 * /api/trainData/{id}:
 *   get:
 *     summary: Get training data entry by ID
 *     tags: [Training Data]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the training data entry
 *     responses:
 *       200:
 *         description: Training data entry details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DataTable'
 *       404:
 *         description: Entry not found
 *       500:
 *         description: Server error
 */
router.get('/:id', dataTableController.getEntryById);

/**
 * @swagger
 * /api/trainData:
 *   post:
 *     summary: Create a new training data entry
 *     tags: [Training Data]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DataTable'
 *     responses:
 *       201:
 *         description: Entry created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DataTable'
 *       400:
 *         description: Bad request
 *       500:
 *         description: Server error
 */
router.post('/', dataTableController.createEntry);

/**
 * @swagger
 * /api/trainData/{id}:
 *   patch:
 *     summary: Update training data entry by ID
 *     tags: [Training Data]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the training data entry
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DataTable'
 *     responses:
 *       200:
 *         description: Entry updated successfully
 *       404:
 *         description: Entry not found
 *       500:
 *         description: Server error
 */
router.patch('/:id', dataTableController.updateEntry);

/**
 * @swagger
 * /api/trainData/{id}:
 *   delete:
 *     summary: Delete training data entry by ID
 *     tags: [Training Data]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the training data entry
 *     responses:
 *       204:
 *         description: Entry deleted successfully
 *       404:
 *         description: Entry not found
 *       500:
 *         description: Server error
 */
router.delete('/:id', dataTableController.deleteEntry);

module.exports = router;
