const { connectToDB } = require("../../config/db");

// GET /api/users/profile
const getUserProfile = async (req, res) => {
  try {
    const userId = req.user?.id; // lấy từ middleware auth
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const [rows] = await db.query("SELECT id, email, role, name, phone, avatar_url, is_verified, created_at FROM users WHERE id = ?", [userId]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error("Error fetching profile:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = getUserProfile;
