const { pool } = require("../../config/db");

async function getGuideByUserId(req, res) {
  try {
    const { userId } = req.params;
    const [rows] = await pool.execute(
      `SELECT g.id,
              g.user_id,
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
       WHERE g.user_id = ?;`,
      [userId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Guide not found" });
    }

    // Add guide_id field for frontend compatibility
    const guide = rows[0];
    guide.guide_id = guide.id;

    res.json(guide);
  } catch (err) {
    console.error("Error fetching guide by userId:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}

module.exports = getGuideByUserId;
