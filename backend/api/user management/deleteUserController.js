const { connectToDB } = require("../../config/db");

const deleteUserController = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: "User ID is required" });
  }

  try {
    const pool = await connectToDB();

    // Kiểm tra user có tồn tại không
    const checkUser = await pool
      .request()
      .input("id", id)
      .query("SELECT * FROM users WHERE id = @id");

    if (checkUser.recordset.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    // Xóa user
    await pool.request().input("id", id).query("DELETE FROM users WHERE id = @id");

    return res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = deleteUserController;
