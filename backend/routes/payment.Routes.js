const express = require("express");
const router = express.Router();

const momoCreate = require("../api/payment/momoCreate.Controller.js");
const momoCallback = require("../api/payment/momoCallback.Controller.js");
const getPaymentStatus = require("../api/payment/getPaymentStatus.Controller.js");

/**
 * @swagger
 * tags:
 *   - name: Payments
 *     description: Payment Integration (MoMo)
 */

/**
 * @swagger
 * /api/payments/momo/create:
 *   post:
 *     summary: Create MoMo payment (get payUrl)
 *     tags: [Payments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               bookingId: { type: string, example: "44af3e43-53f9-443e-b1f0-54ef0d5bc4b7" }
 *               amount:    { type: number, example: 200.00 }
 *               currency:  { type: string, example: "VND" }
 *     responses:
 *       200:
 *         description: Created MoMo payment successfully
 *       400:
 *         description: MoMo create payment failed
 */
router.post("/payments/momo/create", momoCreate);

/**
 * @swagger
 * /api/payments/momo/callback:
 *   post:
 *     summary: MoMo IPN callback (webhook)
 *     tags: [Payments]
 *     responses:
 *       200:
 *         description: Acknowledged callback
 */
router.post("/payments/momo/callback", momoCallback);

/**
 * @swagger
 * /api/payments/status/{bookingId}:
 *   get:
 *     summary: Get booking payment status
 *     tags: [Payments]
 *     parameters:
 *       - in: path
 *         name: bookingId
 *         required: true
 *         schema: { type: string }
 *         example: "44af3e43-53f9-443e-b1f0-54ef0d5bc4b7"
 *     responses:
 *       200:
 *         description: Return booking with payment_status
 *       404:
 *         description: Booking not found
 */
router.get("/payments/status/:bookingId", getPaymentStatus);

module.exports = router;
