const { connectToDB } = require("../../config/db");

const getSystemStats = async (req, res) => {
    try {
        const connection = await connectToDB();

        const [[userCount]] = await connection.execute("SELECT COUNT(*) AS total_users FROM users");
        const [[guideCount]] = await connection.execute("SELECT COUNT(*) AS total_guides FROM guides");
        const [[bookingCount]] = await connection.execute("SELECT COUNT(*) AS total_bookings FROM bookings");

        res.status(200).json({
            total_users: userCount.total_users,
            total_guides: guideCount.total_guides,
            total_bookings: bookingCount.total_bookings
        });
    } catch (err) {
        res.status(500).json({ message: "Error fetching system stats", error: err.message });
    }
};

module.exports = getSystemStats;
