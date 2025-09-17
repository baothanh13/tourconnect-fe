const { query } = require("../../config/db");

const getGuideByUserId = async (req, res) => {
  const { userId } = req.params;

  try {
    const guides = await query(
      `SELECT g.id,
              g.user_id,
              u.name AS user_name, 
              u.email AS user_email,
              u.phone,
              u.avatar_url,
              g.location,
              g.languages,
              g.specialties,
              g.price_per_hour,
              g.experience_years,
              g.description,
              g.certificates,
              g.certificate_img,
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

    if (guides.length === 0) {
      return res.status(404).json({ message: "Guide not found" });
    }

    const guide = guides[0];

    // Luôn thêm field guide_id cho frontend dùng
    return res.json({
      ...guide,
      guide_id: guide.id,
    });
  } catch (err) {
    console.error("Error fetching guide by userId:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = getGuideByUserId;
