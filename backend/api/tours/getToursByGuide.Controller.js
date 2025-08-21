const { connectToDB } = require('../../config/db');

// GET /api/tours/guide/:guideId?page=1&limit=20
module.exports = async (req, res) => {
  const guideId = req.params.guideId; // varchar, giữ nguyên string
  const page  = Math.max(parseInt(req.query.page || '1', 10), 1);
  const limit = Math.max(parseInt(req.query.limit || '20', 10), 1);
  const offset = (page - 1) * limit;

  try {
    const conn = await connectToDB();

    // Đếm tổng số tour của guide này
    const [countRows] = await conn.execute(
      `SELECT COUNT(*) AS total FROM tours WHERE guide_id = ?`,
      [guideId]
    );
    const total = countRows[0]?.total || 0;

    // Lấy danh sách tour (chèn trực tiếp limit/offset vì MySQL2 strict với placeholder ở LIMIT/OFFSET)
    const [rows] = await conn.execute(
      `
      SELECT *
      FROM tours
      WHERE guide_id = ?
      ORDER BY created_at DESC
      LIMIT ${limit} OFFSET ${offset}
      `,
      [guideId] // chỉ bind guideId thôi
    );

    return res.json({ tours: rows, total, page, limit });
  } catch (err) {
    console.error('getToursByGuide error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};
