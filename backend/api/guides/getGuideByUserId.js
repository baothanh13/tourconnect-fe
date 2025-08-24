const { connectToDB } = require('../../config/db');

const getGuideById = async (req, res) => {
    const { id } = req.params;

    try {
        const connection = await connectToDB();

        const [guides] = await connection.execute(
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
              g.current_location,
              g.verification_status
            FROM guides g
            JOIN users u ON g.user_id = u.id
            WHERE g.id = ?;`,
            [id]
        );

        if (guides.length === 0) {
            return res.status(404).json({ message: 'Guide not found' });
        }

        const guide = guides[0];

        // Luôn thêm field guide_id cho frontend dùng
        return res.json({
            ...guide,
            guide_id: guide.id,
        });
    } catch (err) {
        console.error('Error fetching guide:', err);
        return res.status(500).json({ message: 'Server error' });
    }
};

module.exports = getGuideById;
