const { connectToDB } = require("../../config/db");
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");

// Danh sách role hợp lệ theo schema DB
const ALLOWED_ROLES = ["tourist", "guide", "admin", "support"];

// Regex email đơn giản, đủ dùng cho validate cơ bản
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/i;

/**
 * POST /api/admin/users
 * body: { email, password, role, name, phone?, avatar_url? }
 */
const createUserController = async (req, res) => {
  try {
    const { email, password, role, name, phone = null, avatar_url = null } = req.body || {};

    // 1) Validate đầu vào
    if (!email || !password || !role || !name) {
      return res.status(400).json({ message: "email, password, role, name are required" });
    }
    if (!EMAIL_REGEX.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }
    if (!ALLOWED_ROLES.includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }
    if (String(password).length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const conn = await connectToDB();

    // 2) Check email đã tồn tại (unique)
    const [exists] = await conn.execute(
      "SELECT id FROM users WHERE email = ? LIMIT 1",
      [email]
    );
    if (exists.length > 0) {
      return res.status(409).json({ message: "Email already exists" });
    }

    // 3) Hash password
    const password_hash = await bcrypt.hash(password, 10);

    // 4) Tạo user ID (UUID v4)
    const id = uuidv4();

    // 5) Insert
    await conn.execute(
      `INSERT INTO users
        (id, email, password_hash, role, name, phone, avatar_url)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [id, email, password_hash, role, name, phone, avatar_url]
    );

    // 6) Trả kết quả
    return res.status(201).json({
      message: "User created successfully",
      user: {
        id,
        email,
        role,
        name,
        phone,
        avatar_url
      }
    });
  } catch (error) {
    console.error("CreateUser (Admin) error:", error);
    // Phòng trường hợp race condition với unique email
    if (error?.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ message: "Email already exists" });
    }
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = createUserController;
