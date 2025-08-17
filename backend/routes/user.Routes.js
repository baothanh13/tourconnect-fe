const express = require("express");
const deleteUserController = require("../api/user management/deleteUserController");
const updateUserStatus = require("../api/user management/updateUserStatusController");
const getUserProfile = require("../api/user management/getUserProfileController");
const updateUserProfile = require("../api/user management/updateUserProfileController");
const getUserById = require("../api/user management/getUserByIdController");
const router = express.Router();

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Delete a user by ID
 *     description: Permanently deletes a user from the system by their unique ID.
 *     tags: [Users]
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
 * /api/users/profile:
 *   get:
 *     summary: Get current user's profile
 *     description: Retrieve the profile information of the authenticated user.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved user profile
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
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 */
router.get("/users/profile", getUserProfile);

/**
 * @swagger
 * /api/users/profile:
 *   put:
 *     summary: Update current user's profile
 *     description: Update the profile information of the authenticated user.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
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
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.put("/users/profile", updateUserProfile);

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Get user by ID
 *     description: Retrieve user information by user ID.
 *     tags: [Users]
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