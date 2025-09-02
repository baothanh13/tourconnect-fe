const { pool } = require("../../config/db");

// ================== Recent Activities ==================
const getTouristRecentActivities = async (req, res) => {
  try {
    const { touristId } = req.params;
    const { limit = 10 } = req.query;

    // Check if tourist exists
    const [touristRows] = await pool.execute(
      `SELECT id, name FROM users WHERE id = ? AND role = 'tourist'`,
      [touristId]
    );

    if (touristRows.length === 0) {
      return res.status(404).json({ message: "Tourist not found" });
    }

    // Get recent activities from bookings, reviews, and other interactions
    const [activities] = await pool.execute(
      `(
        SELECT 
          CONCAT('booking_', b.id) as id,
          'booking' as type,
          CASE 
            WHEN b.status = 'completed' THEN 'Tour Completed'
            WHEN b.status = 'confirmed' THEN 'Booking Confirmed'
            WHEN b.status = 'pending' THEN 'Booking Pending'
            WHEN b.status = 'cancelled' THEN 'Booking Cancelled'
            ELSE 'Booking Updated'
          END as title,
          CONCAT('Booking for ', t.title, ' with guide ', gu.name) as description,
          b.status,
          b.created_at as timestamp,
          b.total_price as amount,
          t.title as tour_title,
          gu.name as guide_name
        FROM bookings b
        JOIN tours t ON b.tour_id = t.id
        JOIN guides g ON b.guide_id = g.id
        JOIN users gu ON g.user_id = gu.id
        WHERE b.tourist_id = ?
        ORDER BY b.created_at DESC
        LIMIT ?
      )
      UNION ALL
      (
        SELECT 
          CONCAT('review_', r.id) as id,
          'review' as type,
          'Review Submitted' as title,
          CONCAT('Left a ', r.rating, '-star review for ', t.title) as description,
          'completed' as status,
          r.created_at as timestamp,
          r.rating as amount,
          t.title as tour_title,
          gu.name as guide_name
        FROM reviews r
        JOIN tours t ON r.tour_id = t.id
        JOIN guides g ON r.guide_id = g.id
        JOIN users gu ON g.user_id = gu.id
        WHERE r.tourist_id = ?
        ORDER BY r.created_at DESC
        LIMIT ?
      )
      ORDER BY timestamp DESC
      LIMIT ?`,
      [touristId, limit, touristId, limit, limit]
    );

    return res.status(200).json({
      success: true,
      activities: activities || [],
    });
  } catch (error) {
    console.error("Error fetching tourist activities:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

module.exports = {
  getTouristRecentActivities,
};
