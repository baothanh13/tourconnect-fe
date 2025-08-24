const { connectToDB } = require('../../config/db');

// GET /api/reviews/tourist/:touristId?page=1&limit=20
module.exports = async (req, res) => {
  const { touristId } = req.params;
  const page  = Math.max(Number.isInteger(parseInt(req.query.page, 10)) ? parseInt(req.query.page, 10) : 1, 1);
  const limit = Math.max(Number.isInteger(parseInt(req.query.limit, 10)) ? parseInt(req.query.limit, 10) : 20, 1);
  const offset = (page - 1) * limit;

  try {
    const conn = await connectToDB();

    const [countRows] = await conn.execute(
      `SELECT COUNT(*) AS total FROM reviews WHERE tourist_id = ?`,
      [touristId]
    );
    const total = countRows[0]?.total || 0;

    const [rows] = await conn.execute(
      `
      SELECT
        r.id,
        r.rating,
        r.comment,
        r.created_at,
        r.booking_id,
        r.tour_id,
        t.title AS tour_title,
        g.id    AS guide_id,
        ug.name AS guide_name,
        ug.avatar_url AS guide_avatar
      FROM reviews r
      JOIN tours  t  ON t.id = r.tour_id
      JOIN guides g  ON g.id = r.guide_id
      JOIN users  ug ON ug.id = g.user_id
      WHERE r.tourist_id = ?
      ORDER BY r.created_at DESC
      LIMIT ${limit} OFFSET ${offset}
    `,
      [touristId]
    );

    return res.json({
      reviews: rows,
      total,
      page,
      limit
    });
  } catch (err) {
    console.error('getTouristReviews error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};
