const { connectToDB } = require("../../config/db");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");

const SECRET_KEY = process.env.SECRET_KEY;

function isValidEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

// Bước 1: Gửi OTP về email
const sendForgotPasswordOTP = async (req, res) => {
  const { email } = req.body;
  if (!isValidEmail(email)) {
    return res.status(400).json({ message: "Invalid email format" });
  }

  try {
    const connection = await connectToDB();
    const [users] = await connection.execute(
      `SELECT * FROM users WHERE email = ?`,
      [email]
    );
    if (users.length === 0) {
      return res.status(404).json({ message: "Email not found" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpToken = jwt.sign({ email, otp }, SECRET_KEY, { expiresIn: "5m" });

    await sendOTPEmail(email, otp);

    return res.status(200).json({
      message: "OTP has been sent to your email.",
      otpToken,
    });
  } catch (err) {
    console.error("Forgot Password Error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// Bước 2: Xác nhận OTP và đổi mật khẩu mới
const resetPassword = async (req, res) => {
  const { otp, token, newPassword } = req.body;
  if (!otp || !token || !newPassword) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    if (decoded.otp !== otp) {
      return res.status(401).json({ message: "OTP is not correct!" });
    }

    const connection = await connectToDB();
    const password_hash = await bcrypt.hash(newPassword, 10);

    await connection.execute(
      `UPDATE users SET password_hash = ? WHERE email = ?`,
      [password_hash, decoded.email]
    );

    return res.status(200).json({ message: "Password has been reset successfully!" });
  } catch (err) {
    console.error("Reset Password Error:", err);
    return res.status(400).json({ message: "Token expired or invalid!", error: err.message });
  }
};

// Hàm gửi OTP qua email
async function sendOTPEmail(toEmail, otp) {
  const transporter = nodemailer.createTransport({
    service: "zoho",
    host: "smtpro.zoho.in",
    port: 465,
    secure: true,
    auth: {
      user: "thanhvinh@zohomail.com",
      pass: "Vinh12@6", // Đưa vào .env sau
    },
  });

  const mailOptions = {
    from: '"TourConnect" <thanhvinh@zohomail.com>',
    to: toEmail,
    subject: "Your Password Reset OTP",
    html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: auto; padding: 24px; background-color: #f9fafb; border-radius: 10px; border: 1px solid #e2e8f0;">
            <h2 style="color: #1d4ed8; text-align: center;">🔐OTP Verification Code</h2>
            <p style="font-size: 18px; color: #334155;">Hello,</p>
            <p style="font-size: 18px; color: #334155;">Your OTP code is:</p>
            <h1 style="text-align: center; color: #ef4444; font-size: 36px;">${otp}</h1>
            <p style="font-size: 16px; color: #6b7280;">This code is valid for 5 minutes.</p>
        </div>
        `,
  };

  await transporter.sendMail(mailOptions);
}

module.exports = {
  sendForgotPasswordOTP,
  resetPassword,
};