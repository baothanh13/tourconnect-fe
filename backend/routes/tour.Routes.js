const express = require("express");
const router = express.Router();
const getTours = require("../api/tours/getTours.Controller");
const createTour = require("../api/tours/createTour.Controller");
const getTourById = require("../api/tours/getTourById.Controller");
const updateTour = require("../api/tours/updateTour.Controller");
const deleteTour = require("../api/tours/deleteTour.Controller");
const getToursByGuide = require("../api/tours/getToursByGuide.Controller");
const getToursByWeek = require("../api/tours/getToursByWeek.Controller");

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
 * /api/tours/week:
 *   get:
 *     summary: Get weekly tours of a specific guide
 *     description: Retrieve all tours of a guide in a given week based on the provided date (Monday to Sunday).
 *     tags: [Tours]
 *     parameters:
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *           format: date
 *         required: true
 *         description: Any date within the week (YYYY-MM-DD). The API will automatically calculate Monday to Sunday of that week.
 *       - in: query
 *         name: guide_id
 *         schema:
 *           type: string
 *         required: true
 *         description: The unique Guide ID (e.g., G123). Required to filter tours of that guide.
 *     responses:
 *       200:
 *         description: List of tours within the selected week for the specified guide
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 week:
 *                   type: object
 *                   properties:
 *                     start:
 *                       type: string
 *                       example: "2025-09-01"
 *                     end:
 *                       type: string
 *                       example: "2025-09-07"
 *                 guide_id:
 *                   type: string
 *                   example: "G123"
 *                 tours:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: "T001"
 *                       title:
 *                         type: string
 *                         example: "Discover Hanoi Old Quarter"
 *                       description:
 *                         type: string
 *                         example: "A walking tour through Hanoi's Old Quarter with local street food tasting"
 *                       category:
 *                         type: string
 *                         example: "city"
 *                       tour_date:
 *                         type: string
 *                         format: date
 *                         example: "2025-09-03"
 *                       tour_time:
 *                         type: string
 *                         format: time
 *                         example: "08:00:00"
 *       400:
 *         description: Missing or invalid date or guide_id
 *       404:
 *         description: No tours found in the selected week
 *       500:
 *         description: Server error
 */
router.get("/week", getToursByWeek);


/**
 * @swagger
 * /api/tours:
 *   post:
 *     summary: Create a new tour
 *     tags: [Tours]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [guide_id, title, price]
 *             properties:
 *               guide_id: { type: string, example: "guide-uuid" }
 *               title: { type: string, example: "Hanoi Old Quarter Walking Tour" }
 *               description: { type: string, example: "Explore historical streets..." }
 *               duration_hours: { type: integer, example: 3 }
 *               max_people: { type: integer, example: 10 }
 *               price: { type: number, example: 25.00 }
 *               image_url: { type: string, example: "https://example.com/tour.jpg" }
 *               category: { type: string, example: "cultural" }
 *     responses:
 *       201:
 *         description: Tour created
 *       400:
 *         description: Validation error
 */
router.post("/", /* verifyToken, requireGuideOrAdmin, */ createTour);

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
 *               guide_id: { type: string, example: "guide-uuid" }
 *               title: { type: string, example: "Hanoi Old Quarter Walking Tour" }
 *               description: { type: string, example: "Explore historical streets..." }
 *               duration_hours: { type: integer, example: 3 }
 *               max_people: { type: integer, example: 10 }
 *               price: { type: number, example: 25.00 }
 *               image_url: { type: string, example: "https://example.com/tour.jpg" }
 *               category: { type: string, example: "cultural" }
 *               tour_date: { type: string, format: date, example: "2024-12-31" }
 *               tour_time: { type: string, format: time, example: "09:00:00" }
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
