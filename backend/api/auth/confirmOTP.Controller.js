const jwt = require('jsonwebtoken');
const SECRET_KEY = "mysecretkey";  // Đưa vào .env thực tế

const confirmOTP = async (req, res) => {
    try {
        const { otp, token } = req.body;

        if (!otp || !token) {
            return res.status(400).json({ message: "Thiếu thông tin OTP hoặc Token!" });
        }

        const decoded = jwt.verify(token, SECRET_KEY);

        if (decoded.otp !== otp) {
            return res.status(401).json({ message: "OTP không chính xác!" });
        }

        return res.status(200).json({
            message: "Xác thực OTP thành công!",
            email: decoded.email,
        });

    } catch (error) {
        console.error("Lỗi:", error.message);
        return res.status(400).json({
            message: "Token hết hạn hoặc không hợp lệ!",
            error: error.message,
        });
    }
};

module.exports = confirmOTP;
