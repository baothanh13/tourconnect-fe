const getGuides = async (req, res) => {
    const {
        location,
        language,
        category,
        minRating,
        priceRange,
        available,
        date, // TODO: Sử dụng để filter guides theo ngày có sẵn
        page = 1,
        limit = 20
    } = req.query;

    try {
        const connection = req.db;
        let query = `
            SELECT 
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
            FROM guides g
            JOIN users u ON g.user_id = u.id
            WHERE verification_status = 'verified';
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

        // TODO: Filter theo ngày có sẵn (cần implement logic kiểm tra lịch của guide)
        if (date) {
            // Ví dụ: Kiểm tra xem guide có sẵn vào ngày cụ thể không
            // query += ` AND g.id NOT IN (
            //     SELECT DISTINCT g2.id FROM guides g2 
            //     JOIN bookings b ON g2.id = b.guide_id 
            //     WHERE DATE(b.tour_date) = ? AND b.status IN ('confirmed', 'pending')
            // )`;
            // params.push(date);
            console.log('📅 Date filter requested:', date, '(chưa implement)');
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