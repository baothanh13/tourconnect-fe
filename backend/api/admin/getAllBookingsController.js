const { query } = require("../../config/db");

const getAllBookings = async (req, res) => {
    try {
        const rows = await query(
            `SELECT 
                b.*,
                tourist.name AS tourist_name,
                guide_user.name AS guide_name
            FROM bookings b
            LEFT JOIN users tourist ON b.tourist_id = tourist.id
            LEFT JOIN guides g ON b.guide_id = g.id
            LEFT JOIN users guide_user ON g.user_id = guide_user.id;`
        );
        res.status(200).json(rows);
    } catch (err) {
        res.status(500).json({ message: "Error fetching bookings", error: err.message });
    }
};

module.exports = getAllBookings;
