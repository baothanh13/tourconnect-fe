const { connectToDB } = require("../../config/db");

// PUT /api/users/profile
const updateUserProfile = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { name, phone, avatar_url } = req.body;

    await db.query(
      "UPDATE users SET name = ?, phone = ?, avatar_url = ?, updated_at = NOW() WHERE id = ?",
      [name, phone, avatar_url, userId]
    );

    res.json({ message: "Profile updated successfully" });
  } catch (err) {
    console.error("Error updating profile:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = updateUserProfile;