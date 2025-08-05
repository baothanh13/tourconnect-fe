const { connectToDB } = require('../../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const SECRET_KEY = 'mysecretkey';  // Nên dùng biến môi trường .env

const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const connection = await connectToDB();

        // Tìm user theo email
        const [users] = await connection.execute(
            `SELECT * FROM users WHERE email = ?`,
            [email]
        );

        if (users.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        const user = users[0];

        // So sánh password hash
        const isMatch = await bcrypt.compare(password, user.password_hash);

        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

         // Tạo JWT Token (field: id, name, role)
        const token = jwt.sign(
            { user_id: user.id, name: user.name, role: user.role },
            SECRET_KEY,
            { expiresIn: '2h' }
        );

        return res.json({
            message: 'Login successful',
            token,
            user: {
                user_id: user.id,
                name: user.name,
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
