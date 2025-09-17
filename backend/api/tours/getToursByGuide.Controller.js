const { pool } = require("../../config/db");

// GET /api/tours/guide/:guideId?page=1&limit=20
const getToursByGuide = async (req, res) => {
  const guideId = req.params.guideId; // varchar, giữ nguyên string
  const page = Math.max(parseInt(req.query.page || "1", 10), 1);
  const limit = Math.max(parseInt(req.query.limit || "20", 10), 1);
  const offset = (page - 1) * limit;

  try {
    // Đếm tổng số tour của guide này
    const [countRows] = await pool.execute(
      `SELECT COUNT(*) AS total FROM tours WHERE guide_id = ?`,
      [guideId]
    );
    const total = countRows[0]?.total || 0;

    // Lấy danh sách tour
    const [rows] = await pool.execute(
      `
      SELECT 
        id, title, description, duration_hours, max_people, price, image_url, category, tour_date, tour_time
      FROM tours
      WHERE guide_id = ?
      ORDER BY created_at DESC
      LIMIT ${limit} OFFSET ${offset}
      `,
      [guideId] // chỉ bind guideId thôi
    );

    return res.status(200).json({
      success: true,
      tours: rows,
      total,
      page,
      limit,
    });
  } catch (err) {
    console.error("getToursByGuide error:", err);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
};

module.exports = getToursByGuide;
