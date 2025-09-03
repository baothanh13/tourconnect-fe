const { query } = require("../../config/db");

const getBookings = async (req, res) => {
  const userId = req.query.user_id || req.user?.user_id;

  if (!userId) {
    return res.status(400).json({ message: "User ID is required" });
  }

  try {
    const bookings = await query(
      `SELECT * FROM bookings WHERE tourist_id = ? ORDER BY created_at DESC`,
      [userId]
    );
    return res.status(200).json({ bookings });
  } catch (err) {
    console.error("Get Bookings Error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = getBookings;
