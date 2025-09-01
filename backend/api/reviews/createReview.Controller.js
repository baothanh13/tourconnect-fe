const { connectToDB } = require('../../config/db');
const generateId = require('../../utils/generateId');

// POST /api/reviews
// body: { booking_id, tour_id, rating (1..5), comment? }
// Gợi ý: nếu bạn có JWT -> lấy tourist_id từ req.user.id để chống giả mạo
module.exports = async (req, res) => {
  const { booking_id, tour_title, rating, comment = null } = req.body || {};

  // Validate input
  if (!booking_id || !tour_title || rating === undefined) {
    return res.status(400).json({ message: 'booking_id, tour_title, rating are required' });
  }
  const r = Number(rating);
  if (Number.isNaN(r) || r < 1 || r > 5) {
    return res.status(400).json({ message: 'Rating must be between 1 and 5' });
  }

  try {
    const conn = await connectToDB();

    // Lấy booking
    const [bkRows] = await conn.execute(
      `SELECT id, tourist_id, guide_id, status
       FROM bookings
       WHERE id = ?`,
      [booking_id]
    );
    if (bkRows.length === 0) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    const booking = bkRows[0];

    // (Tuỳ policy) Chỉ cho review khi booking đã completed/confirmed (tuỳ bạn)
    if (booking.status === 'cancelled') {
      return res.status(400).json({ message: 'Cannot review a cancelled booking' });
    }


    // Chống review trùng cho cùng booking bởi cùng tourist
    const [dup] = await conn.execute(
      `SELECT id FROM reviews WHERE booking_id = ? AND tourist_id = ? LIMIT 1`,
      [booking_id, booking.tourist_id]
    );
    if (dup.length > 0) {
      return res.status(409).json({ message: 'You have already reviewed this booking' });
    }

    // Tạo review
    const id = generateId('review');
    await conn.execute(
      `INSERT INTO reviews
        (id, booking_id, tourist_id, guide_id, tour_title, rating, comment)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [id, booking_id, booking.tourist_id, booking.guide_id, tour_title, r, comment]
    );

    // Cập nhật điểm trung bình và tổng số review của guide (atomic theo công thức)
    await conn.execute(
      `UPDATE guides
         SET rating = ROUND(((rating * total_reviews) + ?) / (total_reviews + 1), 2),
             total_reviews = total_reviews + 1
       WHERE id = ?`,
      [r, booking.guide_id]
    );

    return res.status(201).json({ message: 'Review created', id });
  } catch (err) {
    console.error('createReview error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};
