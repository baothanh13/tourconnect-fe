const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');

const SECRET_KEY = "mysecretkey";  // Nên đưa vào biến môi trường

const verifyOTP = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: "Thiếu thông tin email!" });
        }

        // Tạo OTP 6 số ngẫu nhiên
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // Tạo token chứa OTP, email (nếu cần lưu tạm thời ở client)
        const otpToken = jwt.sign({ email, otp }, SECRET_KEY, { expiresIn: '5m' });  // Token sống 5 phút

        // Gửi Email OTP
        await sendOTPEmail(email, otp);

        return res.status(200).json({
            message: "OTP đã được gửi về email!",
            token: otpToken,  // Trả về cho client token để xác thực sau
        });

    } catch (error) {
        console.error("Lỗi:", error.message);
        return res.status(500).json({ message: "Lỗi khi gửi OTP!", error: error.message });
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
            pass: "Vinh12@6",  // Cần đưa vào biến môi trường
        },
    });

    const mailOptions = {
        from: '"Bike App" <thanhvinh@zohomail.com>',
        to: toEmail,
        subject: "Mã xác thực OTP của bạn",
        html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: auto; padding: 24px; background-color: #f9fafb; border-radius: 10px; border: 1px solid #e2e8f0;">
            <h2 style="color: #1d4ed8; text-align: center;">🔐 Mã xác thực OTP</h2>
            <p style="font-size: 18px; color: #334155;">Xin chào,</p>
            <p style="font-size: 18px; color: #334155;">Mã OTP của bạn là:</p>
            <h1 style="text-align: center; color: #ef4444; font-size: 36px;">${otp}</h1>
            <p style="font-size: 16px; color: #6b7280;">Mã này có hiệu lực trong 5 phút.</p>
            <p style="font-size: 16px; color: #6b7280;">Nếu bạn không yêu cầu mã OTP này, vui lòng bỏ qua email này.</p>
        </div>
        `,
    };

    await transporter.sendMail(mailOptions);
}

module.exports = verifyOTP;
