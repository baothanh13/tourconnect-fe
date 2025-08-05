const { connectToDB } = require('../../config/db');
const bcrypt = require('bcrypt');

const register = async (req, res) => {
    const { username, email, password, phone, role } = req.body;

    const allowedRoles = ['customer', 'guide'];  // Admin không được phép tự đăng ký

    if (!allowedRoles.includes(role)) {
        return res.status(400).json({ message: 'Invalid role' });
    }

    try {
        const connection = await connectToDB();

        // Kiểm tra Username hoặc Email đã tồn tại chưa
        const [existingUsers] = await connection.execute(
            `SELECT * FROM user WHERE username = ? OR email = ?`,
            [username, email]
        );

        if (existingUsers.length > 0) {
            return res.status(400).json({ message: 'Username or Email already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert User
        const [result] = await connection.execute(
            `INSERT INTO user (username, email, password, phone, role) VALUES (?, ?, ?, ?, ?)`,
            [username, email, hashedPassword, phone, role]
        );

        return res.status(201).json({ message: 'Registration successful', user_id: result.insertId });

    } catch (err) {
        console.error('Registration Error:', err);
        return res.status(500).json({ message: 'Server error' });
    }
};

module.exports = register;
