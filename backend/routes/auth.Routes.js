const express = require("express");
const router = express.Router();

const login = require("../api/auth/login.Controller");
const register = require("../api/auth/register.Controller");
const logout = require("../api/auth/logout.Controller");
const verifyToken = require("../middleware/verifyToken"); // Import middleware
const confirmOTP = require("../api/auth/confirmOTP.Controller");
const {
  sendForgotPasswordOTP,
  resetPassword,
} = require("../api/auth/forgotPassword.Controller");

// Simple test endpoint first
router.get("/test", (req, res) => {
  console.log("Auth test endpoint hit!");
  res.json({ message: "Auth routes are working!" });
});

// Create a simple avatar update function directly here for testing
const simpleAvatarUpdate = async (req, res) => {
  console.log("Simple avatar update called with params:", req.params);
  console.log("Simple avatar update called with body:", req.body);

  try {
    const { userId } = req.params;
    const { avatar_url } = req.body;

    if (!avatar_url) {
      return res.status(400).json({
        success: false,
        message: "Avatar URL is required",
      });
    }

    // For now, just return success without database update
    res.json({
      success: true,
      message: "Avatar test successful",
      data: { userId, avatar_url },
    });
  } catch (error) {
    console.error("Error in simple avatar update:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

router.put("/users/:userId/avatar-test", simpleAvatarUpdate);
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
router.post("/login", login);

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
router.post("/register", register);
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
router.post("/logout", logout);

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
router.post("/confirm-otp", confirmOTP);

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
router.post("/forgot-password/send-otp", sendForgotPasswordOTP);

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
router.post("/forgot-password/reset", resetPassword);

/**
 * @swagger
 * /api/auth/users/{userId}/avatar:
 *   put:
 *     summary: Update user avatar/profile photo
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               avatar_url:
 *                 type: string
 *                 example: "https://example.com/avatar.jpg"
 *             required:
 *               - avatar_url
 *     responses:
 *       200:
 *         description: Avatar updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Avatar updated successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                         name:
 *                           type: string
 *                         email:
 *                           type: string
 *                         phone:
 *                           type: string
 *                         avatar_url:
 *                           type: string
 *                         role:
 *                           type: string
 *       400:
 *         description: Avatar URL is required or failed to update
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */

module.exports = router;
