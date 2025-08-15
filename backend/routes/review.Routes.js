const express = require('express');
const router = express.Router();

const getGuideReviews = require('../api/reviews/getGuideReviews.Controller');
const getTouristReviews = require('../api/reviews/getTouristReviews.Controller');
const updateReview = require('../api/reviews/updateReview.Controller');
const deleteReview = require('../api/reviews/deleteReview.Controller');
// Nếu bạn có middleware xác thực JWT thì import thêm:
// const verifyToken = require('../middleware/verifyToken');

/**
 * @swagger
 * tags:
 *   - name: Reviews
 *     description: APIs for guide & tourist reviews
 */

/**
 * @swagger
 * /api/reviews/guide/{guideId}:
 *   get:
 *     summary: Get reviews of a guide
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: guideId
 *         required: true
 *         schema:
 *           type: string
 *         description: Guide ID
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           example: 20
 *     responses:
 *       200:
 *         description: List of guide reviews
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 reviews:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id: { type: string, example: "rev_123" }
 *                       rating: { type: number, format: float, example: 4.5 }
 *                       comment: { type: string, example: "Great tour!" }
 *                       created_at: { type: string, format: date-time }
 *                       booking_id: { type: string }
 *                       tour_id: { type: string }
 *                       tour_title: { type: string, example: "Old Quarter Walking Tour" }
 *                       tourist_id: { type: string }
 *                       tourist_name: { type: string, example: "Tran Minh" }
 *                       tourist_avatar: { type: string, example: "https://..." }
 *                 total: { type: integer, example: 156 }
 *                 page: { type: integer, example: 1 }
 *                 limit: { type: integer, example: 20 }
 */
router.get('/reviews/guide/:guideId', getGuideReviews);

/**
 * @swagger
 * /api/reviews/tourist/{touristId}:
 *   get:
 *     summary: Get reviews related to a tourist (written by that tourist)
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: touristId
 *         required: true
 *         schema:
 *           type: string
 *         description: Tourist (user) ID
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           example: 20
 *     responses:
 *       200:
 *         description: List of tourist reviews
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 reviews:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id: { type: string, example: "rev_987" }
 *                       rating: { type: number, format: float, example: 5 }
 *                       comment: { type: string, example: "Amazing experience!" }
 *                       created_at: { type: string, format: date-time }
 *                       booking_id: { type: string }
 *                       tour_id: { type: string }
 *                       tour_title: { type: string, example: "Street Food Night Tour" }
 *                       guide_id: { type: string }
 *                       guide_name: { type: string, example: "Nguyen Van A" }
 *                       guide_avatar: { type: string, example: "https://..." }
 *                 total: { type: integer, example: 42 }
 *                 page: { type: integer, example: 1 }
 *                 limit: { type: integer, example: 20 }
 */
router.get('/reviews/tourist/:touristId', getTouristReviews);

/**
 * @swagger
 * /api/reviews/{id}:
 *   put:
 *     summary: Update a review (rating/comment)
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Review ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rating:
 *                 type: number
 *                 example: 4.5
 *               comment:
 *                 type: string
 *                 example: "Updated comment after support follow-up."
 *     responses:
 *       200:
 *         description: Review updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Review updated successfully
 *       400:
 *         description: Validation error (e.g., rating out of range)
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Review not found
 */
// Nếu có auth thì dùng: router.put('/reviews/:id', verifyToken, updateReview);
router.put('/reviews/:id', updateReview);

/**
 * @swagger
 * /api/reviews/{id}:
 *   delete:
 *     summary: Delete a review
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Review ID
 *     responses:
 *       200:
 *         description: Review deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Review deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Review not found
 */
// Nếu có auth thì dùng: router.delete('/reviews/:id', verifyToken, deleteReview);
router.delete('/reviews/:id', deleteReview);

module.exports = router;
