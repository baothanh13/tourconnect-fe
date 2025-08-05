const { connectToDB } = require('../../config/db');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');

const SECRET_KEY = 'mysecretkey';  // Đưa vào .env sau này

const register = async (req, res) => {
    const { name, email, password, phone, role } = req.body;

    const allowedRoles = ['tourist', 'guide'];

    if (!allowedRoles.includes(role)) {
        return res.status(400).json({ message: 'Invalid role' });
    }

    try {
        const connection = await connectToDB();

        // Kiểm tra Email đã tồn tại chưa
        const [existingUsers] = await connection.execute(
            `SELECT * FROM users WHERE email = ?`,
            [email]
        );

        if (existingUsers.length > 0) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        // Hash password
        const password_hash = await bcrypt.hash(password, 10);

        // Generate UUID
        const userId = uuidv4();

        // Insert into users table
        await connection.execute(
           `INSERT INTO users (id, email, password_hash, role, name, phone) VALUES (?, ?, ?, ?, ?, ?)`,
            [userId, email, password_hash, role, name, phone]
        );

        // Tạo OTP 6 số ngẫu nhiên
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // Tạo Token chứa OTP + email, sống 5 phút
        const otpToken = jwt.sign(
            { email, otp },
            SECRET_KEY,
            { expiresIn: '5m' }
        );

        // (Chưa gửi Email OTP, bước đó bạn sẽ gọi API /verify-otp sau)
        return res.status(201).json({
            message: 'Registration successful, please verify OTP sent to email',
            otpToken,
            user_id: userId
        });

    } catch (err) {
        console.error('Registration Error:', err);
        return res.status(500).json({ message: 'Server error' });
    }
};

module.exports = register;
