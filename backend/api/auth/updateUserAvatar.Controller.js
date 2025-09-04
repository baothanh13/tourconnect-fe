const { pool } = require("../../config/db");

const updateUserAvatar = async (req, res) => {
  console.log("updateUserAvatar called with params:", req.params);
  console.log("updateUserAvatar called with body:", req.body);

  try {
    const { userId } = req.params;
    const { avatar_url } = req.body;

    // Validate input
    if (!avatar_url) {
      return res.status(400).json({
        success: false,
        message: "Avatar URL is required",
      });
    }

    // Verify that the user exists
    const [userCheck] = await pool.execute(
      "SELECT id FROM users WHERE id = ?",
      [userId]
    );

    if (userCheck.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Update user avatar
    const [result] = await pool.execute(
      "UPDATE users SET avatar_url = ?, updated_at = NOW() WHERE id = ?",
      [avatar_url, userId]
    );

    if (result.affectedRows === 0) {
      return res.status(400).json({
        success: false,
        message: "Failed to update avatar",
      });
    }

    // Fetch updated user info
    const [updatedUser] = await pool.execute(
      "SELECT id, name, email, phone, avatar_url, role FROM users WHERE id = ?",
      [userId]
    );

    res.json({
      success: true,
      message: "Avatar updated successfully",
      data: {
        user: updatedUser[0],
      },
    });
  } catch (err) {
    console.error("Error updating user avatar:", err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = updateUserAvatar;
