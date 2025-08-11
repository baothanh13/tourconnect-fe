const jwt = require('jsonwebtoken');
const SECRET_KEY = "mysecretkey";  // Đưa vào .env thực tế
const { connectToDB } = require('../../config/db');

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

        // Cập nhật is_verified = true
        await connection.execute(
            `UPDATE users SET is_verified = ? WHERE email = ?`,
            [1, decoded.email]
        );
        // Trả về thông tin xác thực thành công
        return res.status(200).json({
            message: "Successfully registered and verified!",
            email: decoded.email,
        });

    } catch (error) {
        console.error("Error:", error.message);
        return res.status(400).json({
            message: "Token has expired or is invalid!",
            error: error.message,
        });
    }
};

module.exports = confirmOTP;
