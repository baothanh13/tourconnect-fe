const {connectToDB} = require('../../config/db');
const getFavGuides = async (req, res) => {
    const touristId = req.user.user_id; // Lấy user_id từ token đã decode
    try {
        const connection = await connectToDB();
        const [favGuides] = await connection.execute(
            `SELECT
                g.id,
                u.name AS user_name, 
                u.email AS user_email,
                u.phone,
                g.location,
                g.languages,
                g.specialties,
                g.price_per_hour,
                g.experience_years,
                g.description,
                g.certificates,
                g.rating,
                g.total_reviews,
                g.is_available,
                g.current_location
            FROM guides g
            JOIN users u ON g.user_id = u.id
            JOIN favourite_guides fg ON g.id = fg.guide_id
            WHERE fg.tourist_id = ?`,
            [touristId]
        );
        return res.status(200).json({ favouriteGuides: favGuides });
    }
    catch (err) {
        console.error('Get Favourite Guides Error:', err);
        return res.status(500).json({ message: 'Server error' });
    }
};

module.exports = getFavGuides;