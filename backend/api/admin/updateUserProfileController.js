const { connectToDB } = require("../../config/db");

// PUT /api/admin/users/:id/profile
const updateUserProfile = async (req, res) => {
  try {
    const { id } = req.params; // lấy user id từ URL
    const { name, phone, avatar_url, is_active, is_verified, role } = req.body;

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

    // Build dynamic update query
    const updateFields = [];
    const updateValues = [];

    if (name !== undefined) {
      updateFields.push("name = ?");
      updateValues.push(name);
    }

    if (phone !== undefined) {
      updateFields.push("phone = ?");
      updateValues.push(phone);
    }

    if (avatar_url !== undefined) {
      updateFields.push("avatar_url = ?");
      updateValues.push(avatar_url);
    }

    if (is_active !== undefined) {
      updateFields.push("is_active = ?");
      updateValues.push(is_active);
    }

    if (is_verified !== undefined) {
      updateFields.push("is_verified = ?");
      updateValues.push(is_verified);
    }

    if (role !== undefined) {
      updateFields.push("role = ?");
      updateValues.push(role);
    }

    // Always update the timestamp
    updateFields.push("updated_at = NOW()");
    updateValues.push(id); // for WHERE clause

    if (updateFields.length === 1) {
      // Only has updated_at
      return res.status(400).json({ message: "No fields to update" });
    }

    // Update user
    const query = `UPDATE users SET ${updateFields.join(", ")} WHERE id = ?`;
    await connection.execute(query, updateValues);

    return res.json({ message: "Profile updated successfully" });
  } catch (err) {
    console.error("Error updating profile:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = updateUserProfile;
