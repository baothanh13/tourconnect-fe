const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.SECRET_KEY; // Đưa vào .env thực tế
const { connectToDB } = require("../../config/db");
const bcrypt = require("bcrypt");
const generateId = require("../../utils/generateId");
const confirmOTP = async (req, res) => {
  try {
    const { otp, token } = req.body;

    if (!otp || !token) {
      return res.status(400).json({ message: "OTP or Token is missing!" });
    }

    const decoded = jwt.verify(token, SECRET_KEY);

    if (decoded.otp !== otp) {
      return res.status(401).json({ message: "OTP is not correct!" });
    }

    const connection = await connectToDB();

    // Kiểm tra email đã tồn tại chưa
    const [existingUsers] = await connection.execute(
      `SELECT * FROM users WHERE email = ?`,
      [decoded.email]
    );
    if (existingUsers.length > 0) {
      return res.status(400).json({ message: "Email already exists!" });
    }

    // Hash password nếu có
    let password_hash = null;
    if (decoded.password) {
      password_hash = await bcrypt.hash(decoded.password, 10);
    }

    // Tạo user_id
    const userId = generateId("user");

    // Insert vào bảng users
    await connection.execute(
      `INSERT INTO users (id, email, password_hash, role, name, phone) VALUES (?, ?, ?, ?, ?, ?)`,
      [
        userId,
        decoded.email,
        password_hash,
        decoded.role,
        decoded.name || null,
        decoded.phone || null,
      ]
    );

    // Nếu là guide, insert vào bảng guides (nếu có thông tin)
    if (decoded.role === "guide" && decoded.city && decoded.specialties) {
      const guideId = generateId("guide");
      const guideSpecialties = Array.isArray(decoded.specialties)
        ? decoded.specialties
        : [decoded.specialties];

      await connection.execute(
        `INSERT INTO guides (
                    id, user_id, location, languages, specialties, 
                    price_per_hour, experience_years, description, 
                    rating, total_reviews, is_available, verification_status
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          guideId,
          userId,
          decoded.city,
          JSON.stringify(["Vietnamese"]),
          JSON.stringify(guideSpecialties),
          0,
          0,
          decoded.bio || "",
          0.0,
          0,
          1,
          "pending",
        ]
      );
    }

    // Trả về thông tin xác thực thành công
    return res.status(200).json({
      message: "Successfully registered and verified!",
      email: decoded.email,
    });
  } catch (error) {
    return res.status(400).json({
      message: "Token has expired or is invalid!",
      error: error.message,
    });
  }
};

module.exports = confirmOTP;
