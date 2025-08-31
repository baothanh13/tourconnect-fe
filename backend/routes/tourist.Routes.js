const express = require("express");
const router = express.Router();

const getTouristStats = require("../api/tourist/getTouristStats.Controller");
const getFavoriteGuides = require("../api/tourist/getFavoriteGuides.Controller");
const getUpcomingTours = require("../api/tourist/getUpcomingTours.Controller");
const getRecentActivities = require("../api/tourist/getRecentActivities.Controller");
const getWishlist = require("../api/tourist/getWishlist.Controller");
const addToWishlist = require("../api/tourist/addToWishlist.Controller");
const removeFromWishlist = require("../api/tourist/removeFromWishlist.Controller");

const verifyToken = require("../middleware/verifyToken");

/**
 * @swagger
 * tags:
 *   - name: Tourist
 *     description: Tourist dashboard and profile APIs
 */

/**
 * @swagger
 * /api/tourist/stats/{touristId}:
 *   get:
 *     summary: Get tourist dashboard statistics
 *     tags: [Tourist]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: touristId
 *         required: true
 *         schema:
 *           type: string
 *         description: Tourist ID
 *     responses:
 *       200:
 *         description: Tourist statistics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalBookings: { type: number }
 *                 completedTours: { type: number }
 *                 upcomingTours: { type: number }
 *                 totalSpent: { type: number }
 *                 favoriteGuides: { type: number }
 *                 savedWishlist: { type: number }
 *                 averageRating: { type: number }
 *                 totalReviews: { type: number }
 *                 membershipsLevel: { type: string }
 *                 rewardPoints: { type: number }
 *                 monthlySpent: { type: number }
 *                 growthPercentage: { type: number }
 */
router.get("/stats/:touristId", verifyToken, getTouristStats);

/**
 * @swagger
 * /api/tourist/favorite-guides/{touristId}:
 *   get:
 *     summary: Get tourist's favorite guides
 *     tags: [Tourist]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: touristId
 *         required: true
 *         schema:
 *           type: string
 *         description: Tourist ID
 *     responses:
 *       200:
 *         description: List of favorite guides
 */
//router.get("/favorite-guides/:touristId", verifyToken, getFavoriteGuides);

/**
 * @swagger
 * /api/tourist/upcoming-tours/{touristId}:
 *   get:
 *     summary: Get tourist's upcoming tours
 *     tags: [Tourist]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: touristId
 *         required: true
 *         schema:
 *           type: string
 *         description: Tourist ID
 *     responses:
 *       200:
 *         description: List of upcoming tours
 */
//router.get("/upcoming-tours/:touristId", verifyToken, getUpcomingTours);

/**
 * @swagger
 * /api/tourist/recent-activities/{touristId}:
 *   get:
 *     summary: Get tourist's recent activities
 *     tags: [Tourist]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: touristId
 *         required: true
 *         schema:
 *           type: string
 *         description: Tourist ID
 *     responses:
 *       200:
 *         description: List of recent activities
 */
//router.get("/recent-activities/:touristId", verifyToken, getRecentActivities);

/**
 * @swagger
 * /api/tourist/wishlist/{touristId}:
 *   get:
 *     summary: Get tourist's wishlist
 *     tags: [Tourist]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: touristId
 *         required: true
 *         schema:
 *           type: string
 *         description: Tourist ID
 *     responses:
 *       200:
 *         description: Tourist's wishlist
 */
//router.get("/wishlist/:touristId", verifyToken, getWishlist);

/**
 * @swagger
 * /api/tourist/wishlist:
 *   post:
 *     summary: Add tour to wishlist
 *     tags: [Tourist]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               touristId: { type: string }
 *               tourId: { type: string }
 *     responses:
 *       201:
 *         description: Tour added to wishlist
 */
//router.post("/wishlist", verifyToken, addToWishlist);

/**
 * @swagger
 * /api/tourist/wishlist:
 *   delete:
 *     summary: Remove tour from wishlist
 *     tags: [Tourist]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               touristId: { type: string }
 *               tourId: { type: string }
 *     responses:
 *       200:
 *         description: Tour removed from wishlist
 */
//router.delete("/wishlist", verifyToken, removeFromWishlist);

module.exports = router;
