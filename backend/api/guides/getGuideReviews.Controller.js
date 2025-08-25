const { pool } = require('../../config/db');

module.exports = async (req, res) => {
  const { guideId } = req.params;
  const page = Math.max(Number.isInteger(parseInt(req.query.page, 10)) ? parseInt(req.query.page, 10) : 1, 1);
  const limit = Math.max(Number.isInteger(parseInt(req.query.limit, 10)) ? parseInt(req.query.limit, 10) : 20, 1);
  const offset = (page - 1) * limit;

  try {
    // Đếm tổng số review
    const [countRows] = await pool.execute(
      `SELECT COUNT(*) AS total FROM reviews WHERE guide_id = ?`,
      [guideId]
    );
    const total = countRows[0]?.total || 0;

    // Lấy danh sách review có join thêm thông tin tour & tourist
    const [rows] = await pool.execute(
      `
      SELECT
        r.id,
        r.rating,
        r.comment,
        r.created_at,
        r.booking_id,
        r.tour_id,
        t.title AS tour_title,
        u.id   AS tourist_id,
        u.name AS tourist_name,
        u.avatar_url AS tourist_avatar
      FROM reviews r
      JOIN tours t ON t.id = r.tour_id
      JOIN users u ON u.id = r.tourist_id
      WHERE r.guide_id = ?
      ORDER BY r.created_at DESC
      LIMIT ${limit} OFFSET ${offset}
      `,
      [guideId]
    );

    return res.json({
      success: true,
      reviews: rows || [],
      total,
      page,
      limit
    });
  } catch (err) {
    console.error('getGuideReviews error:', err);
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: err.message
    });
  }
};
