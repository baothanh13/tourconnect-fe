const { connectToDB } = require("../../config/db");

const updateUserStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!status) {
            return res.status(400).json({ message: "Status is required" });
        }

        const connection = await connectToDB();
        await connection.execute(
            "UPDATE users SET is_active = ? WHERE id = ?",
            [status, id]
        );

        res.status(200).json({ message: "User status updated successfully" });
    } catch (err) {
        res.status(500).json({ message: "Error updating user status", error: err.message });
    }
};

module.exports = updateUserStatus;
