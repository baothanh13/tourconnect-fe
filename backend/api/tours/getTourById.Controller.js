const { connectToDB } = require('../../config/db');

// GET /api/tours/:id
module.exports = async (req, res) => {
  const { id } = req.params;

  try {
    const conn = await connectToDB();

    const [rows] = await conn.execute(
      `
      SELECT
        t.id, t.guide_id, t.title, t.description, t.duration_hours, t.max_people,
        t.price, t.image_url, t.category, t.created_at, t.updated_at,
        g.user_id,
        u.name AS guide_name, u.avatar_url AS guide_avatar
      FROM tours t
      JOIN guides g ON g.id = t.guide_id
      JOIN users  u ON u.id = g.user_id
      WHERE t.id = ?
      LIMIT 1
      `,
      [id]
    );

    if (rows.length === 0) return res.status(404).json({ message: 'Tour not found' });

    return res.json(rows[0]);
  } catch (err) {
    console.error('getTourById error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};
