const { connectToDB } = require('../../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const SECRET_KEY = 'your_secret_key';  // Nên dùng biến môi trường .env

const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const connection = await connectToDB();

        // Tìm user theo email
        const [users] = await connection.execute(
            `SELECT * FROM User WHERE email = ?`,
            [email]
        );

        if (users.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        const user = users[0];

        // So sánh password hash
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Tạo JWT Token
        const token = jwt.sign(
            { user_id: user.user_id, username: user.username, role: user.role },
            SECRET_KEY,
            { expiresIn: '2h' }
        );

        return res.json({
            message: 'Login successful',
            token,
            user: {
                user_id: user.user_id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        });

    } catch (err) {
        console.error('Login Error:', err);
        return res.status(500).json({ message: 'Server error' });
    }
};

module.exports = login;
