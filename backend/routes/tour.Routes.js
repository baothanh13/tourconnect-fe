const express = require("express");
const router = express.Router();
const getTours = require("../api/tours/getTours.Controller");
const getTourById = require("../api/tours/getTourById.Controller");
const updateTour = require("../api/tours/updateTour.Controller");
const deleteTour = require("../api/tours/deleteTour.Controller");
const getToursByGuide = require("../api/tours/getToursByGuide.Controller");

// Nếu có auth/role guard thì bật:
// const verifyToken = require('../middleware/verifyToken');
// const requireGuideOrAdmin = (req, res, next) => (['guide','admin'].includes(req.user?.role) ? next() : res.status(403).json({message:'Forbidden'}));

/**
 * @swagger
 * tags:
 *   - name: Tours
 *     description: Tour Management APIs
 */

/**
 * @swagger
 * /api/tours:
 *   get:
 *     summary: Get all tours (with filters & pagination)
 *     tags: [Tours]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, example: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, example: 20 }
 *       - in: query
 *         name: category
 *         schema: { type: string, example: "food" }
 *       - in: query
 *         name: minPrice
 *         schema: { type: number, example: 10 }
 *       - in: query
 *         name: maxPrice
 *         schema: { type: number, example: 200 }
 *     responses:
 *       200:
 *         description: OK
 */
router.get("/", getTours);

/**
 * @swagger
 * /api/tours/guide/{guideId}:
 *   get:
 *     summary: Get tours by guide
 *     tags: [Tours]
 *     parameters:
 *       - in: path
 *         name: guideId
 *         required: true
 *         schema: { type: string }
 *       - in: query
 *         name: page
 *         schema: { type: integer, example: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, example: 20 }
 *     responses:
 *       200:
 *         description: OK
 */
router.get("/guide/:guideId", getToursByGuide);

/**
 * @swagger
 * /api/tours/{id}:
 *   get:
 *     summary: Get a specific tour by ID
 *     tags: [Tours]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: OK
 *       404:
 *         description: Tour not found
 */
router.get("/:id", getTourById);


/**
 * @swagger
 * /api/tours/{id}:
 *   put:
 *     summary: Update a tour
 *     tags: [Tours]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               guide_id: { type: string }
 *               title: { type: string }
 *               description: { type: string }
 *               duration_hours: { type: integer }
 *               max_people: { type: integer }
 *               price: { type: number }
 *               image_url: { type: string }
 *               category: { type: string }
 *     responses:
 *       200:
 *         description: Tour updated
 *       404:
 *         description: Tour not found
 */
router.put("/:id", /* verifyToken, requireGuideOrAdmin, */ updateTour);

/**
 * @swagger
 * /api/tours/{id}:
 *   delete:
 *     summary: Delete a tour
 *     tags: [Tours]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Tour deleted
 *       404:
 *         description: Tour not found
 *       409:
 *         description: FK constraint prevents deletion
 */
router.delete("/:id", /* verifyToken, requireGuideOrAdmin, */ deleteTour);

module.exports = router;
