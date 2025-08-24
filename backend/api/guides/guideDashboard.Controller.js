const { connectToDB } = require("../../config/db");

const getGuideDashboardStats = async (req, res) => {
  try {
    const { user_id } = req.params;
    const connection = await connectToDB();

    // Get guide profile
    const [guideRows] = await connection.execute(
      `SELECT * FROM guides WHERE user_id = ?`,
      [user_id]
    );

    if (guideRows.length === 0) {
      return res.status(404).json({ message: "Guide profile not found" });
    }

    const guide = guideRows[0];

    // Get tour statistics
    const [tourStats] = await connection.execute(
      `SELECT 
        COUNT(*) as total_tours,
        SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) as active_tours,
        SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed_tours
       FROM tours WHERE guide_id = ?`,
      [guide.id]
    );

    // Get booking statistics
    const [bookingStats] = await connection.execute(
      `SELECT 
        COUNT(*) as total_bookings,
        SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed_bookings,
        SUM(CASE WHEN status = 'confirmed' AND date > CURDATE() THEN 1 ELSE 0 END) as upcoming_bookings,
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending_bookings,
        SUM(CASE WHEN status = 'completed' THEN total_price ELSE 0 END) as total_earnings
       FROM bookings 
       WHERE guide_id = ?`,
      [guide.id]
    );

    // Get monthly earnings (current month)
    const [monthlyEarnings] = await connection.execute(
      `SELECT 
        COALESCE(SUM(total_price), 0) as monthly_earnings,
        COUNT(*) as monthly_bookings
       FROM bookings 
       WHERE guide_id = ? 
       AND status = 'completed' 
       AND MONTH(date) = MONTH(CURDATE()) 
       AND YEAR(date) = YEAR(CURDATE())`,
      [guide.id]
    );

    // Get previous month earnings for growth calculation
    const [prevMonthEarnings] = await connection.execute(
      `SELECT 
        COALESCE(SUM(total_price), 0) as prev_monthly_earnings
       FROM bookings 
       WHERE guide_id = ? 
       AND status = 'completed' 
       AND MONTH(date) = MONTH(DATE_SUB(CURDATE(), INTERVAL 1 MONTH))
       AND YEAR(date) = YEAR(DATE_SUB(CURDATE(), INTERVAL 1 MONTH))`,
      [guide.id]
    );

    // Calculate growth percentage
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

    // Get review statistics
    const [reviewStats] = await connection.execute(
      `SELECT 
        COUNT(*) as total_reviews,
        COALESCE(AVG(rating), 0) as average_rating
       FROM reviews 
       WHERE guide_id = ?`,
      [guide.id]
    );

    // Calculate total customers (estimate based on completed bookings)
    const totalCustomers = (bookingStats[0].completed_bookings || 0) * 1.5; // Estimate

    const stats = {
      totalTours: tourStats[0].total_tours || 0,
      activeTours: tourStats[0].active_tours || 0,
      completedTours: tourStats[0].completed_tours || 0,
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
        specialties: guide.specialties ? JSON.parse(guide.specialties) : [],
        languages: guide.languages ? JSON.parse(guide.languages) : [],
        pricePerHour: guide.price_per_hour || 0,
        experienceYears: guide.experience_years || 0,
        description: guide.description || "",
        isAvailable: guide.is_available || false,
      },
    };

    await connection.end();

    return res.status(200).json({
      success: true,
      stats,
      guide: guide,
    });
  } catch (error) {
    console.error("Error fetching guide dashboard stats:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

const getGuideRecentActivities = async (req, res) => {
  try {
    const { user_id } = req.params;
    const { limit = 5 } = req.query;
    const connection = await connectToDB();

    // Get guide ID first
    const [guideRows] = await connection.execute(
      `SELECT id FROM guides WHERE user_id = ?`,
      [user_id]
    );

    if (guideRows.length === 0) {
      return res.status(404).json({ message: "Guide profile not found" });
    }

    const guideId = guideRows[0].id;

    // Get recent activities from different sources
    const [activities] = await connection.execute(
      `(
        SELECT 
          CONCAT('booking_', b.id) as id,
          'booking' as type,
          'New Booking Request' as title,
          CONCAT('Booking for ', b.number_of_tourists, ' people on ', DATE_FORMAT(b.date, '%M %d, %Y')) as description,
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

    await connection.end();

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

const getGuideUpcomingBookings = async (req, res) => {
  try {
    const { user_id } = req.params;
    const { limit = 5 } = req.query;
    const connection = await connectToDB();

    // Get guide ID first
    const [guideRows] = await connection.execute(
      `SELECT id FROM guides WHERE user_id = ?`,
      [user_id]
    );

    if (guideRows.length === 0) {
      return res.status(404).json({ message: "Guide profile not found" });
    }

    const guideId = guideRows[0].id;

    // Get upcoming bookings
    const [bookings] = await connection.execute(
      `SELECT 
        b.*,
        u.name as tourist_name,
        u.email as tourist_email,
        t.title as tour_title
       FROM bookings b
       LEFT JOIN users u ON b.tourist_id = u.id
       LEFT JOIN tours t ON b.tour_id = t.id
       WHERE b.guide_id = ? 
       AND b.date >= CURDATE()
       AND b.status IN ('confirmed', 'pending')
       ORDER BY b.date ASC, b.time_slot ASC
       LIMIT ?`,
      [guideId, limit]
    );

    await connection.end();

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
