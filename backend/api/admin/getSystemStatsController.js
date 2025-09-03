const { query } = require("../../config/db");

const getSystemStats = async (req, res) => {
    try {
        const userCountRows = await query("SELECT COUNT(*) AS total_users FROM users");
        const guideCountRows = await query("SELECT COUNT(*) AS total_guides FROM guides");
        const bookingCountRows = await query("SELECT COUNT(*) AS total_bookings FROM bookings");
        const bookingRevenueRows = await query("SELECT SUM(total_price) AS total_revenue FROM bookings WHERE status = 'confirmed'");

        // thêm doanh thu tháng hiện tại
        const monthlyRevenueRows = await query(`
            SELECT SUM(total_price) AS monthly_revenue
            FROM bookings
            WHERE status = 'confirmed'
              AND MONTH(created_at) = MONTH(CURRENT_DATE())
              AND YEAR(created_at) = YEAR(CURRENT_DATE())
        `);

        const userCount = userCountRows[0] || { total_users: 0 };
        const guideCount = guideCountRows[0] || { total_guides: 0 };
        const bookingCount = bookingCountRows[0] || { total_bookings: 0 };
        const bookingRevenue = bookingRevenueRows[0] || { total_revenue: 0 };
        const monthlyRevenue = monthlyRevenueRows[0] || { monthly_revenue: 0 };

        res.status(200).json({
            total_users: userCount.total_users,
            total_guides: guideCount.total_guides,
            total_bookings: bookingCount.total_bookings,
            total_bookings_revenue: bookingRevenue.total_revenue || 0,
            monthly_revenue: monthlyRevenue.monthly_revenue || 0
        });
    } catch (err) {
        res.status(500).json({ message: "Error fetching system stats", error: err.message });
    }
};

module.exports = getSystemStats;
