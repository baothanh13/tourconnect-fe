const { query } = require("../../config/db");

const getAllGuides = async (req, res) => {
  try {
    const rows = await query(
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
            JOIN users u ON g.user_id = u.id`
    );

    res.status(200).json(rows);
  } catch (err) {
    res.status(500).json({
      message: "Error fetching guides",
      error: err.message,
    });
  }
};

module.exports = getAllGuides;
