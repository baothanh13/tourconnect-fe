const express = require('express');
const router = express.Router();

const createBooking = require('../api/bookings/createBooking.Controller');
const getBookings = require('../api/bookings/getBookings.Controller');
const getBookingByGuideId = require('../api/bookings/getBookingsByGuideId');
const getBookingById = require('../api/bookings/getBookingById.Controller');
const updateBooking = require('../api/bookings/updateBooking.Controller');
const updateBookingStatus = require('../api/bookings/updateBookingStatus.Controller');
const verifyToken = require('../middleware/verifyToken');

/**
 * @swagger
 * /api/bookings:
 *   post:
 *     summary: Tạo mới một booking
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
 *               guideId:
 *                 type: string
 *                 description: ID của hướng dẫn viên
 *               date:
 *                 type: string
 *                 format: date
 *                 description: Ngày đặt tour (YYYY-MM-DD)
 *               timeSlot:
 *                 type: string
 *                 description: Giờ bắt đầu (HH:mm:ss)
 *               duration:
 *                 type: integer
 *                 description: Thời lượng tour (giờ)
 *               numberOfTourists:
 *                 type: integer
 *                 description: Số lượng khách du lịch
 *               specialRequests:
 *                 type: string
 *                 description: Yêu cầu đặc biệt
 *               totalPrice:
 *                 type: number
 *                 format: float
 *                 description: Tổng giá tiền
 *     responses:
 *       201:
 *         description: Booking created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Booking created
 *                 bookingId:
 *                   type: string
 *                   description: ID của booking vừa tạo
 */
router.post('/', verifyToken, createBooking);

/**
 * @swagger
 * /api/bookings:
 *   get:
 *     summary: Lấy danh sách booking của user
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Danh sách booking
 */
router.get('/', verifyToken, getBookings);

/**
 * @swagger
 * /api/bookings/guide/{id}:
 *   get:
 *     summary: Lấy danh sách booking của hướng dẫn viên theo ID
 *     tags: [Bookings]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Guide ID
 *     responses:
 *       '200':
 *         description: Guides' bookings detail
 */
router.get('/guide/:id', getBookingByGuideId);

/**
 * @swagger
 * /api/bookings/{id}:
 *   get:
 *     summary: Lấy thông tin chi tiết của một booking
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Booking ID
 *     responses:
 *       200:
 *         description: Booking detail
 */
router.get('/:id', verifyToken, getBookingById);

/**
 * @swagger
 * /api/bookings/{id}:
 *   put:
 *     summary: Cập nhật thông tin một booking
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Booking ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               timeSlot:
 *                 type: string
 *               duration:
 *                 type: integer
 *               numberOfTourists:
 *                 type: integer
 *               specialRequests:
 *                 type: string
 *     responses:
 *       200:
 *         description: Booking updated
 */
router.put('/:id', verifyToken, updateBooking);

/**
 * @swagger
 * /api/bookings/{id}/status:
 *   put:
 *     summary: Cập nhật trạng thái booking
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Booking ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, confirmed, completed, cancelled]
 *     responses:
 *       200:
 *         description: Trạng thái booking đã được cập nhật
 */
router.put('/:id/status', verifyToken, updateBookingStatus);

module.exports = router;
