const { query } = require("../../config/db");

const getBookings = async (req, res) => {
  const userId = req.query.user_id || req.user?.user_id;

  if (!userId) {
    return res.status(400).json({ message: "User ID is required" });
  }

  try {
    // Join with guides table to get guide information
    const bookings = await query(
      `SELECT 
          b.*,
          u.name AS guide_name,
          u.avatar_url AS guide_avatar,
          g.location AS guide_location,
          g.specialties AS guide_specialties,
          g.rating AS guide_rating
      FROM bookings b
      LEFT JOIN guides g ON b.guide_id = g.id 
      LEFT JOIN users u ON g.user_id = u.id
      WHERE b.tourist_id = ? 
      ORDER BY b.created_at DESC`,
      [userId]
    );
    return res.status(200).json({ bookings });
  } catch (err) {
    console.error("Get Bookings Error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = getBookings;
