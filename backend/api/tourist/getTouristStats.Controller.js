const getTouristStats = async (req, res) => {
  try {
    const { touristId } = req.params;
    const connection = req.db;

    // Get bookings stats
    const [bookingsResult] = await connection.execute(
      `SELECT 
        COUNT(*) as totalBookings,
        COUNT(CASE WHEN status = 'completed' THEN 1 END) as completedTours,
        COUNT(CASE WHEN status = 'confirmed' AND booking_date >= CURDATE() THEN 1 END) as upcomingTours,
        SUM(total_price) as totalSpent,
        SUM(CASE WHEN MONTH(created_at) = MONTH(CURDATE()) AND YEAR(created_at) = YEAR(CURDATE()) THEN total_price ELSE 0 END) as monthlySpent
      FROM bookings 
      WHERE user_id = ?`,
      [touristId]
    );

    // Get reviews stats
    const [reviewsResult] = await connection.execute(
      `SELECT 
        COUNT(*) as totalReviews,
        AVG(rating) as averageRating
      FROM reviews 
      WHERE user_id = ?`,
      [touristId]
    );

    // Get favorite guides count (guides booked more than once)
    const [favGuidesResult] = await connection.execute(
      `SELECT COUNT(DISTINCT g.user_id) as favoriteGuides
      FROM bookings b
      JOIN guides g ON b.guide_id = g.user_id  
      WHERE b.user_id = ?
      GROUP BY g.user_id
      HAVING COUNT(b.id) > 1`,
      [touristId]
    );

    // Get wishlist count
    const [wishlistResult] = await connection.execute(
      `SELECT COUNT(*) as savedWishlist
      FROM wishlists 
      WHERE user_id = ?`,
      [touristId]
    );

    const bookingStats = bookingsResult[0] || {
      totalBookings: 0,
      completedTours: 0,
      upcomingTours: 0,
      totalSpent: 0,
      monthlySpent: 0,
    };

    const reviewStats = reviewsResult[0] || {
      totalReviews: 0,
      averageRating: 0,
    };

    const favoriteGuides = favGuidesResult.length || 0;
    const savedWishlist = wishlistResult[0]?.savedWishlist || 0;

    // Calculate membership level based on spending
    const totalSpent = parseFloat(bookingStats.totalSpent) || 0;
    let membershipsLevel = "Beginner Explorer";
    if (totalSpent >= 5000) membershipsLevel = "VIP Explorer";
    else if (totalSpent >= 2000) membershipsLevel = "Advanced Explorer";
    else if (totalSpent >= 500) membershipsLevel = "Explorer";

    // Calculate reward points (1 point per $10 spent)
    const rewardPoints = Math.floor(totalSpent / 10);

    // For growth percentage, we would need historical data
    // For now, returning 0 as placeholder
    const growthPercentage = 0;

    const stats = {
      totalBookings: parseInt(bookingStats.totalBookings),
      completedTours: parseInt(bookingStats.completedTours),
      upcomingTours: parseInt(bookingStats.upcomingTours),
      totalSpent: totalSpent,
      favoriteGuides: favoriteGuides,
      savedWishlist: savedWishlist,
      averageRating:
        Math.round((parseFloat(reviewStats.averageRating) || 0) * 10) / 10,
      totalReviews: parseInt(reviewStats.totalReviews),
      membershipsLevel: membershipsLevel,
      rewardPoints: rewardPoints,
      monthlySpent: parseFloat(bookingStats.monthlySpent) || 0,
      growthPercentage: growthPercentage,
    };

    res.status(200).json({
      success: true,
      stats: stats,
    });
  } catch (error) {
    console.error("Error fetching tourist stats:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch tourist statistics",
      error: error.message,
    });
  }
};

module.exports = getTouristStats;
