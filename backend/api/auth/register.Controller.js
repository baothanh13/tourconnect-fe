const { connectToDB } = require("../../config/db");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

const SECRET_KEY = process.env.SECRET_KEY;  // Đưa vào .env sau này

function isValidEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

const register = async (req, res) => {
  const { email, role } = req.body;

  const allowedRoles = ["tourist", "guide", "admin", "support"];

  if (!allowedRoles.includes(role)) {
    return res.status(400).json({ message: "Invalid role" });
  }

  if (!isValidEmail(email)) {
    return res.status(400).json({ message: "Invalid email format" });
  }

  try {
    const connection = await connectToDB();

    // Kiểm tra Email đã tồn tại chưa
    const [existingUsers] = await connection.execute(
      `SELECT * FROM users WHERE email = ?`,
      [email]
    );

    if (existingUsers.length > 0) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Tạo OTP 6 số ngẫu nhiên
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Tạo Token chứa OTP + email, sống 5 phút
    const otpToken = jwt.sign({ email, otp, role, ...req.body }, SECRET_KEY, { expiresIn: "5m" });

    // Gửi Email OTP ngay sau khi đăng ký
    await sendOTPEmail(email, otp);

    return res.status(201).json({
      message: "OTP has been sent to your email for verification.",
      otpToken
    });
  } catch (err) {
    console.error("Registration Error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// =============================
// ======= sendOTPEmail() ======
// =============================
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
    subject: "Your OTP Verification Code",
    html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: auto; padding: 24px; background-color: #f9fafb; border-radius: 10px; border: 1px solid #e2e8f0;">
            <h2 style="color: #1d4ed8; text-align: center;">🔐OTP Verification Code</h2>
            <p style="font-size: 18px; color: #334155;">Hello,</p>
            <p style="font-size: 18px; color: #334155;">Your OTP Verification Code is:</p>
            <h1 style="text-align: center; color: #ef4444; font-size: 36px;">${otp}</h1>
            <p style="font-size: 16px; color: #6b7280;">This code is valid for 5 minutes.</p>
            <p style="font-size: 16px; color: #6b7280;">Thank you and have a good day.</p>
        </div>
        `,
  };

  await transporter.sendMail(mailOptions);
}

module.exports = register;