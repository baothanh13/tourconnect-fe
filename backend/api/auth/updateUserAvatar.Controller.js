const { pool } = require("../../config/db");
const path = require("path");
const fs = require("fs");
const url = require("url");

const updateUserAvatar = async (req, res) => {
  console.log("updateUserAvatar called with params:", req.params);
  console.log("Uploaded file:", req.file);

  try {
    const { userId } = req.params;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Avatar file is required",
      });
    }

    // ✅ Tạo full URL để client load ảnh
    const avatarUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;

    // Lấy avatar cũ của user
    const [userCheck] = await pool.execute(
      "SELECT id, avatar_url FROM users WHERE id = ?",
      [userId]
    );

    if (userCheck.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const oldAvatar = userCheck[0].avatar_url;

    // ✅ Nếu có avatar cũ thì xóa file cũ trong /uploads
    if (oldAvatar) {
      try {
        const oldPathRelative = url.parse(oldAvatar).pathname; // => "/uploads/xxx.png"
        if (oldPathRelative && oldPathRelative.startsWith("/uploads/")) {
          const oldPath = path.join(__dirname, "../../", oldPathRelative);
          fs.unlink(oldPath, (err) => {
            if (err) {
              console.warn("⚠️ Failed to delete old avatar:", err.message);
            } else {
              console.log("✅ Old avatar deleted:", oldPath);
            }
          });
        }
      } catch (e) {
        console.warn("⚠️ Error parsing old avatar URL:", e.message);
      }
    }

    // ✅ Update DB với avatar mới
    const [result] = await pool.execute(
      "UPDATE users SET avatar_url = ?, updated_at = NOW() WHERE id = ?",
      [avatarUrl, userId]
    );

    if (result.affectedRows === 0) {
      return res.status(400).json({
        success: false,
        message: "Failed to update avatar",
      });
    }

    // ✅ Fetch user mới
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
