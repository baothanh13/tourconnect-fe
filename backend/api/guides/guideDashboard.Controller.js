const { pool } = require("../../config/db");

// Hàm parse JSON an toàn
function safeJson(value, fallback = []) {
  if (!value) return fallback;
  if (typeof value === "string") {
    try {
      return JSON.parse(value);
    } catch {
      return fallback;
    }
  }
  if (typeof value === "object") return value;
  return fallback;
}

// ================== Dashboard Stats ==================
const getGuideDashboardStats = async (req, res) => {
  try {
    const { user_id } = req.params;

    // Get guide profile
    const [guideRows] = await pool.execute(
      `SELECT * FROM guides WHERE user_id = ?`,
      [user_id]
    );

    if (guideRows.length === 0) {
      return res.status(404).json({ message: "Guide profile not found" });
    }

    const guide = guideRows[0];

    // Tour stats
    const [tourStats] = await pool.execute(
      `SELECT COUNT(*) as total_tours FROM tours WHERE guide_id = ?`,
      [guide.id]
    );

    // Booking stats
    const [bookingStats] = await pool.execute(
      `SELECT 
        COUNT(*) as total_bookings,
        SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed_bookings,
        SUM(CASE WHEN status = 'confirmed' AND booking_date > CURDATE() THEN 1 ELSE 0 END) as upcoming_bookings,
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending_bookings,
        SUM(CASE WHEN status = 'completed' THEN total_price ELSE 0 END) as total_earnings
       FROM bookings 
       WHERE guide_id = ?`,
      [guide.id]
    );

    // Monthly earnings
    const [monthlyEarnings] = await pool.execute(
      `SELECT 
        COALESCE(SUM(total_price), 0) as monthly_earnings,
        COUNT(*) as monthly_bookings
       FROM bookings 
       WHERE guide_id = ? 
         AND status = 'completed' 
         AND MONTH(booking_date) = MONTH(CURDATE()) 
         AND YEAR(booking_date) = YEAR(CURDATE())`,
      [guide.id]
    );

    // Prev month earnings
    const [prevMonthEarnings] = await pool.execute(
      `SELECT COALESCE(SUM(total_price), 0) as prev_monthly_earnings
       FROM bookings 
       WHERE guide_id = ? 
         AND status = 'completed' 
         AND MONTH(booking_date) = MONTH(DATE_SUB(CURDATE(), INTERVAL 1 MONTH))
         AND YEAR(booking_date) = YEAR(DATE_SUB(CURDATE(), INTERVAL 1 MONTH))`,
      [guide.id]
    );

    // Growth %
    const currentMonth = monthlyEarnings[0].monthly_earnings || 0;
    const previousMonth = prevMonthEarnings[0].prev_monthly_earnings || 0;
    let growthPercentage = 0;
    if (previousMonth > 0) {
      growthPercentage = Math.round(
        ((currentMonth - previousMonth) / previousMonth) * 100
      );
    } else if (currentMonth > 0) {
      growthPercentage = 100;
    }

    // Review stats
    const [reviewStats] = await pool.execute(
      `SELECT 
        COUNT(*) as total_reviews,
        COALESCE(AVG(rating), 0) as average_rating
       FROM reviews 
       WHERE guide_id = ?`,
      [guide.id]
    );

    // Completed Tours
    const [completedTours] = await pool.execute(
      `SELECT COUNT(DISTINCT t.id) as completed_tours
      FROM tours t
      JOIN bookings b ON t.guide_id = b.guide_id
      WHERE t.guide_id = ? AND b.status = 'completed'`,
      [guide.id]
    );

    // Total customers (ước lượng)
    const totalCustomers = (bookingStats[0].completed_bookings || 0) * 1.5;

    const stats = {
      totalTours: tourStats[0].total_tours || 0,
      completedTours: completedTours[0].completed_tours || 0, // ✅ thêm completedTours
      upcomingTours: bookingStats[0].upcoming_bookings || 0,
      pendingBookings: bookingStats[0].pending_bookings || 0,
      totalBookings: bookingStats[0].total_bookings || 0,
      completedBookings: bookingStats[0].completed_bookings || 0,
      totalEarnings: parseFloat(bookingStats[0].total_earnings) || 0,
      monthlyEarnings: parseFloat(currentMonth) || 0,
      growthPercentage,
      averageRating: Math.round((reviewStats[0].average_rating || 0) * 10) / 10,
      totalReviews: reviewStats[0].total_reviews || 0,
      totalCustomers: Math.round(totalCustomers),
      verificationStatus: guide.verification_status || "pending",
      profileData: {
        name: guide.name,
        location: guide.location,
        specialties: safeJson(guide.specialties),
        languages: safeJson(guide.languages),
        pricePerHour: guide.price_per_hour || 0,
        experienceYears: guide.experience_years || 0,
        description: guide.description || "",
        isAvailable: guide.is_available || false,
        certificates: safeJson(guide.certificates),
      },
    };

    return res.status(200).json({ success: true, stats, guide });
  } catch (error) {
    console.error("Error fetching guide dashboard stats:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// ================== Recent Activities ==================
const getGuideRecentActivities = async (req, res) => {
  try {
    const { user_id } = req.params;
    const { limit = 5 } = req.query;

    const [guideRows] = await pool.execute(
      `SELECT id FROM guides WHERE user_id = ?`,
      [user_id]
    );

    if (guideRows.length === 0) {
      return res.status(404).json({ message: "Guide profile not found" });
    }

    const guideId = guideRows[0].id;

    const [activities] = await pool.execute(
      `(
        SELECT 
          CONCAT('booking_', b.id) as id,
          'booking' as type,
          'New Booking Request' as title,
          CONCAT('Booking for ', b.number_of_tourists, ' people on ', DATE_FORMAT(b.booking_date, '%M %d, %Y')) as description,
          b.status,
          b.created_at as timestamp
        FROM bookings b
        WHERE b.guide_id = ?
        ORDER BY b.created_at DESC
        LIMIT ?
      )
      UNION ALL
      (
        SELECT 
          CONCAT('review_', r.id) as id,
          'review' as type,
          'New Review Received' as title,
          CONCAT(r.rating, ' star review: ', SUBSTRING(r.comment, 1, 50), '...') as description,
          'completed' as status,
          r.created_at as timestamp
        FROM reviews r
        WHERE r.guide_id = ?
        ORDER BY r.created_at DESC
        LIMIT ?
      )
      ORDER BY timestamp DESC
      LIMIT ?`,
      [guideId, limit, guideId, limit, limit]
    );

    return res.status(200).json({
      success: true,
      activities: activities || [],
    });
  } catch (error) {
    console.error("Error fetching guide activities:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// ================== Upcoming Bookings ==================
const getGuideUpcomingBookings = async (req, res) => {
  try {
    const { user_id } = req.params;
    const { limit = 5 } = req.query;

    const [guideRows] = await pool.execute(
      `SELECT id FROM guides WHERE user_id = ?`,
      [user_id]
    );

    if (guideRows.length === 0) {
      return res.status(404).json({ message: "Guide profile not found" });
    }

    const guideId = guideRows[0].id;

    const [bookings] = await pool.execute(
      `SELECT 
            b.*,
            u.name  AS tourist_name,
            u.email AS tourist_email,
            g_user.name AS guide_name
        FROM bookings b
        LEFT JOIN users u      ON b.tourist_id = u.id
        LEFT JOIN guides g     ON b.guide_id = g.id
        LEFT JOIN users g_user ON g.user_id = g_user.id
       WHERE b.guide_id = ? 
         AND b.booking_date >= CURDATE()
         AND b.status IN ('confirmed', 'pending')
       ORDER BY b.booking_date ASC, b.time_slot ASC
       LIMIT ?`,
      [guideId, limit]
    );

    return res.status(200).json({
      success: true,
      bookings: bookings || [],
    });
  } catch (error) {
    console.error("Error fetching guide upcoming bookings:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

module.exports = {
  getGuideDashboardStats,
  getGuideRecentActivities,
  getGuideUpcomingBookings,
};
