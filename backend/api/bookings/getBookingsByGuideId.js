const { pool } = require("../../config/db");

const getBookingByGuideId = async (req, res) => {
  const guideId = req.params.id;

  try {
    const [results] = await pool.execute(
      `SELECT b.*,
       u.name AS tourist_name,
       u.email AS tourist_email,
       u.phone AS tourist_phone
       FROM bookings b
       JOIN users u ON b.tourist_id = u.id
       WHERE guide_id = ?
       ORDER BY created_at DESC`,
      [guideId]
    );

    return res.status(200).json({
      success: true,
      bookings: results || [],
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
};

module.exports = getBookingByGuideId;
