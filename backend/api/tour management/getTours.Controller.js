const { connectToDB } = require('../../config/db');

// GET /api/tours?page=1&limit=20&category=food&minPrice=10&maxPrice=100&q=old quarter
module.exports = async (req, res) => {
  const page  = Math.max(parseInt(req.query.page || '1', 10), 1);
  const limit = Math.max(parseInt(req.query.limit || '20', 10), 1);
  const offset = (page - 1) * limit;

  const { category, minPrice, maxPrice, q, guide_id } = req.query;

  const where = [];
  const params = [];

  if (category) { where.push('t.category = ?'); params.push(category); }
  if (guide_id) { where.push('t.guide_id = ?'); params.push(guide_id); }
  if (minPrice) { where.push('t.price >= ?'); params.push(Number(minPrice)); }
  if (maxPrice) { where.push('t.price <= ?'); params.push(Number(maxPrice)); }
  if (q)        { where.push('(t.title LIKE ? OR t.description LIKE ?)'); params.push(`%${q}%`, `%${q}%`); }

  const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : '';

  try {
    const conn = await connectToDB();

    const [countRows] = await conn.execute(
      `SELECT COUNT(*) AS total FROM tours t ${whereSql}`,
      params
    );
    const total = countRows[0]?.total || 0;

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
      ${whereSql}
      ORDER BY t.created_at DESC
      LIMIT ? OFFSET ?
      `,
      [...params, limit, offset]
    );

    return res.json({ tours: rows, total, page, limit });
  } catch (err) {
    console.error('getTours error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};
