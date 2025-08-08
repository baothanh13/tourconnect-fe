const express = require('express');
const router = express.Router();

const getGuides = require('../api/guides/getGuides.Controller');
const getGuideById = require('../api/guides/getGuideById.Controller');
const createGuide = require('../api/guides/createGuide.Controller');
const updateGuide = require('../api/guides/updateGuide.Controller');

// GET /api/guides - Danh sách guides với filter query
/**
 * @swagger
 * /api/guides:
 *   get:
 *     summary: Get list of guides with filter query
 *     tags: [Guides]
 *     parameters:
 *       - in: query
 *         name: location
 *         schema:
 *           type: string
 *         description: Filter by location
 *       - in: query
 *         name: language
 *         schema:
 *           type: string
 *         description: Filter by language
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by specialty category
 *       - in: query
 *         name: minRating
 *         schema:
 *           type: number
 *         description: Minimum rating
 *       - in: query
 *         name: priceRange
 *         schema:
 *           type: string
 *         description: Price range (e.g. "10-50")
 *       - in: query
 *         name: available
 *         schema:
 *           type: boolean
 *         description: Availability status
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Items per page
 *     responses:
 *       200:
 *         description: List of guides
 */
router.get('/', getGuides);

// GET /api/guides/:id - Chi tiết 1 guide
/**
 * @swagger
 * /api/guides/{id}:
 *   get:
 *     summary: Get guide profile by ID
 *     tags: [Guides]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Guide ID
 *     responses:
 *       200:
 *         description: Guide profile found
 *       404:
 *         description: Guide not found
 */

router.get('/:id', getGuideById);

// POST /api/guides - Tạo guide profile
/**
 * @swagger
 * /api/guides:
 *   post:
 *     summary: Create a new guide profile
 *     tags: [Guides]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_id:
 *                 type: string
 *               location:
 *                 type: string
 *               languages:
 *                 type: array
 *                 items:
 *                   type: string
 *               specialties:
 *                 type: array
 *                 items:
 *                   type: string
 *               price_per_hour:
 *                 type: number
 *               experience_years:
 *                 type: number
 *               description:
 *                 type: string
 *               certificates:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: Guide profile created successfully
 */
router.post('/', createGuide);

// PUT /api/guides/:id - Cập nhật guide profile
/**
 * @swagger
 * /api/guides/{id}:
 *   put:
 *     summary: Update guide profile by ID
 *     tags: [Guides]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Guide ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               location:
 *                 type: string
 *               languages:
 *                 type: array
 *                 items:
 *                   type: string
 *               specialties:
 *                 type: array
 *                 items:
 *                   type: string
 *               price_per_hour:
 *                 type: number
 *               experience_years:
 *                 type: number
 *               description:
 *                 type: string
 *               certificates:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Guide profile updated successfully
 *       404:
 *         description: Guide not found
 */
router.put('/:id', updateGuide);

module.exports = router;