const getGuides = async (req, res) => {
    const {
        location,
        language,
        category,
        minRating,
        priceRange,
        available,
        date,
        page = 1,
        limit = 20
    } = req.query;

    try {
        const connection = req.db;
        let query = `
            SELECT g.*
            FROM guides g
        `;
        const params = [];

        if (location) {
            query += ` AND g.location LIKE ?`;
            params.push(`%${location}%`);
        }

        if (language) {
            let langArray;
            try {
                langArray = JSON.parse(language); // ["en", "vi"]
                if (!Array.isArray(langArray)) throw new Error();
            } catch {
                langArray = [language];
            }
            for (const lang of langArray) {
                query += ` AND JSON_CONTAINS(g.languages, ?)`;
                params.push(JSON.stringify(lang));
            }
        }

        if (category) {
            let catArray;
            try {
                catArray = JSON.parse(category);
                if (!Array.isArray(catArray)) throw new Error();
            } catch {
                catArray = [category];
            }
            for (const cat of catArray) {
                query += ` AND JSON_CONTAINS(g.specialties, ?)`;
                params.push(JSON.stringify(cat));
            }
        }

        if (minRating) {
            const rating = Number(minRating);
            if (!isNaN(rating)) {
                query += ` AND g.rating >= ?`;
                params.push(rating);
            }
        }

        if (priceRange) {
            const parts = priceRange.split('-');
            if (parts.length === 2) {
                const [minPrice, maxPrice] = parts.map(Number);
                if (!isNaN(minPrice) && !isNaN(maxPrice)) {
                    query += ` AND g.price_per_hour BETWEEN ? AND ?`;
                    params.push(minPrice, maxPrice);
                }
            }
        }

        if (available === 'true') {
            query += ` AND g.is_available = true`;
        }

        // Parse and validate limit & offset
        const safeLimit = Number(limit);
        const safePage = Number(page);
        const offset = (safePage - 1) * safeLimit;

        if (
            isNaN(safeLimit) || isNaN(offset) ||
            safeLimit <= 0 || safePage <= 0
        ) {
            return res.status(400).json({ message: 'Invalid pagination values' });
        }

        // MySQL does not allow LIMIT ? OFFSET ? as parameters in all configs, so inject directly
        query += ` LIMIT ${safeLimit} OFFSET ${offset}`;

        // 👉 Log for debugging
        console.log('🔍 Final SQL:', query);
        console.log('🧾 Params:', params);

        const [guides] = await connection.execute(query, params);

        const parsedGuides = guides.map(g => ({
            ...g,
            languages: parseJSONField(g.languages),
            specialties: parseJSONField(g.specialties),
            certificates: parseJSONField(g.certificates),
        }));

        return res.json({
            guides: parsedGuides,
            total: parsedGuides.length,
            page: safePage,
            limit: safeLimit
        });
    } catch (err) {
        console.error('❌ Error fetching guides:', err);
        return res.status(500).json({ message: 'Server error' });
    }
};

// Helper to safely parse JSON fields
function parseJSONField(value) {
    try {
        return value ? JSON.parse(value) : [];
    } catch {
        return [];
    }
}

module.exports = getGuides;