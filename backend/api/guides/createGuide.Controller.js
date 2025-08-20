const { connectToDB } = require('../../config/db');
const generateId = require('../../utils/generateId');

const createGuide = async (req, res) => {
    const {location, languages, specialties, price_per_hour, experience_years, description, certificates } = req.body;

    try {
        const connection = await connectToDB();

        const userId = req.user.user_id;  // Lấy user_id từ token đã decode
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized: Missing user ID' });
        }

        // ✅ Sinh guide_id mới
         const guideId = generateId('guide');
        await connection.execute(
            `INSERT INTO guides (id, user_id, location, languages, specialties, price_per_hour, experience_years, description, certificates) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [guideId, userId, location, JSON.stringify(languages), JSON.stringify(specialties), price_per_hour, experience_years, description, JSON.stringify(certificates)]
        );

        return res.status(201).json({ message: 'Guide profile created successfully', guide_id: guideId });
    } catch (err) {
        console.error('Error creating guide profile:', err);
        return res.status(500).json({ message: 'Server error' });
    }
};

module.exports = createGuide;