const express = require('express');
const router = express.Router();

const login = require('../api/auth/login.Controller');
const register = require('../api/auth/register.Controller');
const logout = require('../api/auth/logout.Controller');
const { getProfile, updateProfile } = require('../api/auth/profile.Controller');
const verifyToken = require('../middleware/verifyToken');  // Import middleware
const confirmOTP = require('../api/auth/confirmOTP.Controller');
const { sendForgotPasswordOTP, resetPassword } = require('../api/auth/forgotPassword.Controller');
/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: User login
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Login successful
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                 user:
 *                   type: object
 *                   properties:
 *                     user_id:
 *                       type: string
 *                     username:
 *                       type: string
 *                     email:
 *                       type: string
 *                     role:
 *                       type: string
 */
router.post('/login', login);

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: User registration & send OTP to email
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: johndoe
 *               email:
 *                 type: string
 *                 example: john@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *               phone:
 *                 type: string
 *                 example: "0123456789"
 *               role:
 *                 type: string
 *                 enum: [tourist, guide]
 *                 example: tourist
 *     responses:
 *       201:
 *         description: Registration successful & OTP sent to email
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Registration successful, OTP has been sent to email
 *                 user_id:
 *                   type: string
 *                   example: a12b34c5-678d-90ef-ghij-klmn1234opqr
 *                 otpToken:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *       400:
 *         description: Email already exists or invalid role
 *       500:
 *         description: Server error
 */
router.post('/register', register);
/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: User logout
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Logout successful
 */
router.post('/logout', logout);

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Get user profile
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile fetched successfully
 */
router.get('/me', verifyToken, getProfile);

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Get user profile
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []   
 *     responses:
 *       200:
 *         description: User profile fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     name:
 *                       type: string
 *                     email:
 *                       type: string
 *                     role:
 *                       type: string
 */
router.put('/profile', verifyToken, updateProfile);


/**
 * @swagger
 * /api/auth/confirm-otp:
 *   post:
 *     summary: Confirm OTP from email
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               otp:
 *                 type: string
 *                 example: "123456"
 *               token:
 *                 type: string
 *                 example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *     responses:
 *       200:
 *         description: Xác thực OTP thành công
 *       401:
 *         description: OTP không chính xác
 *       400:
 *         description: Token hết hạn hoặc không hợp lệ
 *       500:
 *         description: Server Error
 */
router.post('/confirm-otp', confirmOTP);

/**
 * @swagger
 * /api/auth/forgot-password/send-otp:
 *   post:
 *     summary: Send OTP to email for password reset verification
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *     responses:
 *       200:
 *         description: OTP has been sent to your email
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 otpToken:
 *                   type: string
 *       404:
 *         description: Email not found
 *       400:
 *         description: Invalid email
 */
router.post('/forgot-password/send-otp', sendForgotPasswordOTP);

/**
 * @swagger
 * /api/auth/forgot-password/reset:
 *   post:
 *     summary: Confirm OTP and reset new password
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               otp:
 *                 type: string
 *                 example: "123456"
 *               token:
 *                 type: string
 *                 example: "jwt-token"
 *               newPassword:
 *                 type: string
 *                 example: "newpassword123"
 *     responses:
 *       200:
 *         description: Password reset successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       400:
 *         description: Missing fields or invalid token
 *       401:
 *         description: OTP is not correct
 */
router.post('/forgot-password/reset', resetPassword);
module.exports = router;
