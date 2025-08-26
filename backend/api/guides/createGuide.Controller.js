const { pool } = require("../../config/db");
const generateId = require("../../utils/generateId");

const createGuide = async (req, res) => {
  const {
    user_id,
    location,
    languages,
    specialties,
    price_per_hour,
    experience_years,
    description,
    certificates,
  } = req.body;

  try {
    // Check if user_id is provided (from request body or token)
    const userId = user_id || req.user?.user_id || req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized: Missing user ID" });
    }

    // Check if guide profile already exists for this user
    const [existingGuide] = await pool.execute(
      "SELECT id FROM guides WHERE user_id = ?",
      [userId]
    );

    if (existingGuide.length > 0) {
      return res.status(409).json({
        message: "Guide profile already exists for this user",
        guide_id: existingGuide[0].id,
      });
    }

    // Generate new guide_id
    const guideId = generateId("guide");

    // Insert new guide profile
    await pool.execute(
      `INSERT INTO guides (id, user_id, location, languages, specialties, price_per_hour, experience_years, description, certificates) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        guideId,
        userId,
        location,
        JSON.stringify(languages),
        JSON.stringify(specialties),
        price_per_hour,
        experience_years,
        description,
        JSON.stringify(certificates),
      ]
    );

    // Fetch the created guide with user details
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
      [guideId]
    );

    const guide = rows[0];
    guide.guide_id = guide.id; // Add guide_id for frontend compatibility

    return res.status(201).json({
      message: "Guide profile created successfully",
      guide_id: guideId,
      guide: guide,
      ...guide, // Include all guide fields at root level for compatibility
    });
  } catch (err) {
    console.error("Error creating guide profile:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = createGuide;
