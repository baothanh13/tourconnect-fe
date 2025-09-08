const express = require("express");
const router = express.Router();

const momoCreate = require("../api/payment/momoCreate.Controller");
const momoCallback = require("../api/payment/momoCallback.Controller");
const getPaymentStatus = require("../api/payment/getPaymentStatus.Controller");
const refundPayment = require("../api/payment/refundPayment.Controller");

// Nếu cần auth/admin cho refund:
// const verifyToken = require('../middleware/verifyToken');
// const requireAdmin = (req, res, next) => (req.user?.role === 'admin' ? next() : res.status(403).json({message:'Forbidden'}));

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
 *               returnUrl: { type: string, example: "https://yoursite.com/payment/success" }
 *               notifyUrl: { type: string, example: "https://yoursite.com/api/payments/momo/callback" }
 *     responses:
 *       200:
 *         description: Created MoMo payment successfully
 */
router.post("/payments/momo/create", momoCreate);

/**
 * @swagger
 * /api/payments/momo/callback:
 *   post:
 *     summary: MoMo IPN callback (webhook)
 *     tags: [Payments]
 *     responses:
 *       204:
 *         description: Acknowledged
 */
router.post("/payments/momo/callback", momoCallback);

/**
 * @swagger
 * /api/payments/{bookingId}:
 *   get:
 *     summary: Get latest payment status for a booking
 *     tags: [Payments]
 *     parameters:
 *       - in: path
 *         name: bookingId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Return latest payment record
 *       404:
 *         description: Not found
 */
router.get("/payments/:bookingId", getPaymentStatus);

/**
 * @swagger
 * /api/payments/{bookingId}/refund:
 *   post:
 *     summary: Refund a captured payment (MoMo)
 *     tags: [Payments]
 *     # security:
 *     #   - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: bookingId
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: number
 *                 example: 200.00
 *     responses:
 *       200:
 *         description: Refund successful
 *       400:
 *         description: Refund failed
 *       404:
 *         description: No captured payment found
 */
router.post(
  "/payments/:bookingId/refund",
  /* verifyToken, requireAdmin, */ refundPayment
);

module.exports = router;
