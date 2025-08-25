const { pool } = require("../../config/db");

const updateGuide = async (req, res) => {
  const { id } = req.params;
  const {
    location,
    languages,
    specialties,
    price_per_hour,
    experience_years,
    description,
    certificates,
  } = req.body;

  try {
    // Update the guide
    await pool.execute(
      `UPDATE guides SET 
                location = ?, 
                languages = ?, 
                specialties = ?, 
                price_per_hour = ?, 
                experience_years = ?, 
                description = ?, 
                certificates = ?
            WHERE id = ?`,
      [
        location,
        JSON.stringify(languages),
        JSON.stringify(specialties),
        price_per_hour,
        experience_years,
        description,
        JSON.stringify(certificates),
        id,
      ]
    );

    // Fetch the updated guide data to return
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
            LEFT JOIN users u ON g.user_id = u.id
            WHERE g.id = ?`,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Guide not found" });
    }

    const guide = rows[0];
    // Add guide_id field for frontend compatibility
    guide.guide_id = guide.id;

    return res.json({
      message: "Guide profile updated successfully",
      guide: guide,
      ...guide, // Include all guide fields at root level for compatibility
    });
  } catch (err) {
    console.error("Error updating guide:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = updateGuide;
