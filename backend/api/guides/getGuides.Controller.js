const { pool } = require("../../config/db");

async function getGuides(req, res) {
  try {
    const {
      location,
      languages,
      specialties, // 🔹 thêm specialties
      minRating,
      priceRange,
      date, // TODO: filter guides theo ngày có sẵn
      page = 1,
      limit = 20,
    } = req.query;

    // Base query (dùng lại cho count và select)
    let baseQuery = `
      FROM guides g
      JOIN users u ON g.user_id = u.id
      WHERE g.verification_status = 'verified'
    `;

    const params = [];

    /** ---------------- FILTERS ---------------- **/

    // Location
    if (location) {
      baseQuery += ` AND g.location LIKE ?`;
      params.push(`%${location}%`);
    }

    // Rating
    if (minRating) {
      const rating = Number(minRating);
      if (!isNaN(rating)) {
        baseQuery += ` AND g.rating >= ?`;
        params.push(rating);
      }
    }

    // Price range (min-max)
    if (priceRange) {
      const [minPrice, maxPrice] = priceRange.split("-").map(Number);
      if (!isNaN(minPrice) && !isNaN(maxPrice)) {
        baseQuery += ` AND g.price_per_hour BETWEEN ? AND ?`;
        params.push(minPrice, maxPrice);
      }
    }

    // Languages (JSON array trong DB)
    if (languages) {
      const langs = languages.split(",").map((l) => l.trim());
      langs.forEach((lang) => {
        baseQuery += ` AND JSON_CONTAINS(g.languages, JSON_QUOTE(?))`;
        params.push(lang);
      });
    }

    // 🔹 Specialties (JSON array trong DB)
    if (specialties) {
      const specs = specialties.split(",").map((s) => s.trim());
      specs.forEach((spec) => {
        baseQuery += ` AND JSON_CONTAINS(g.specialties, JSON_QUOTE(?))`;
        params.push(spec);
      });
    }

    // Date filter (TODO)
    if (date) {
      console.log("📅 Date filter requested:", date, "(chưa implement)");
    }

    /** ---------------- PAGINATION ---------------- **/
    const safeLimit = Math.max(parseInt(limit, 10) || 20, 1);
    const safePage = Math.max(parseInt(page, 10) || 1, 1);
    const offset = (safePage - 1) * safeLimit;

    /** ---------------- COUNT QUERY ---------------- **/
    const [countRows] = await pool.execute(
      `SELECT COUNT(*) as total ${baseQuery}`,
      params
    );
    const total = countRows[0].total;

    // Lấy dữ liệu trang hiện tại
    const [rows] = await pool.execute(
      `
      SELECT 
        g.id,
        u.name AS user_name, 
        u.email AS user_email,
        u.phone,
        g.location,
        g.languages,
        g.specialties, -- 🔹 select thêm specialties
        g.price_per_hour,
        g.experience_years,
        g.description,
        g.certificates,
        g.rating,
        g.total_reviews,
        g.is_available
      ${baseQuery}
      LIMIT ${safeLimit} OFFSET ${offset}
      `,
      params
    );

    res.json({
      guides: rows,
      total,
      page: safePage,
      limit: safeLimit,
      totalPages: Math.ceil(total / safeLimit),
    });
  } catch (err) {
    console.error("Error fetching guides:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}

module.exports = getGuides;
