const { query } = require("../../config/db");

const getAllBookings = async (req, res) => {
    try {
        const rows = await query(
            `SELECT *
             FROM bookings b`
        );
        res.status(200).json(rows);
    } catch (err) {
        res.status(500).json({ message: "Error fetching bookings", error: err.message });
    }
};

module.exports = getAllBookings;
