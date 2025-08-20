const { connectToDB } = require("../../config/db");

// PUT /api/users/:id/profile
const updateUserProfile = async (req, res) => {
  try {
    const { id } = req.params; // lấy user id từ URL
    const { name, phone, avatar_url } = req.body;

    // Kết nối DB
    const connection = await connectToDB();

    // Kiểm tra user tồn tại không
    const [users] = await connection.execute(
      "SELECT id FROM users WHERE id = ?",
      [id]
    );

    if (users.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update user
    await connection.execute(
      "UPDATE users SET name = ?, phone = ?, avatar_url = ?, updated_at = NOW() WHERE id = ?",
      [name, phone, avatar_url, id]
    );

    return res.json({ message: "Profile updated successfully" });
  } catch (err) {
    console.error("Error updating profile:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = updateUserProfile;
