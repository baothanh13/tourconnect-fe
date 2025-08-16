const { connectToDB } = require("../../config/db");

const getAllUsers = async (req, res) => {
    try {
        const connection = await connectToDB();
        const [rows] = await connection.execute(
            "SELECT * FROM users"
        );
        res.status(200).json(rows);
    } catch (err) {
        res.status(500).json({ message: "Error fetching users", error: err.message });
    }
};

module.exports = getAllUsers;
