const express = require('express');
const router = express.Router();
const tempDataController = require('./TempDataController');

/**
 * @swagger
 * components:
 *   schemas:
 *     TempData:
 *       type: object
 *       required:
 *         - user
 *         - data
 *       properties:
 *         user:
 *           type: string
 *           description: User ID reference
 *         data:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               banglish:
 *                 type: string
 *                 description: Banglish content
 *               english:
 *                 type: string
 *                 description: English content
 *               bangla:
 *                 type: string
 *                 description: Bangla content
 *         status:
 *           type: string
 *           enum: [approved, pending, declined]
 *           default: pending
 *           description: Status of the temp data
 *         lastModified:
 *           type: string
 *           format: date-time
 *           description: Date when the document was last modified
 *       example:
 *         user: "63c12345678abcd123456789"
 *         data:
 *           - banglish: "Sample Banglish"
 *             english: "Sample English"
 *             bangla: "Sample Bangla"
 *         status: "pending"
 *         lastModified: "2025-01-03T10:00:00Z"

/**
 * @swagger
 * tags:
 *   name: TempData
 *   description: API endpoints for managing temporary data
 */

/**
 * @swagger
 * /tempData:
 *   get:
 *     summary: Retrieve all temporary data
 *     tags: [TempData]
 *     responses:
 *       200:
 *         description: List of all temporary data entries
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/TempData'
 *       500:
 *         description: Server error
 */
router.get('/', tempDataController.getAllTempData);

/**
 * @swagger
 * /tempData/search:
 *   get:
 *     summary: Search temporary data
 *     tags: [TempData]
 *     parameters:
 *       - in: query
 *         name: query
 *         schema:
 *           type: string
 *         description: Search query
 *     responses:
 *       200:
 *         description: List of temporary data matching the query
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/TempData'
 *       400:
 *         description: Bad request
 *       500:
 *         description: Server error
 */
router.get('/search', tempDataController.searchTempData);

/**
 * @swagger
 * /tempData/{id}:
 *   get:
 *     summary: Retrieve temporary data by ID
 *     tags: [TempData]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the temp data
 *     responses:
 *       200:
 *         description: Temporary data details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TempData'
 *       404:
 *         description: Temp data not found
 *       500:
 *         description: Server error
 */
router.get('/:id', tempDataController.getTempDataById);

/**
 * @swagger
 * /tempData:
 *   post:
 *     summary: Create new temporary data
 *     tags: [TempData]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TempData'
 *     responses:
 *       201:
 *         description: Temporary data created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TempData'
 *       400:
 *         description: Bad request
 *       500:
 *         description: Server error
 */
router.post('/', tempDataController.createTempData);

/**
 * @swagger
 * /tempData/{id}:
 *   patch:
 *     summary: Update temporary data by ID
 *     tags: [TempData]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the temp data
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TempData'
 *     responses:
 *       200:
 *         description: Temporary data updated successfully
 *       404:
 *         description: Temp data not found
 *       500:
 *         description: Server error
 */
router.patch('/:id', tempDataController.updateTempData);

/**
 * @swagger
 * /tempData/{id}:
 *   delete:
 *     summary: Delete temporary data by ID
 *     tags: [TempData]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the temp data
 *     responses:
 *       204:
 *         description: Temporary data deleted successfully
 *       404:
 *         description: Temp data not found
 *       500:
 *         description: Server error
 */
router.delete('/:id', tempDataController.deleteTempData);

module.exports = router;
