const { connectToDB } = require("../../config/db");

const getGuideByUserId = async (req, res) => {
  const { userId } = req.params;

  try {
    const connection = await connectToDB();

    // Get guide data with user information
    const [guides] = await connection.execute(
      `SELECT 
                g.*,
                u.name,
                u.email,
                u.phone,
                u.avatar_url,
                u.created_at as user_created_at
            FROM guides g 
            JOIN users u ON g.user_id = u.id 
            WHERE g.user_id = ?`,
      [userId]
    );

    if (guides.length === 0) {
      return res.status(404).json({ message: "Guide profile not found" });
    }

    const guide = guides[0];

    // Parse JSON fields
    const guideData = {
      ...guide,
      languages: JSON.parse(guide.languages || "[]"),
      specialties: JSON.parse(guide.specialties || "[]"),
      certificates: JSON.parse(guide.certificates || "[]"),
    };

    return res.json(guideData);
  } catch (err) {
    console.error("Get Guide Error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = getGuideByUserId;
