const express = require("express");
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');  // Import middleware
const createTicket = require("../api/supportTickets/createTicketController");
const getAllTickets = require("../api/supportTickets/getAllTicketsController");
const getTicketById = require("../api/supportTickets/getTicketByIdController");
const updateTicket = require("../api/supportTickets/updateTicketController");
const deleteTicket = require("../api/supportTickets/deleteTicketController");
const getSupportStats = require("../api/supportTickets/getSupportStatsController");


/**
 * @swagger
 * /api/supportTickets:
 *   post:
 *     summary: Create a new support ticket
 *     description: Allows an authenticated user or guide to create a support ticket.
 *     tags: [Support Tickets]
 *     security:
 *       - bearerAuth: []   # cần JWT token để xác thực
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - subject
 *               - message
 *               - support_type
 *             properties:
 *               subject:
 *                 type: string
 *                 example: "Issue with booking"
 *               message:
 *                 type: string
 *                 example: "I cannot confirm my booking properly."
 *               support_type:
 *                 type: string
 *                 enum: [user, guide]
 *                 example: "user"
 *               email:
 *                 type: string
 *                 example: "user@gmail.com"
 *               phone:
 *                 type: string
 *                 example: "+84987654321"
 *     responses:
 *       201:
 *         description: Support ticket created successfully
 *       400:
 *         description: Missing required fields
 *       401:
 *         description: Unauthorized (no or invalid token)
 *       500:
 *         description: Internal server error
 */
router.post("/", verifyToken, createTicket);


/**
 * @swagger
 * /api/supportTickets:
 *   get:
 *     summary: Get all support tickets
 *     description: Fetch all support tickets from the database (Admin only).
 *     tags: [Support Tickets]
 *     responses:
 *       200:
 *         description: List of all support tickets
 *       500:
 *         description: Internal server error
 */
router.get("/", getAllTickets);


/**
 * @swagger
 * /api/supportTickets/stats:
 *   get:
 *     summary: Get support tickets and users statistics
 *     description: Retrieve aggregated statistics including open tickets, resolved tickets, total users, and total guides.
 *     tags:
 *       - Support
 *     responses:
 *       200:
 *         description: Statistics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 open_tickets:
 *                   type: integer
 *                   example: 5
 *                 resolved_tickets:
 *                   type: integer
 *                   example: 12
 *                 total_users:
 *                   type: integer
 *                   example: 100
 *                 total_guides:
 *                   type: integer
 *                   example: 25
 *       500:
 *         description: Server error
 */
router.get("/stats", getSupportStats);

/**
 * @swagger
 * /api/supportTickets/{id}:
 *   get:
 *     summary: Get a support ticket by ID
 *     description: Fetch details of a specific support ticket using its ID.
 *     tags: [Support Tickets]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The support ticket ID
 *     responses:
 *       200:
 *         description: Support ticket details
 *       404:
 *         description: Ticket not found
 *       500:
 *         description: Internal server error
 */
router.get("/:id", getTicketById);

/**
 * @swagger
 * /api/supportTickets/{id}:
 *   put:
 *     summary: Update a support ticket
 *     description: Allows staff to update the status, response, or assigned staff of a support ticket.
 *     tags: [Support Tickets]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The support ticket ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [open, in_progress, resolved, closed]
 *                 example: "resolved"
 *               response:
 *                 type: string
 *                 example: "We have resolved your booking issue."
 *               assigned_staff:
 *                 type: string
 *                 example: "staff_001"
 *     responses:
 *       200:
 *         description: Support ticket updated successfully
 *       404:
 *         description: Ticket not found
 *       500:
 *         description: Internal server error
 */
router.put("/:id", updateTicket);


/**
 * @swagger
 * /api/supportTickets/{id}:
 *   delete:
 *     summary: Delete a support ticket
 *     description: Allows staff to delete a specific support ticket.
 *     tags: [Support Tickets]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The support ticket ID
 *     responses:
 *       200:
 *         description: Support ticket deleted successfully
 *       404:
 *         description: Ticket not found
 *       500:
 *         description: Internal server error
 */
router.delete("/:id", deleteTicket);

module.exports = router;
