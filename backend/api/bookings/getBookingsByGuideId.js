const { pool } = require("../../config/db");

const getBookingByGuideId = async (req, res) => {
  const guideId = req.params.id;

  try {
    const [results] = await pool.execute(
      `SELECT *
       FROM bookings
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
