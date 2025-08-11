const { connectToDB } = require('../../config/db');
const { v4: uuidv4 } = require('uuid');

const createGuide = async (req, res) => {
    const { user_id, location, languages, specialties, price_per_hour, experience_years, description, certificates } = req.body;

    try {
        const connection = await connectToDB();

        const guideId = uuidv4();

        await connection.execute(
            `INSERT INTO guides (id, user_id, location, languages, specialties, price_per_hour, experience_years, description, certificates) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [guideId, user_id, location, JSON.stringify(languages), JSON.stringify(specialties), price_per_hour, experience_years, description, JSON.stringify(certificates)]
        );

        return res.status(201).json({ message: 'Guide profile created successfully', guide_id: guideId });
    } catch (err) {
        console.error('Error creating guide profile:', err);
        return res.status(500).json({ message: 'Server error' });
    }
};

module.exports = createGuide;