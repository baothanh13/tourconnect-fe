const { connectToDB } = require("../../config/db");

const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const db = await connectToDB(); // <-- tạo kết nối
    const [rows] = await db.query("SELECT * FROM users WHERE id = ?", [id]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = getUserById;
