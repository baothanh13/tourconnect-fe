const { connectToDB } = require('../../config/db');

// GET /api/auth/me
const getProfile = async (req, res) => {
    const userId = req.user.id;  // Lấy id từ token đã decode (middleware verifyToken)

    try {
        const connection = await connectToDB();

        const [users] = await connection.execute(
            `SELECT * FROM users WHERE id = ?`,
            [userId]
        );

        if (users.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        return res.json({ user: users[0] });

    } catch (err) {
        console.error('Get Profile Error:', err);
        return res.status(500).json({ message: 'Server error' });
    }
};

// PUT /api/auth/profile
const updateProfile = async (req, res) => {
    const userId = req.user.user_id;  // Lấy user_id từ token đã decode
    const { name, phone, avatar_url } = req.body;

    try {
        const connection = await connectToDB();

        await connection.execute(
            `UPDATE users 
             SET name = ?, phone = ?, avatar_url = ?, updated_at = CURRENT_TIMESTAMP 
             WHERE id = ?`,
            [name, phone, avatar_url, userId]
        );

        return res.json({ message: 'Profile updated successfully' });

    } catch (err) {
        console.error('Update Profile Error:', err);
        return res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { getProfile, updateProfile };
