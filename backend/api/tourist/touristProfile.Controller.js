const { connectToDB } = require("../../config/db");

const getTouristProfile = async (req, res) => {
  const userId = req.user.user_id; // ✅ phải dùng user_id

  try {
    const connection = await connectToDB();

    const [users] = await connection.execute(
      `SELECT email, name, phone, role, created_at, updated_at FROM users WHERE id = ?`,
      [userId]
    );

    if (users.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json({ user: users[0] });
  } catch (err) {
    console.error("Get Profile Error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};


const updateTouristProfile = async (req, res) => {
  const userId = req.user.user_id; // ✅ cũng dùng user_id
  const { name, phone } = req.body;

  try {
    const connection = await connectToDB();

    await connection.execute(
      `UPDATE users 
       SET name = ?, phone = ?, updated_at = CURRENT_TIMESTAMP 
       WHERE id = ?`,
      [name, phone, userId]
    );

    
    return res.json({ message: "Profile updated successfully" });
  } catch (err) {
    console.error("Update Profile Error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = { getTouristProfile, updateTouristProfile };
