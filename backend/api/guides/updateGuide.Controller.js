const { connectToDB } = require('../../config/db');

const updateGuide = async (req, res) => {
    const { id } = req.params;
    const { location, languages, specialties, price_per_hour, experience_years, description, certificates } = req.body;

    try {
        const connection = await connectToDB();

        await connection.execute(
            `UPDATE guides SET location = ?, languages = ?, specialties = ?, price_per_hour = ?, experience_years = ?, description = ?, certificates = ? WHERE id = ?`,
            [location, JSON.stringify(languages), JSON.stringify(specialties), price_per_hour, experience_years, description, JSON.stringify(certificates), id]
        );

        return res.json({ message: 'Guide profile updated successfully' });
    } catch (err) {
        console.error('Error updating guide:', err);
        return res.status(500).json({ message: 'Server error' });
    }
};

module.exports = updateGuide;