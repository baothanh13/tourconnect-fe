const express = require("express");
const router = express.Router();

// Import controllers
const getAllUsers = require("../api/admin/getAllUsersController");
const getAllGuides = require("../api/admin/getAllGuidesController");
const getAllBookings = require("../api/admin/getAllBookingsController");
const getSystemStats = require("../api/admin/getSystemStatsController");
const updateUserStatus = require("../api/admin/updateUserStatusController");
const approveGuide = require("../api/admin/approveGuideController");

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Admin management APIs
 */

/**
 * @swagger
 * /api/admin/users:
 *   get:
 *     summary: Get all users
 *     tags: [Admin]
 *     responses:
 *       200:
 *         description: List of all users
 *       500:
 *         description: Error fetching users
 */
router.get("/users", getAllUsers);

/**
 * @swagger
 * /api/admin/guides:
 *   get:
 *     summary: Get all guides
 *     tags: [Admin]
 *     responses:
 *       200:
 *         description: List of all guides
 *       500:
 *         description: Error fetching guides
 */
router.get("/guides", getAllGuides);

/**
 * @swagger
 * /api/admin/bookings:
 *   get:
 *     summary: Get all bookings
 *     tags: [Admin]
 *     responses:
 *       200:
 *         description: List of all bookings
 *       500:
 *         description: Error fetching bookings
 */
router.get("/bookings", getAllBookings);

/**
 * @swagger
 * /api/admin/stats:
 *   get:
 *     summary: Get system statistics
 *     tags: [Admin]
 *     responses:
 *       200:
 *         description: System stats including users, guides, bookings count
 *       500:
 *         description: Error fetching stats
 */
router.get("/stats", getSystemStats);

/**
 * @swagger
 * /api/admin/users/{id}/status:
 *   put:
 *     summary: Update user status (active/inactive)
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: User ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [active, inactive]
 *     responses:
 *       200:
 *         description: User status updated
 *       404:
 *         description: User not found
 *       500:
 *         description: Error updating status
 */
router.put("/users/:id/status", updateUserStatus);

/**
 * @swagger
 * /api/admin/guides/{id}/verification:
 *   put:
 *     summary: Update guide verification status
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Guide ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, verified, rejected]
 *             example:
 *               status: "verified"
 *     responses:
 *       200:
 *         description: Guide verification status updated successfully
 *       400:
 *         description: Invalid request body
 *       404:
 *         description: Guide not found
 *       500:
 *         description: Server error
 */
router.put("/guides/:id/verification", approveGuide);

module.exports = router;
