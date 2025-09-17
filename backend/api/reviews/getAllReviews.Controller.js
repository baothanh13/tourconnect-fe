const { query } = require('../../config/db');

// GET /api/reviews
module.exports = async (req, res) => {
  try {
    const sql = `
      SELECT
        r.id,
        r.rating,
        r.comment,
        r.created_at,
        r.booking_id,
        r.tour_title,
        g.id AS guide_id,
        ug.name AS guide_name
      FROM reviews r
      JOIN guides g ON r.guide_id = g.id
      JOIN users ug ON g.user_id = ug.id
    `;

    const rows = await query(sql);

    return res.json({ reviews: rows });
  } catch (err) {
    console.error("getAllReviews error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
