const express = require('express');
const router = express.Router();
const createBooking = require('../api/bookings/createBooking.Controller');
const verifyToken = require('../middleware/verifyToken');

/**
 * @swagger
 * /api/bookings:
 *   post:
 *     summary: Create a new booking
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               guide_id:
 *                 type: integer
 *                 example: 2
 *               tour_id:
 *                 type: integer
 *                 example: 5
 *               booking_date:
 *                 type: string
 *                 format: date-time
 *                 example: 2025-08-06T10:00:00Z
 *               total_amount:
 *                 type: number
 *                 example: 100.50
 *     responses:
 *       201:
 *         description: Booking created successfully
 */
router.post('/bookings', verifyToken, createBooking);

module.exports = router;
