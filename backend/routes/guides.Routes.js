const express = require("express");
const router = express.Router();

const getGuides = require("../api/guides/getGuides.Controller");
const getGuideById = require("../api/guides/getGuideById.Controller");
const createGuide = require("../api/guides/createGuide.Controller");
const updateGuide = require("../api/guides/updateGuide.Controller");
// const createGuideProfile = require("../api/guides/createGuideProfile.Controller");
const getGuideReviews = require("../api/guides/getGuideReviews.Controller");
// const createGuideProfile = require("../api/guides/createGuideProfile.Controller");
const getGuideByUserId = require("../api/guides/getGuideByUserId.Controller");
const updateCertificateImage = require("../api/guides/updateCertificateImage.Controller");
const {
  getGuideDashboardStats,
  getGuideRecentActivities,
  getGuideUpcomingBookings,
} = require("../api/guides/guideDashboard.Controller");
const verifyToken = require("../middleware/verifyToken"); // Import middleware

/**
 * @swagger
 * /api/guides:
 *   get:
 *     summary: Get list of guides with filter query
 *     tags: [Guides]
 *     parameters:
 *       - in: query
 *         name: location
 *         schema:
 *           type: string
 *         description: Filter by location (partial match)
 *       - in: query
 *         name: languages
 *         schema:
 *           type: string
 *         description: Filter by languages (comma-separated, e.g. "English,French")
 *       - in: query
 *         name: specialties
 *         schema:
 *           type: string
 *         description: Filter by specialties (comma-separated, e.g. "Hiking,Cooking")
 *       - in: query
 *         name: minRating
 *         schema:
 *           type: number
 *         description: Minimum rating
 *       - in: query
 *         name: priceRange
 *         schema:
 *           type: string
 *         description: Price range (e.g. "10-50")
 *       - in: query
 *         name: available
 *         schema:
 *           type: boolean
 *         description: Availability status
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Items per page
 *     responses:
 *       200:
 *         description: List of guides
 */
router.get("/", getGuides);
/**
 * @swagger
 * /api/guides/{guideId}:
 *   get:
 *     summary: Get guide by ID
 *     description: Lấy thông tin chi tiết của 1 guide bằng guideId
 *     tags: [Guides]
 *     parameters:
 *       - in: path
 *         name: guideId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của guide
 *     responses:
 *       200:
 *         description: Guide found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: "123"
 *                 guide_id:
 *                   type: string
 *                   example: "123"
 *                 name:
 *                   type: string
 *                   example: "Nguyen Van A"
 *                 email:
 *                   type: string
 *                   example: "guide@example.com"
 *                 phone:
 *                   type: string
 *                   example: "0901234567"
 *       404:
 *         description: Guide not found
 *       500:
 *         description: Server error
 */

router.get("/:id", getGuideById);

/**
 * @swagger
 * /api/guides:
 *   post:
 *     summary: Create a new guide profile
 *     description: Tạo mới guide profile. Người dùng phải đăng nhập và gửi kèm JWT token. user_id sẽ được lấy từ token, không cần nhập thủ công.
 *     tags: [Guides]
 *     security:
 *       - bearerAuth: []   # 🔑 Bảo mật bằng JWT
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               location:
 *                 type: string
 *                 example: "Hanoi"
 *               languages:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["English", "Vietnamese"]
 *               specialties:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["History", "Food tours"]
 *               price_per_hour:
 *                 type: number
 *                 example: 20
 *               experience_years:
 *                 type: integer
 *                 example: 5
 *               description:
 *                 type: string
 *                 example: "Experienced tour guide with deep knowledge of Hanoi history."
 *               certificates:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["Tourism Certificate A", "Language Certificate B"]
 *     responses:
 *       201:
 *         description: Guide profile created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Guide profile created successfully"
 *                 guide_id:
 *                   type: string
 *                   example: "guide_123abc"
 *                 user_id:
 *                   type: string
 *                   example: "user_456xyz"
 *       401:
 *         description: Unauthorized (Missing or invalid token)
 *       500:
 *         description: Server error
 */
router.post("/", verifyToken, createGuide);

// router.post("/profile", createGuideProfile);

// PUT /api/guides/:id - Cập nhật guide profile
/**
 * @swagger
 * /api/guides/{id}:
 *   put:
 *     summary: Update guide profile by ID
 *     tags: [Guides]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Guide ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               location:
 *                 type: string
 *               languages:
 *                 type: array
 *                 items:
 *                   type: string
 *               specialties:
 *                 type: array
 *                 items:
 *                   type: string
 *               price_per_hour:
 *                 type: number
 *               experience_years:
 *                 type: number
 *               description:
 *                 type: string
 *               certificates:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Guide profile updated successfully
 *       404:
 *         description: Guide not found
 */
router.put("/:id", updateGuide);

// PUT /api/guides/profile/:id - Update guide profile (alternative endpoint)
/**
 * @swagger
 * /api/guides/profile/{id}:
 *   put:
 *     summary: Update guide profile (alternative endpoint)
 *     tags: [Guides]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Guide ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               location:
 *                 type: string
 *               languages:
 *                 type: array
 *                 items:
 *                   type: string
 *               specialties:
 *                 type: array
 *                 items:
 *                   type: string
 *               price_per_hour:
 *                 type: number
 *               experience_years:
 *                 type: integer
 *               description:
 *                 type: string
 *               certificates:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Guide profile updated successfully
 *       404:
 *         description: Guide not found
 */
router.put("/profile/:id", updateGuide);

// GET /api/guides/user/:userId - Get guide profile by user ID
/**
 * @swagger
 * /api/guides/user/{userId}:
 *   get:
 *     summary: Get guide profile by user ID
 *     tags: [Guides]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: Guide profile found
 *       404:
 *         description: Guide not found
 */
router.get("/user/:userId", getGuideByUserId);

/**
 * @swagger
 * /api/guides/reviews/{guideId}:
 *   get:
 *     summary: Get reviews of a guide
 *     tags: [Guides]
 *     parameters:
 *       - in: path
 *         name: guideId
 *         required: true
 *         schema:
 *           type: string
 *         description: Guide ID
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           example: 20
 *     responses:
 *       200:
 *         description: List of guide reviews
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 reviews:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id: { type: string, example: "rev_123" }
 *                       rating: { type: number, format: float, example: 4.5 }
 *                       comment: { type: string, example: "Great tour!" }
 *                       created_at: { type: string, format: date-time }
 *                       booking_id: { type: string }
 *                       tour_id: { type: string }
 *                       tour_title: { type: string, example: "Old Quarter Walking Tour" }
 *                       tourist_id: { type: string }
 *                       tourist_name: { type: string, example: "Tran Minh" }
 *                       tourist_avatar: { type: string, example: "https://..." }
 *                 total: { type: integer, example: 156 }
 *                 page: { type: integer, example: 1 }
 *                 limit: { type: integer, example: 20 }
 */
router.get("/reviews/:guideId", getGuideReviews);

// Guide Dashboard Routes

/**
 * @swagger
 * /api/guides/dashboard/{userId}/stats:
 *   get:
 *     summary: Get guide dashboard statistics
 *     tags: [Guides]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID of the guide
 *     responses:
 *       200:
 *         description: Dashboard statistics retrieved successfully
 *       404:
 *         description: Guide not found
 */
router.get("/dashboard/:user_id/stats", getGuideDashboardStats);

/**
 * @swagger
 * /api/guides/dashboard/{userId}/activities:
 *   get:
 *     summary: Get guide recent activities
 *     tags: [Guides]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID of the guide
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 5
 *         description: Number of activities to return
 *     responses:
 *       200:
 *         description: Recent activities retrieved successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Guide not found
 */
router.get("/dashboard/:user_id/activities", getGuideRecentActivities);

/**
 * @swagger
 * /api/guides/dashboard/{userId}/bookings:
 *   get:
 *     summary: Get guide upcoming bookings
 *     tags: [Guides]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID of the guide
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 5
 *         description: Number of bookings to return
 *     responses:
 *       200:
 *         description: Upcoming bookings retrieved successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Guide not found
 */
router.get("/dashboard/:user_id/bookings", getGuideUpcomingBookings);

// PUT /api/guides/certificate/:userId - Update certificate image by user ID
/**
 * @swagger
 * /api/guides/certificate/{userId}:
 *   put:
 *     summary: Update certificate image by user ID
 *     description: Cập nhật ảnh chứng chỉ của guide theo user ID
 *     tags: [Guides]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID của guide
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               certificate_img:
 *                 type: string
 *                 format: uri
 *                 example: "https://example.com/certificate.jpg"
 *                 description: URL của ảnh chứng chỉ
 *     responses:
 *       200:
 *         description: Certificate image updated successfully
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
 *                   example: "Certificate image updated successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     userId:
 *                       type: string
 *                     certificate_img:
 *                       type: string
 *       404:
 *         description: Guide not found
 *       500:
 *         description: Server error
 */
router.put("/certificate/:userId", updateCertificateImage);

module.exports = router;
