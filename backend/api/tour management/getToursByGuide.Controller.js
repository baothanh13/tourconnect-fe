const { connectToDB } = require('../../config/db');

// GET /api/tours/guide/:guideId?page=1&limit=20
module.exports = async (req, res) => {
  const { guideId } = req.params;
  const page  = Math.max(parseInt(req.query.page || '1', 10), 1);
  const limit = Math.max(parseInt(req.query.limit || '20', 10), 1);
  const offset = (page - 1) * limit;

  try {
    const conn = await connectToDB();

    const [countRows] = await conn.execute(
      `SELECT COUNT(*) AS total FROM tours WHERE guide_id = ?`,
      [guideId]
    );
    const total = countRows[0]?.total || 0;

    const [rows] = await conn.execute(
      `
      SELECT
        t.id, t.guide_id, t.title, t.description, t.duration_hours, t.max_people,
        t.price, t.image_url, t.category, t.created_at, t.updated_at
      FROM tours t
      WHERE t.guide_id = ?
      ORDER BY t.created_at DESC
      LIMIT ? OFFSET ?
      `,
      [guideId, limit, offset]
    );

    return res.json({ tours: rows, total, page, limit });
  } catch (err) {
    console.error('getToursByGuide error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};
