const { pool } = require("../../config/db");

async function getGuides(req, res) {
  try {
    const {
      location,
      minRating,
      priceRange,
      date, // TODO: filter guides theo ngày có sẵn
      page = 1,
      limit = 20,
    } = req.query;

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
        g.is_available
      FROM guides g
      JOIN users u ON g.user_id = u.id
      WHERE g.verification_status = 'verified'
    `;
    const params = [];

    if (location) {
      query += ` AND g.location LIKE ?`;
      params.push(`%${location}%`);
    }

    if (minRating) {
      const rating = Number(minRating);
      if (!isNaN(rating)) {
        query += ` AND g.rating >= ?`;
        params.push(rating);
      }
    }

    if (priceRange) {
      const parts = priceRange.split("-");
      if (parts.length === 2) {
        const [minPrice, maxPrice] = parts.map(Number);
        if (!isNaN(minPrice) && !isNaN(maxPrice)) {
          query += ` AND g.price_per_hour BETWEEN ? AND ?`;
          params.push(minPrice, maxPrice);
        }
      }
    }

    if (date) {
      console.log("📅 Date filter requested:", date, "(chưa implement)");
    }

    // Pagination
    const safeLimit = Number(limit);
    const safePage = Number(page);
    const offset = (safePage - 1) * safeLimit;

    if (
      isNaN(safeLimit) ||
      isNaN(offset) ||
      safeLimit <= 0 ||
      safePage <= 0
    ) {
      return res.status(400).json({ message: "Invalid pagination values" });
    }

    query += ` LIMIT ${safeLimit} OFFSET ${offset}`;

    const [rows] = await pool.execute(query, params);

    res.json({
      guides: rows,
      total: rows.length,
      page: safePage,
      limit: safeLimit,
    });
  } catch (err) {
    console.error("Error fetching guides:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}

module.exports = getGuides;
