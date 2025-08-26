const { pool } = require("../../config/db");

module.exports = async (req, res) => {
  const page = Math.max(
    Number.isInteger(parseInt(req.query.page, 10))
      ? parseInt(req.query.page, 10)
      : 1,
    1
  );
  const limit = Math.max(
    Number.isInteger(parseInt(req.query.limit, 10))
      ? parseInt(req.query.limit, 10)
      : 20,
    1
  );
  const offset = (page - 1) * limit;

  const { category, minPrice, maxPrice } = req.query;

  const where = [];
  const params = [];

  if (category) {
    where.push("t.category = ?");
    params.push(category);
  }
  if (minPrice !== undefined) {
    where.push("t.price >= ?");
    params.push(Number(minPrice));
  }
  if (maxPrice !== undefined) {
    where.push("t.price <= ?");
    params.push(Number(maxPrice));
  }

  const whereSql = where.length ? `WHERE ${where.join(" AND ")}` : "";

  try {
    const conn = await pool.getConnection();

    // Count tổng số tour theo filter
    const [countRows] = await conn.execute(
      `SELECT COUNT(*) AS total FROM tours t ${whereSql}`,
      params
    );
    const total = countRows[0]?.total || 0;

    // Lấy danh sách tour
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
    LIMIT ${limit} OFFSET ${offset}
    `,
      params
    );

    return res.json({ tours: rows, total, page, limit, offset });
  } catch (err) {
    console.error("getTours error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
