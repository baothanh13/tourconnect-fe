const express = require("express");
const router = express.Router();

const getTouristStats = require("../api/tourist/getTouristStats.Controller");
const {
  getTouristUpcomingTours,
} = require("../api/tourist/getUpcomingTours.Controller");
const {
  getTouristRecentActivities,
} = require("../api/tourist/getTouristRecentActivities.Controller");

const verifyToken = require("../middleware/verifyToken");

/**
 * @swagger
 * tags:
 *   - name: Tourist
 *     description: Tourist dashboard and profile APIs
 */

/**
 * @swagger
 * /api/tourist/stats/{touristId}:
 *   get:
 *     summary: Get tourist dashboard statistics
 *     tags: [Tourist]
 *     security:
 *       - bearerAuth: []   # Yêu cầu JWT token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - guideId
 *             properties:
 *               guideId:
 *                 type: string
 *                 example: 12
 *     responses:
 *       201:
 *         description: Guide được thêm thành công vào danh sách yêu thích
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Guide added to favourites
 *       400:
 *         description: Guide đã tồn tại trong danh sách yêu thích
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Guide already in favourites
 *       401:
 *         description: Unauthorized (thiếu hoặc token sai)
 *       500:
 *         description: Lỗi server
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Server error
 */
//router.post("/guides", verifyToken, addFavGuidesController);

/**
 * @swagger
 * /api/tourist/guides:
 *   get:
 *     summary: Lấy danh sách guides yêu thích của tourist
 *     description: Trả về danh sách các guides mà tourist đã thêm vào favourites.
 *     tags: [Tourist]
 *     security:
 *       - bearerAuth: []   # yêu cầu JWT token
 *     responses:
 *       200:
 *         description: Danh sách guides yêu thích
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 favouriteGuides:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: 5
 *                       user_name:
 *                         type: string
 *                         example: Nguyen Van A
 *                       user_email:
 *                         type: string
 *                         example: guide@example.com
 *                       phone:
 *                         type: string
 *                         example: "+84 987654321"
 *                       location:
 *                         type: string
 *                         example: Ha Noi
 *                       languages:
 *                         type: string
 *                         example: "English, Vietnamese"
 *                       specialties:
 *                         type: string
 *                         example: "Cultural tours, Food tours"
 *                       price_per_hour:
 *                         type: number
 *                         example: 25.5
 *                       experience_years:
 *                         type: integer
 *                         example: 4
 *                       description:
 *                         type: string
 *                         example: "Experienced tour guide with a passion for culture."
 *                       certificates:
 *                         type: string
 *                         example: "Tourism License, First Aid"
 *                       rating:
 *                         type: number
 *                         example: 4.8
 *                       total_reviews:
 *                         type: integer
 *                         example: 35
 *                       is_available:
 *                         type: boolean
 *                         example: true
 *                       current_location:
 *                         type: string
 *                         example: "Ho Chi Minh City"
 *                       added_at:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-08-29T09:30:00Z"
 *       401:
 *         description: Unauthorized (thiếu hoặc token sai)
 *       500:
 *         description: Lỗi server
 */
//router.get("/guides", verifyToken, getFavGuidesController);

/**
 * @swagger
 * /api/tourist/guides:
 *   delete:
 *     summary: Xóa guide khỏi danh sách yêu thích
 *     description: Cho phép tourist bỏ một guide ra khỏi favourites của mình.
 *     tags: [Tourist]
 *     security:
 *       - bearerAuth: []   # yêu cầu JWT token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - guideId
 *             properties:
 *               guideId:
 *                 type: string
 *                 example: 12
 *     responses:
 *       200:
 *         description: List of upcoming tours
 */
router.get("/upcoming-tours/:touristId", verifyToken, getTouristUpcomingTours);

/**
 * @swagger
 * /api/tourist/wishlist:
 *   get:
 *     summary: Lấy danh sách tours trong wishlist
 *     description: Trả về danh sách các tours mà tourist đã thêm vào wishlist của mình.
 *     tags: [Tourist]
 *     security:
 *       - bearerAuth: []   # yêu cầu JWT token
 *     responses:
 *       200:
 *         description: List of recent activities
 */
router.get(
  "/recent-activities/:touristId",
  verifyToken,
  getTouristRecentActivities
);

/**
 * @swagger
 * /api/tourist/wishlist/{touristId}:
 *   get:
 *     summary: Get tourist's wishlist
 *     tags: [Tourist]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: touristId
 *         required: true
 *         schema:
 *           type: string
 *         description: Tourist ID
 *     responses:
 *       200:
 *         description: Tourist's wishlist
 */
//router.get("/wishlist", verifyToken, getWishlistController);

/**
 * @swagger
 * /api/tourist/wishlist:
 *   post:
 *     summary: Add tour to wishlist
 *     tags: [Tourist]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - tourId
 *             properties:
 *               tourId:
 *                 type: string
 *                 example: 10
 *     responses:
 *       201:
 *         description: Tour được thêm thành công vào wishlist
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Tour added to wishlist
 *       400:
 *         description: Tour đã tồn tại trong wishlist
 *       401:
 *         description: Unauthorized (thiếu hoặc token sai)
 *       500:
 *         description: Lỗi server
 */
//router.post("/wishlist", verifyToken, addWishlistController);

/**
 * @swagger
 * /api/tourist/wishlist:
 *   delete:
 *     summary: Xóa tour khỏi wishlist
 *     description: Cho phép tourist bỏ một tour ra khỏi wishlist của mình.
 *     tags: [Tourist]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - tourId
 *             properties:
 *               tourId:
 *                 type: string
 *                 example: 10
 *     responses:
 *       200:
 *         description: Xóa tour thành công khỏi wishlist
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Tour removed from wishlist
 *       404:
 *         description: Không tìm thấy tour trong wishlist
 *       401:
 *         description: Unauthorized (thiếu hoặc token sai)
 *       500:
 *         description: Lỗi server
 */
//router.delete("/wishlist", verifyToken, removeWishlistController);

module.exports = router;
