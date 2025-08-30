const express = require('express');
const router = express.Router();

const addFavGuidesController = require("../api/tourist/addFavGuides.Controller");
const getFavGuidesController = require("../api/tourist/getFavGuides.Controller");
const removeFavGuideController = require("../api/tourist/removeFavGuides.Controller");
const getWishlistController = require("../api/tourist/getWishlistTour.Controller");
const addWishlistController = require("../api/tourist/addWishListTour.Controller");
const removeWishlistController = require("../api/tourist/removeWishlistTour.Controller");
const verifyToken = require("../middleware/verifyToken"); // Import middleware

/**
 * @swagger
 * /api/tourist/guides:
 *   post:
 *     summary: Thêm guide vào danh sách yêu thích
 *     description: Cho phép tourist thêm một guide vào danh sách yêu thích của mình. 
 *                  Nếu guide đã tồn tại thì trả về lỗi.
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
router.post("/guides", verifyToken, addFavGuidesController);

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
router.get("/guides", verifyToken, getFavGuidesController);

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
 *         description: Xóa guide thành công khỏi favourites
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Guide removed from favourites
 *       404:
 *         description: Không tìm thấy guide trong favourites
 *       401:
 *         description: Unauthorized (thiếu hoặc token sai)
 *       500:
 *         description: Lỗi server
 */
router.delete("/guides", verifyToken, removeFavGuideController);

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
 *         description: Danh sách tours trong wishlist
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 wishlistTours:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       tour_id:
 *                         type: string
 *                         example: 10
 *                       tour_name:
 *                         type: string
 *                         example: "Ha Long Bay Adventure"
 *                       location:
 *                         type: string
 *                         example: "Quang Ninh"
 *                       price:
 *                         type: number
 *                         example: 150.0
 *                       duration:
 *                         type: string
 *                         example: "3 days 2 nights"
 *                       added_at:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-08-29T10:00:00Z"
 *       401:
 *         description: Unauthorized (thiếu hoặc token sai)
 *       500:
 *         description: Lỗi server
 */
router.get("/wishlist", verifyToken, getWishlistController);

/**
 * @swagger
 * /api/tourist/wishlist:
 *   post:
 *     summary: Thêm tour vào wishlist
 *     description: Cho phép tourist thêm một tour vào wishlist của mình. 
 *                  Nếu tour đã tồn tại thì trả về lỗi.
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
router.post("/wishlist", verifyToken, addWishlistController);

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
router.delete("/wishlist", verifyToken, removeWishlistController);

module.exports = router;