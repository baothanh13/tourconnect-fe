const { query } = require("../../config/db");

const getAllUsers = async (req, res) => {
    try {
        const rows = await query(
            "SELECT * FROM users WHERE role IN ('tourist', 'guide', 'support');"
        );
        res.status(200).json(rows);
    } catch (err) {
        res.status(500).json({ message: "Error fetching users", error: err.message });
    }
};

module.exports = getAllUsers;