const express = require("express");
const router = express.Router();

// Import controllers
const getAllUsers = require("../api/admin/getAllUsersController");
const getAllGuides = require("../api/admin/getAllGuidesController");
const getAllBookings = require("../api/admin/getAllBookingsController");
const getSystemStats = require("../api/admin/getSystemStatsController");
const approveGuide = require("../api/admin/approveGuideController");
const deleteUserController = require("../api/admin/deleteUserController");
const updateUserProfile = require("../api/admin/updateUserProfileController");
const getUserById = require("../api/admin/getUserByIdController");

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


/**
 * @swagger
 * /api/admin/users/{id}:
 *   delete:
 *     summary: Delete a user by ID
 *     description: Permanently deletes a user from the system by their unique ID.
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The user ID to delete
 *     responses:
 *       200:
 *         description: User deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User deleted successfully
 *       400:
 *         description: Missing user ID
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.delete("/users/:id", deleteUserController);


/**
 * @swagger
 * /api/admin/users/{id}/profile:
 *   put:
 *     summary: Update user profile by ID
 *     description: Update the profile information of a specific user by their ID.
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the user to update
 *         schema:
 *           type: string
 *           example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               phone:
 *                 type: string
 *                 example: "0123456789"
 *               avatar_url:
 *                 type: string
 *                 example: "https://example.com/avatar.jpg"
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Profile updated successfully
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.put("/users/:id/profile", updateUserProfile);


/**
 * @swagger
 * /api/admin/users/{id}:
 *   get:
 *     summary: Get user by ID
 *     description: Retrieve user information by user ID.
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: Successfully retrieved user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 email:
 *                   type: string
 *                 role:
 *                   type: string
 *                 name:
 *                   type: string
 *                 phone:
 *                   type: string
 *                 avatar_url:
 *                   type: string
 *                 is_verified:
 *                   type: boolean
 *                 created_at:
 *                   type: string
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.get("/users/:id", getUserById);
module.exports = router;
