const { pool } = require("../../config/db");

async function getGuides(req, res) {
  try {
    const {
      location,
      languages,
      language, // Support both parameter names for backward compatibility
      specialties, // 🔹 thêm specialties
      category,   // 🔹 thêm specialties
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

    // Languages (JSON array trong DB) - support both parameter names
    const languagesParam = languages || language;
    if (languagesParam) {
      let langs;
      // Handle both comma-separated string and JSON string
      if (languagesParam.startsWith("[")) {
        try {
          langs = JSON.parse(languagesParam);
        } catch (e) {
          langs = languagesParam.split(",").map((l) => l.trim());
        }
      } else {
        langs = languagesParam.split(",").map((l) => l.trim());
      }
      
      langs.forEach((lang) => {
        baseQuery += ` AND JSON_CONTAINS(g.languages, JSON_QUOTE(?))`;
        params.push(lang);
      });
    }

    // 🔹 Specialties (JSON array trong DB) - support both parameter names
    const specialtiesParam = specialties || category;
    if (specialtiesParam) {
      let specs;
      // Handle both comma-separated string and JSON string
      if (specialtiesParam.startsWith("[")) {
        try {
          specs = JSON.parse(specialtiesParam);
        } catch (e) {
          specs = specialtiesParam.split(",").map((s) => s.trim());
        }
      } else {
        specs = specialtiesParam.split(",").map((s) => s.trim());
      }
      
      specs.forEach((spec) => {
        baseQuery += ` AND JSON_CONTAINS(g.specialties, JSON_QUOTE(?))`;
        params.push(spec);
      });
    }

    // Date filter (TODO)
    if (date) {
      // Ví dụ: Kiểm tra xem guide có sẵn vào ngày cụ thể không
      // query += ` AND g.id NOT IN (
      //     SELECT DISTINCT g2.id FROM guides g2
      //     JOIN bookings b ON g2.id = b.guide_id
      //     WHERE DATE(b.tour_date) = ? AND b.status IN ('confirmed', 'pending')
      // )`;
      // params.push(date);
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
        u.avatar_url,
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
    console.error("❌ Error fetching guides:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// Helper to safely parse JSON fields
function parseJSONField(value) {
  // If value is already an array/object (MySQL JSON field), return as-is
  if (Array.isArray(value) || (value && typeof value === "object")) {
    return value;
  }

  // If it's a string, try to parse it
  if (typeof value === "string") {
    try {
      return JSON.parse(value);
    } catch {
      return [];
    }
  }

  // Default to empty array for null/undefined
  return [];
}

module.exports = getGuides;
