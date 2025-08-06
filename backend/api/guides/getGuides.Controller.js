const { connectToDB } = require('../../config/db');

const getGuides = async (req, res) => {
    const { location, language, category, minRating, priceRange, available, date, page = 1, limit = 20 } = req.query;

    try {
        const connection = await connectToDB();
        let query = `SELECT g.*, u.name, u.avatar_url FROM guides g JOIN users u ON g.user_id = u.id WHERE 1=1`;
        const params = [];

        if (location) {
            query += ` AND g.location LIKE ?`;
            params.push(`%${location}%`);
        }
        if (language) {
            query += ` AND JSON_CONTAINS(g.languages, '"${language}"')`;
        }
        if (category) {
            query += ` AND JSON_CONTAINS(g.specialties, '"${category}"')`;
        }
        if (minRating) {
            query += ` AND g.rating >= ?`;
            params.push(minRating);
        }
        if (priceRange) {
            const [minPrice, maxPrice] = priceRange.split('-');
            query += ` AND g.price_per_hour BETWEEN ? AND ?`;
            params.push(minPrice, maxPrice);
        }
        if (available === 'true') {
            query += ` AND g.is_available = true`;
        }

        const offset = (page - 1) * limit;
        query += ` LIMIT ? OFFSET ?`;
        params.push(Number(limit), Number(offset));

        const [guides] = await connection.execute(query, params);
        
        return res.json({
            guides,
            total: guides.length,  // TODO: Query total count separately if needed
            page: Number(page),
            limit: Number(limit)
        });
    } catch (err) {
        console.error('Error fetching guides:', err);
        return res.status(500).json({ message: 'Server error' });
    }
};

module.exports = getGuides;