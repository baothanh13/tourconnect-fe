const getSystemStats = async (req, res) => {
  try {
    const connection = req.db;

    const [[userCount]] = await connection.execute(
      "SELECT COUNT(*) AS total_users FROM users"
    );
    const [[guideCount]] = await connection.execute(
      "SELECT COUNT(*) AS total_guides FROM guides"
    );
    const [[bookingCount]] = await connection.execute(
      "SELECT COUNT(*) AS total_bookings FROM bookings"
    );
    const [[bookingRevenue]] = await connection.execute(
      "SELECT SUM(total_price) AS total_revenue FROM bookings WHERE status IN ('confirmed', 'completed')"
    );

    // Get current month revenue
    const [[monthlyRevenue]] = await connection.execute(`
            SELECT SUM(total_price) AS monthly_revenue
            FROM bookings
            WHERE status IN ('confirmed', 'completed')
              AND MONTH(created_at) = MONTH(CURRENT_DATE())
              AND YEAR(created_at) = YEAR(CURRENT_DATE())
        `);

    const currentMonthRev = parseFloat(monthlyRevenue.monthly_revenue || 0);

    res.status(200).json({
      total_users: userCount.total_users,
      total_guides: guideCount.total_guides,
      total_bookings: bookingCount.total_bookings,
      total_bookings_revenue: bookingRevenue.total_revenue || 0,
      monthly_revenue: currentMonthRev,
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching system stats", error: err.message });
  }
};

module.exports = getSystemStats;
